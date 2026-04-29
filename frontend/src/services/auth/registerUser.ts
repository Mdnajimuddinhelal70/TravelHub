/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";

import { registerUserValidationZodSchema } from "@/zod/auth.validation";
import { loginUser } from "./loginUser";

export const registerUser = async (
  _currentState: any,
  formData: any,
): Promise<any> => {
  try {
    const payload = {
      name: formData.get("name"),
      address: formData.get("address"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    const validationResult = zodValidator(
      payload,
      registerUserValidationZodSchema,
    );
    if (!validationResult.success) {
      return validationResult;
    }

    const validatedPayload: any = validationResult.data;

    const registerData = {
      name: validatedPayload.name,
      address: validatedPayload.address,
      email: validatedPayload.email,
      password: validatedPayload.password,
    };

    const newFormData = new FormData();
    newFormData.append("data", JSON.stringify(registerData));

    const res = await serverFetch.post("/user/create-user", {
      body: newFormData,
    });
    const result = await res.json();

    if (result.success) {
      await loginUser(_currentState, formData);
    }

    return result;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.log(error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Registration Failed. Please try again.",
    };
  }
};
