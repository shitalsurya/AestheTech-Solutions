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

const PLAN_LABELS: Record<string, { name: string; price: string; period: string }> = {
  monthly: { name: "Monthly", price: "₹299", period: "per month" },
  annual: { name: "Annual", price: "₹1,999", period: "per year" },
  lifetime: { name: "Lifetime", price: "₹4,999", period: "one-time" },
};

async function sendEmail(to: string, subject: string, html: string) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) return;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "AesthTech Solutions <support@aesthetechsolutions.co.in>",
        to: [to],
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      logger.error({ status: res.status, body }, "Resend API error");
    }
  } catch (err) {
    logger.error({ err }, "Failed to send email");
  }
}

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
      razorpayKeyId: "rzp_test_demo",
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

  const [user] = await db
    .select({ name: usersTable.name, email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.id, req.user!.userId));

  res.json({ success: true, message: "Payment verified successfully", isPremium: true });

  if (user?.email) {
    const plan = PLAN_LABELS[planId] ?? { name: planId, price: "", period: "" };
    const expiryText = expiresAt
      ? `Your subscription is valid until <strong>${expiresAt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</strong>.`
      : "You have <strong>lifetime access</strong> — no renewals ever.";

    sendEmail(
      user.email,
      "Payment Confirmed — You're now Premium! 🎊",
      `<!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; background: #0f0f17; color: #e2e8f0; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 40px auto; background: #1a1a2e; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #6b46c1, #3b82f6); padding: 40px; text-align: center;">
            <h1 style="margin: 0; color: #fff; font-size: 28px;">Payment Confirmed! 🎊</h1>
            <p style="margin: 12px 0 0; color: rgba(255,255,255,0.85); font-size: 16px;">Welcome to MindMap Premium, ${user.name}!</p>
          </div>
          <div style="padding: 40px;">
            <div style="background: #12121e; border-radius: 12px; padding: 24px; margin-bottom: 28px;">
              <h3 style="margin: 0 0 16px; color: #a78bfa; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="color: #718096; padding: 6px 0; font-size: 14px;">Plan</td>
                  <td style="color: #e2e8f0; text-align: right; font-size: 14px; font-weight: bold;">${plan.name}</td>
                </tr>
                <tr>
                  <td style="color: #718096; padding: 6px 0; font-size: 14px;">Amount Paid</td>
                  <td style="color: #e2e8f0; text-align: right; font-size: 14px; font-weight: bold;">${plan.price}</td>
                </tr>
                <tr>
                  <td style="color: #718096; padding: 6px 0; font-size: 14px;">Payment ID</td>
                  <td style="color: #e2e8f0; text-align: right; font-size: 13px; font-family: monospace;">${razorpayPaymentId}</td>
                </tr>
                <tr>
                  <td style="color: #718096; padding: 6px 0; font-size: 14px;">Status</td>
                  <td style="text-align: right;"><span style="background: #065f46; color: #6ee7b7; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;">PAID</span></td>
                </tr>
              </table>
            </div>
            <p style="color: #a0aec0; font-size: 14px; line-height: 1.7; margin: 0 0 8px;">${expiryText}</p>
            <p style="color: #a0aec0; font-size: 14px; line-height: 1.7;">You now have full access to all premium features including advanced analytics, all challenges, and priority support.</p>
            <div style="margin: 28px 0; text-align: center;">
              <a href="https://aesthetechsolutions.co.in/mindmap/dashboard" style="display: inline-block; background: linear-gradient(135deg,#6b46c1,#3b82f6); color: #fff; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 15px;">
                Go to Dashboard →
              </a>
            </div>
          </div>
          <div style="background: #12121e; padding: 20px; text-align: center; color: #4a5568; font-size: 12px;">
            AesthTech Solutions · support@aesthetechsolutions.co.in<br>
            Keep this email as your payment receipt.
          </div>
        </div>
      </body>
      </html>`
    );
  }
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
