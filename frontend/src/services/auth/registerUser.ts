/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { registerUserSchema } from "@/zod/auth.validation";
import { loginUser } from "./loginUser";

export const registerUser = async (_currentState: any, formData: FormData) => {
  try {
    const rawData = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      email: formData.get("email"),
      password: formData.get("password"),
    };
    const validationResult = zodValidator(rawData, registerUserSchema);

    if (!validationResult.success || !validationResult.data) {
      return validationResult;
    }

    const validatedPayload = validationResult.data;

    // API CALL (CLEAN JSON)
    const response = await serverFetch.post("/user/register", {
      body: JSON.stringify(validatedPayload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Registration failed",
      };
    }

    if (result.success) {
      await loginUser(_currentState, formData);
    }

    return result;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Registration Failed. Please try again.",
    };
  }
};
