export interface IContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface IContactResponse {
  success: boolean;
  message?: string;
  messageId?: string;
  errors?: string[];
  error?: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

export const sendContactMessage = async (
  payload: IContactPayload,
): Promise<IContactResponse> => {
  const res = await fetch(`${API_BASE_URL}/contact/send-message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Failed to send message",
      errors: data.errors,
      error: data.error,
    };
  }

  return data;
};
