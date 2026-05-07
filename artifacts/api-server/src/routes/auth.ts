import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { RegisterBody, LoginBody, GetMeResponse } from "@workspace/api-zod";
import { requireAuth, signToken } from "../middlewares/auth.js";
import { logger } from "../lib/logger.js";

const router = Router();

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

router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, email, password } = parsed.data;

  const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (existing) {
    res.status(400).json({ error: "Email already registered" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db.insert(usersTable).values({ name, email, passwordHash }).returning();

  const token = signToken(user.id, user.role);

  res.status(201).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isPremium: user.isPremium,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      phone: user.phone,
      createdAt: user.createdAt.toISOString(),
    },
  });

  sendEmail(
    email,
    "Welcome to MindMap Career Compass!",
    `<!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background: #0f0f17; color: #e2e8f0; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 40px auto; background: #1a1a2e; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6b46c1, #3b82f6); padding: 40px; text-align: center;">
          <h1 style="margin: 0; color: #fff; font-size: 28px;">Welcome, ${name}! 🎉</h1>
          <p style="margin: 12px 0 0; color: rgba(255,255,255,0.85); font-size: 16px;">Your MindMap Career Compass account is ready.</p>
        </div>
        <div style="padding: 40px;">
          <p style="color: #a0aec0; font-size: 15px; line-height: 1.7;">
            Thank you for joining <strong style="color:#e2e8f0">AesthTech Solutions</strong>. MindMap Career Compass helps you discover your strengths, tackle skill challenges, and chart your career growth.
          </p>
          <div style="margin: 28px 0; text-align: center;">
            <a href="https://aesthetechsolutions.co.in/mindmap/dashboard" style="display: inline-block; background: linear-gradient(135deg,#6b46c1,#3b82f6); color: #fff; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 15px;">
              Go to Dashboard →
            </a>
          </div>
          <p style="color: #718096; font-size: 13px; line-height: 1.6;">
            With your free account you can:<br>
            ✓ Take career assessments<br>
            ✓ Browse skill challenges<br>
            ✓ Track your progress<br><br>
            Upgrade anytime to unlock advanced analytics and priority support.
          </p>
        </div>
        <div style="background: #12121e; padding: 20px; text-align: center; color: #4a5568; font-size: 12px;">
          AesthTech Solutions · support@aesthetechsolutions.co.in
        </div>
      </div>
    </body>
    </html>`
  );
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = signToken(user.id, user.role);

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isPremium: user.isPremium,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      phone: user.phone,
      createdAt: user.createdAt.toISOString(),
    },
  });
});

router.post("/auth/logout", (_req, res): void => {
  res.json({ message: "Logged out successfully" });
});

router.get("/auth/me", requireAuth, async (req, res): Promise<void> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.userId));
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  res.json(
    GetMeResponse.parse({
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

export default router;
