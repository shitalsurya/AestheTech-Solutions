import { Router } from "express";
import crypto from "crypto";
import { db, paymentsTable, subscriptionsTable, usersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  CreatePaymentOrderBody,
  VerifyPaymentBody,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth.js";
import { logger } from "../lib/logger.js";

const router = Router();

const PLAN_PRICES: Record<string, number> = {
  monthly: 29900,
  annual: 199900,
  lifetime: 499900,
};

router.post("/payments/create-order", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreatePaymentOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { planId } = parsed.data;
  const amount = PLAN_PRICES[planId];

  if (!amount) {
    res.status(400).json({ error: "Invalid plan" });
    return;
  }

  const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!razorpayKeyId || !razorpayKeySecret) {
    // Demo mode: return a fake order for development
    const fakeOrderId = `order_demo_${Date.now()}`;
    await db.insert(paymentsTable).values({
      userId: req.user!.userId,
      razorpayOrderId: fakeOrderId,
      amount,
      currency: "INR",
      status: "pending",
      planId,
    });

    res.status(201).json({
      orderId: fakeOrderId,
      amount,
      currency: "INR",
      razorpayKeyId: razorpayKeyId || "rzp_test_demo",
      planId,
    });
    return;
  }

  try {
    const Razorpay = (await import("razorpay")).default;
    const razorpay = new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret });

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${req.user!.userId}_${Date.now()}`,
    });

    await db.insert(paymentsTable).values({
      userId: req.user!.userId,
      razorpayOrderId: order.id,
      amount,
      currency: "INR",
      status: "pending",
      planId,
    });

    res.status(201).json({
      orderId: order.id,
      amount,
      currency: "INR",
      razorpayKeyId,
      planId,
    });
  } catch (err) {
    logger.error({ err }, "Razorpay order creation failed");
    res.status(500).json({ error: "Payment service unavailable" });
  }
});

router.post("/payments/verify", requireAuth, async (req, res): Promise<void> => {
  const parsed = VerifyPaymentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, planId } = parsed.data;
  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

  if (razorpayKeySecret) {
    const generated = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generated !== razorpaySignature) {
      res.status(400).json({ error: "Invalid payment signature" });
      return;
    }
  }

  const [payment] = await db
    .select()
    .from(paymentsTable)
    .where(
      and(
        eq(paymentsTable.razorpayOrderId, razorpayOrderId),
        eq(paymentsTable.userId, req.user!.userId)
      )
    );

  if (!payment) {
    res.status(404).json({ error: "Payment not found" });
    return;
  }

  await db
    .update(paymentsTable)
    .set({ razorpayPaymentId, status: "paid" })
    .where(eq(paymentsTable.id, payment.id));

  // Grant premium access
  const expiresAt = planId === "lifetime" ? null : planId === "annual"
    ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await db.insert(subscriptionsTable).values({
    userId: req.user!.userId,
    planId,
    status: "active",
    paymentId: payment.id,
    expiresAt,
  });

  await db
    .update(usersTable)
    .set({ isPremium: true })
    .where(eq(usersTable.id, req.user!.userId));

  res.json({ success: true, message: "Payment verified successfully", isPremium: true });
});

router.get("/payments/history", requireAuth, async (req, res): Promise<void> => {
  const payments = await db
    .select()
    .from(paymentsTable)
    .where(eq(paymentsTable.userId, req.user!.userId));

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

router.get("/payments/subscription", requireAuth, async (req, res): Promise<void> => {
  const [sub] = await db
    .select()
    .from(subscriptionsTable)
    .where(and(eq(subscriptionsTable.userId, req.user!.userId), eq(subscriptionsTable.status, "active")));

  const [user] = await db.select({ isPremium: usersTable.isPremium }).from(usersTable).where(eq(usersTable.id, req.user!.userId));

  res.json({
    id: sub?.id ?? null,
    planId: sub?.planId ?? null,
    isPremium: user?.isPremium ?? false,
    expiresAt: sub?.expiresAt?.toISOString() ?? null,
    status: sub ? "active" : "none",
  });
});

export default router;
