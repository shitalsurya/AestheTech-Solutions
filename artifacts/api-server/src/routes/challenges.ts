import { Router } from "express";
import { db, challengesTable, challengeAttemptsTable, usersTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import {
  GetChallengeParams,
  SubmitChallengeAttemptParams,
  SubmitChallengeAttemptBody,
  ListChallengesQueryParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.get("/challenges", async (req, res): Promise<void> => {
  const params = ListChallengesQueryParams.safeParse(req.query);
  const challenges = await db.select().from(challengesTable);

  let filtered = challenges;
  if (params.success && params.data.difficulty) {
    filtered = filtered.filter((c) => c.difficulty === params.data.difficulty);
  }
  if (params.success && params.data.category) {
    filtered = filtered.filter((c) => c.category === params.data.category);
  }

  res.json(
    filtered.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      category: c.category,
      difficulty: c.difficulty,
      timeLimit: c.timeLimit,
      questionCount: c.questionCount,
      isPremium: c.isPremium,
      attempts: c.attempts,
    }))
  );
});

router.get("/challenges/leaderboard", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      userId: challengeAttemptsTable.userId,
      totalScore: sql<number>`sum(${challengeAttemptsTable.score})`,
      challengesCompleted: sql<number>`count(*)`,
    })
    .from(challengeAttemptsTable)
    .groupBy(challengeAttemptsTable.userId)
    .orderBy(desc(sql`sum(${challengeAttemptsTable.score})`))
    .limit(20);

  const withNames = await Promise.all(
    rows.map(async (row, i) => {
      const [user] = await db
        .select({ name: usersTable.name, avatarUrl: usersTable.avatarUrl })
        .from(usersTable)
        .where(eq(usersTable.id, row.userId));
      return {
        rank: i + 1,
        userId: row.userId,
        userName: user?.name ?? "Unknown",
        avatarUrl: user?.avatarUrl ?? null,
        totalScore: Number(row.totalScore),
        challengesCompleted: Number(row.challengesCompleted),
      };
    })
  );

  res.json(withNames);
});

router.get("/challenges/my-attempts", requireAuth, async (req, res): Promise<void> => {
  const attempts = await db
    .select()
    .from(challengeAttemptsTable)
    .where(eq(challengeAttemptsTable.userId, req.user!.userId))
    .orderBy(desc(challengeAttemptsTable.completedAt));

  const withTitles = await Promise.all(
    attempts.map(async (a) => {
      const [c] = await db.select({ title: challengesTable.title }).from(challengesTable).where(eq(challengesTable.id, a.challengeId));
      return {
        id: a.id,
        challengeId: a.challengeId,
        challengeTitle: c?.title ?? "Unknown",
        score: a.score,
        totalQuestions: a.totalQuestions,
        timeTaken: a.timeTaken,
        rank: null,
        isPassed: a.isPassed,
        completedAt: a.completedAt.toISOString(),
      };
    })
  );

  res.json(withTitles);
});

router.get("/challenges/:id", async (req, res): Promise<void> => {
  const params = GetChallengeParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [challenge] = await db.select().from(challengesTable).where(eq(challengesTable.id, params.data.id));
  if (!challenge) {
    res.status(404).json({ error: "Challenge not found" });
    return;
  }

  const questions = (challenge.questions as Array<{ id: number; text: string; options: string[]; order: number }>) ?? [];

  res.json({
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    category: challenge.category,
    difficulty: challenge.difficulty,
    timeLimit: challenge.timeLimit,
    isPremium: challenge.isPremium,
    questions,
  });
});

router.post("/challenges/:id/attempt", requireAuth, async (req, res): Promise<void> => {
  const params = SubmitChallengeAttemptParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = SubmitChallengeAttemptBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [challenge] = await db.select().from(challengesTable).where(eq(challengesTable.id, params.data.id));
  if (!challenge) {
    res.status(404).json({ error: "Challenge not found" });
    return;
  }

  const questions = (challenge.questions as Array<{ id: number; correctAnswer: number }>) ?? [];
  let correct = 0;
  for (const answer of body.data.answers) {
    const q = questions.find((q) => q.id === answer.questionId);
    if (q && q.correctAnswer === answer.answer) correct++;
  }

  const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
  const isPassed = score >= 60;

  const [attempt] = await db
    .insert(challengeAttemptsTable)
    .values({
      userId: req.user!.userId,
      challengeId: challenge.id,
      score,
      totalQuestions: challenge.questionCount,
      timeTaken: body.data.timeTaken,
      isPassed,
      answers: body.data.answers,
    })
    .returning();

  await db
    .update(challengesTable)
    .set({ attempts: challenge.attempts + 1 })
    .where(eq(challengesTable.id, challenge.id));

  res.json({
    id: attempt.id,
    challengeId: challenge.id,
    challengeTitle: challenge.title,
    score,
    totalQuestions: challenge.questionCount,
    timeTaken: body.data.timeTaken,
    rank: null,
    isPassed,
    completedAt: attempt.completedAt.toISOString(),
  });
});

export default router;
