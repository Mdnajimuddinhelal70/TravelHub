import { Request, Response } from "express";
import { sendContactMessage } from "./contact.service";

export const createContactMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    const result = await sendContactMessage({ name, email, subject, message });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
      messageId: result?.id,
    });
  } catch (error) {
    console.error("Contact controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
