import ejs from "ejs";
import fs from "fs";
import httpStatus from "http-status-codes";
import nodemailer from "nodemailer";
import path from "path";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";

const transporter = nodemailer.createTransport({
  host: envVars.EMAIL_HOST,
  port: Number(envVars.EMAIL_PORT),
  // port 465 → secure: true, port 587/2525 → secure: false
  secure: Number(envVars.EMAIL_PORT) === 465,
  auth: {
    user: envVars.EMAIL_USER,
    pass: envVars.EMAIL_PASS,
  },
});

// Startup-এ connection verify করো
transporter.verify((error) => {
  if (error) {
    console.error("❌ Email transporter verification failed:", error.message);
  } else {
    console.log("✅ Email transporter is ready");
  }
});

interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: SendEmailOptions) => {
  try {
    const templatePath = path.join(
      __dirname,
      "..",
      "templates",
      `${templateName}.ejs`,
    );
    if (!fs.existsSync(templatePath)) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Email template not found: ${templateName}.ejs`,
      );
    }

    const html = await ejs.renderFile(templatePath, templateData ?? {});

    const info = await transporter.sendMail({
      from: `"Travel Hub" <${envVars.EMAIL_SENDER}>`,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });

    console.log(`✉️ Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    const message =
      error instanceof Error ? error.message : "Unknown email error";

    console.error("❌ sendEmail failed:", message);

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Email error: ${message}`,
    );
  }
};
