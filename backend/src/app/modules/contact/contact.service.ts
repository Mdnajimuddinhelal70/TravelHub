import { envVars } from "../../config/env";
import { sendEmail } from "../../utils/email.service";

interface IContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactMessage = async (payload: IContactPayload) => {
  return await sendEmail({
    to: envVars.EMAIL_USER,
    subject: `TravelHub Contact: ${payload.subject}`,
    templateName: "contact",
    templateData: {
      name: payload.name,
      email: payload.email,
      subject: payload.subject,
      message: payload.message,
    },
    replyTo: payload.email,
  });
};
