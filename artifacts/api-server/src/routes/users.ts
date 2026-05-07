import { Router } from "express";
import { db, usersTable, assessmentSessionsTable, challengeAttemptsTable, subscriptionsTable } from "@workspace/db";
import { eq, count, sum, sql } from "drizzle-orm";
import { UpdateProfileBody, UpdateProfileResponse, GetUserStatsResponse } from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.patch("/users/profile", requireAuth, async (req, res): Promise<void> => {
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  type UserUpdate = Partial<Pick<typeof usersTable.$inferInsert, "name" | "bio" | "phone" | "avatarUrl">>;
  const updates: UserUpdate = {};
  if (parsed.data.name !== undefined) updates.name = parsed.data.name;
  if (parsed.data.bio !== undefined) updates.bio = parsed.data.bio;
  if (parsed.data.phone !== undefined) updates.phone = parsed.data.phone;
  if (parsed.data.avatarUrl !== undefined) updates.avatarUrl = parsed.data.avatarUrl;

  const [user] = await db
    .update(usersTable)
    .set(updates)
    .where(eq(usersTable.id, req.user!.userId))
    .returning();

  res.json(
    UpdateProfileResponse.parse({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isPremium: user.isPremium,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      phone: user.phone,
      createdAt: user.createdAt.toISOString(),
    })
  );
});

router.get("/users/stats", requireAuth, async (req, res): Promise<void> => {
  const userId = req.user!.userId;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));

  const [assessmentCount] = await db
    .select({ count: count() })
    .from(assessmentSessionsTable)
    .where(eq(assessmentSessionsTable.userId, userId));

  const [challengeCount] = await db
    .select({ count: count() })
    .from(challengeAttemptsTable)
    .where(eq(challengeAttemptsTable.userId, userId));

  const [scoreResult] = await db
    .select({ total: sum(challengeAttemptsTable.score) })
    .from(challengeAttemptsTable)
    .where(eq(challengeAttemptsTable.userId, userId));

  const [sub] = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.userId, userId));

  res.json(
    GetUserStatsResponse.parse({
      assessmentsCompleted: assessmentCount?.count ?? 0,
      challengesAttempted: challengeCount?.count ?? 0,
      totalScore: Number(scoreResult?.total ?? 0),
      rank: null,
      streakDays: 0,
      isPremium: user?.isPremium ?? false,
    })
  );
});

export default router;
