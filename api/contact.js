import nodemailer from "nodemailer";

/* ── Validation ─────────────────────────────────────────── */
const validateBody = ({ name, email, subject, message }) => {
  const errors = [];

  if (!name?.trim() || name.trim().length < 2)
    errors.push("Invalid name.");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.trim()))
    errors.push("Invalid email.");

  if (!subject?.trim() || subject.trim().length < 3)
    errors.push("Invalid subject.");

  if (!message?.trim() || message.trim().length < 20)
    errors.push("Message too short (min 20 characters).");

  return errors;
};

/* ── Serverless Function ────────────────────────────────── */
export default async function handler(req, res) {
  // CORS headers (important for frontend fetch)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    // Parse body safely (Vercel sometimes sends string)
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const { name, email, subject, message } = body || {};

    // Validate input
    const errors = validateBody({ name, email, subject, message });
    if (errors.length > 0) {
      return res.status(422).json({
        success: false,
        message: errors[0],
      });
    }

    console.log(
      `[Contact] ${new Date().toISOString()} | ${name} <${email}> | ${subject}`
    );

    // Send email only if env variables exist
    if (
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS &&
      process.env.EMAIL_TO
    ) {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
        port: Number(process.env.EMAIL_PORT || 587),
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: `[Portfolio] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html: `
          <h3>New Contact Message</h3>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Subject:</b> ${subject}</p>
          <hr/>
          <p style="white-space:pre-wrap">${message}</p>
        `,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message received successfully!",
    });
  } catch (err) {
    console.error("API Error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
}

/* ── Required for Node runtime (important for nodemailer) ── */
export const config = {
  runtime: "nodejs",
};