import ejs from "ejs";
import path from "path";
import { Resend } from "resend";
import { envVars } from "../config/env";

// ✅ Env validation — startup-এই fail করো, silent fail না
if (!envVars.RESEND_API_KEY) {
  throw new Error("❌ RESEND_API_KEY is missing in .env");
}
if (!envVars.EMAIL_SENDER_EMAIL) {
  throw new Error("❌ EMAIL_SENDER_EMAIL is missing in .env");
}

const resend = new Resend(envVars.RESEND_API_KEY);

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  templateName: string;
  templateData: Record<string, unknown>;
  replyTo?: string;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }[];
}

export const sendEmail = async (options: SendEmailOptions) => {
  try {
    // ✅ Template path — dev & prod দুটোতেই কাজ করবে
    // (prod-এ .ejs ফাইলগুলো dist/app/templates-এ copy করতে হবে)
    const templatePath = path.join(
      process.cwd(),
      "src/app/templates",
      `${options.templateName}.ejs`,
    );

    const html = await ejs.renderFile(templatePath, options.templateData);

    const { data, error } = await resend.emails.send({
      from: `Travel Hub <${envVars.EMAIL_SENDER_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html,
      replyTo: options.replyTo,
      attachments: options.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentType: a.contentType,
      })),
    });

    if (error) {
      console.error("❌ Resend error:", error);
      throw new Error(error.message);
    }

    console.log("✅ Email sent:", data?.id);
    return data;
  } catch (error) {
    console.error("❌ Email send failed:", error);
    throw error;
  }
};
