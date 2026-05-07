import { Router } from "express";
import { db, contactMessagesTable, newsletterSubscribersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { SubmitContactBody, SubscribeNewsletterBody } from "@workspace/api-zod";
import { logger } from "../lib/logger.js";

const router = Router();

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  await db.insert(contactMessagesTable).values(parsed.data);

  // Send email via Resend if configured
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "AesthTech Solutions <support@aesthetechsolutions.co.in>",
          to: ["support@aesthetechsolutions.co.in"],
          subject: `New Contact: ${parsed.data.subject}`,
          html: `<h2>New Contact Message</h2>
            <p><strong>From:</strong> ${parsed.data.name} (${parsed.data.email})</p>
            <p><strong>Subject:</strong> ${parsed.data.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${parsed.data.message}</p>`,
        }),
      });
    } catch (err) {
      logger.error({ err }, "Failed to send contact email");
    }
  }

  res.json({ message: "Message sent successfully! We will get back to you soon." });
});

router.post("/contact/newsletter", async (req, res): Promise<void> => {
  const parsed = SubscribeNewsletterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db
    .select()
    .from(newsletterSubscribersTable)
    .where(eq(newsletterSubscribersTable.email, parsed.data.email));

  if (existing) {
    res.json({ message: "You are already subscribed!" });
    return;
  }

  await db.insert(newsletterSubscribersTable).values({ email: parsed.data.email });

  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "AesthTech Solutions <support@aesthetechsolutions.co.in>",
          to: [parsed.data.email],
          subject: "Welcome to AesthTech Solutions Newsletter!",
          html: `<h1>Welcome aboard!</h1>
            <p>Thank you for subscribing to AesthTech Solutions newsletter.</p>
            <p>You'll receive the latest updates on our products, career tips, and innovation insights.</p>
            <p>Best regards,<br>The AesthTech Team</p>`,
        }),
      });
    } catch (err) {
      logger.error({ err }, "Failed to send welcome email");
    }
  }

  res.json({ message: "Successfully subscribed to newsletter!" });
});

export default router;
