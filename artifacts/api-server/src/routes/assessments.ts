import { Router } from "express";
import { db, assessmentsTable, assessmentSessionsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  StartAssessmentBody,
  SubmitAssessmentBody,
  GetAssessmentParams,
  SubmitAssessmentParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.get("/assessments", async (_req, res): Promise<void> => {
  const assessments = await db.select().from(assessmentsTable);
  res.json(
    assessments.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      category: a.category,
      questionCount: a.questionCount,
      estimatedMinutes: a.estimatedMinutes,
      isPremium: a.isPremium,
    }))
  );
});

router.post("/assessments", requireAuth, async (req, res): Promise<void> => {
  const parsed = StartAssessmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [assessment] = await db
    .select()
    .from(assessmentsTable)
    .where(eq(assessmentsTable.id, parsed.data.assessmentId));

  if (!assessment) {
    res.status(404).json({ error: "Assessment not found" });
    return;
  }

  const [session] = await db
    .insert(assessmentSessionsTable)
    .values({
      userId: req.user!.userId,
      assessmentId: assessment.id,
      status: "in_progress",
    })
    .returning();

  const questions = (assessment.questions as Array<{ id: number; text: string; options: string[]; order: number }>) ?? [];

  res.status(201).json({
    id: session.id,
    assessmentId: session.assessmentId,
    assessmentTitle: assessment.title,
    status: session.status,
    questions,
    startedAt: session.startedAt.toISOString(),
    completedAt: session.completedAt?.toISOString() ?? null,
  });
});

router.get("/assessments/my", requireAuth, async (req, res): Promise<void> => {
  const sessions = await db
    .select()
    .from(assessmentSessionsTable)
    .where(eq(assessmentSessionsTable.userId, req.user!.userId));

  const withTitles = await Promise.all(
    sessions.map(async (s) => {
      const [a] = await db.select({ title: assessmentsTable.title }).from(assessmentsTable).where(eq(assessmentsTable.id, s.assessmentId));
      return {
        id: s.id,
        assessmentId: s.assessmentId,
        assessmentTitle: a?.title ?? "Unknown",
        status: s.status,
        questions: [],
        startedAt: s.startedAt.toISOString(),
        completedAt: s.completedAt?.toISOString() ?? null,
      };
    })
  );

  res.json(withTitles);
});

router.get("/assessments/:id/public", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [assessment] = await db.select().from(assessmentsTable).where(eq(assessmentsTable.id, id));
  if (!assessment) { res.status(404).json({ error: "Assessment not found" }); return; }

  if (assessment.isPremium) { res.status(403).json({ error: "Premium assessment requires account" }); return; }

  const questions = (assessment.questions as Array<{ id: number; text: string; options: string[]; order: number }>) ?? [];
  res.json({
    id: assessment.id,
    title: assessment.title,
    description: assessment.description,
    category: assessment.category,
    questions,
  });
});

router.get("/assessments/:id", requireAuth, async (req, res): Promise<void> => {
  const params = GetAssessmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [session] = await db
    .select()
    .from(assessmentSessionsTable)
    .where(
      and(
        eq(assessmentSessionsTable.id, params.data.id),
        eq(assessmentSessionsTable.userId, req.user!.userId)
      )
    );

  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  const [assessment] = await db.select().from(assessmentsTable).where(eq(assessmentsTable.id, session.assessmentId));
  const questions = (assessment?.questions as Array<{ id: number; text: string; options: string[]; order: number }>) ?? [];

  res.json({
    id: session.id,
    assessmentId: session.assessmentId,
    assessmentTitle: assessment?.title ?? "Unknown",
    status: session.status,
    questions,
    startedAt: session.startedAt.toISOString(),
    completedAt: session.completedAt?.toISOString() ?? null,
  });
});

router.post("/assessments/:id/submit", requireAuth, async (req, res): Promise<void> => {
  const params = SubmitAssessmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = SubmitAssessmentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [session] = await db
    .select()
    .from(assessmentSessionsTable)
    .where(
      and(
        eq(assessmentSessionsTable.id, params.data.id),
        eq(assessmentSessionsTable.userId, req.user!.userId)
      )
    );

  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  const [assessment] = await db.select().from(assessmentsTable).where(eq(assessmentsTable.id, session.assessmentId));
  const totalQuestions = assessment?.questionCount ?? 10;
  const score = Math.round((body.data.answers.length / totalQuestions) * 100);

  const recommendations = [
    "Explore careers in Technology & Software Development",
    "Consider roles in Data Science and Analytics",
    "Business and Management careers align with your profile",
  ];

  const careerMatches = [
    { career: "Software Engineer", matchPercent: 92 },
    { career: "Data Scientist", matchPercent: 85 },
    { career: "Product Manager", matchPercent: 78 },
    { career: "UX Designer", matchPercent: 71 },
  ];

  const now = new Date();
  await db
    .update(assessmentSessionsTable)
    .set({
      status: "completed",
      answers: body.data.answers,
      score,
      recommendations,
      careerMatches,
      completedAt: now,
    })
    .where(eq(assessmentSessionsTable.id, session.id));

  res.json({
    sessionId: session.id,
    score,
    totalQuestions,
    recommendations,
    careerMatches,
    completedAt: now.toISOString(),
  });
});

export default router;
