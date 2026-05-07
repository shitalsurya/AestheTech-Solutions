import { Router } from "express";
import { db, usersTable, paymentsTable, assessmentSessionsTable, challengeAttemptsTable, subscriptionsTable } from "@workspace/db";
import { eq, count, sum, gt, sql } from "drizzle-orm";
import { ListAdminUsersQueryParams } from "@workspace/api-zod";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";

const router = Router();

router.get("/admin/stats", requireAuth, requireAdmin, async (_req, res): Promise<void> => {
  const [totalUsers] = await db.select({ count: count() }).from(usersTable);
  const [premiumUsers] = await db.select({ count: count() }).from(usersTable).where(eq(usersTable.isPremium, true));
  const [totalRevenue] = await db.select({ total: sum(paymentsTable.amount) }).from(paymentsTable).where(eq(paymentsTable.status, "paid"));
  const [assessments] = await db.select({ count: count() }).from(assessmentSessionsTable).where(eq(assessmentSessionsTable.status, "completed"));
  const [challenges] = await db.select({ count: count() }).from(challengeAttemptsTable);
  const [activeSubs] = await db.select({ count: count() }).from(subscriptionsTable).where(eq(subscriptionsTable.status, "active"));

  const recentCutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [recentSignups] = await db.select({ count: count() }).from(usersTable).where(gt(usersTable.createdAt, recentCutoff));

  res.json({
    totalUsers: totalUsers?.count ?? 0,
    premiumUsers: premiumUsers?.count ?? 0,
    totalRevenue: Number(totalRevenue?.total ?? 0),
    assessmentsCompleted: assessments?.count ?? 0,
    challengesAttempted: challenges?.count ?? 0,
    recentSignups: recentSignups?.count ?? 0,
    activeSubscriptions: activeSubs?.count ?? 0,
  });
});

router.get("/admin/users", requireAuth, requireAdmin, async (req, res): Promise<void> => {
  const params = ListAdminUsersQueryParams.safeParse(req.query);
  const page = params.success ? (params.data.page ?? 1) : 1;
  const limit = params.success ? (params.data.limit ?? 20) : 20;
  const offset = (page - 1) * limit;

  const [totalCount] = await db.select({ count: count() }).from(usersTable);
  const users = await db.select().from(usersTable).limit(limit).offset(offset);

  res.json({
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      isPremium: u.isPremium,
      avatarUrl: u.avatarUrl ?? null,
      bio: u.bio ?? null,
      phone: u.phone ?? null,
      createdAt: u.createdAt.toISOString(),
    })),
    total: totalCount?.count ?? 0,
    page,
  });
});

router.get("/admin/payments", requireAuth, requireAdmin, async (_req, res): Promise<void> => {
  const payments = await db.select().from(paymentsTable).orderBy(sql`${paymentsTable.createdAt} DESC`);

  res.json(
    payments.map((p) => ({
      id: p.id,
      userId: p.userId,
      razorpayOrderId: p.razorpayOrderId,
      razorpayPaymentId: p.razorpayPaymentId ?? null,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      planId: p.planId,
      createdAt: p.createdAt.toISOString(),
    }))
  );
});

export default router;
