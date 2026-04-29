/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";

import { getCookie } from "@/lib/tokenHandlers";
import { UserInfo } from "@/types/user.interface";
import jwt, { JwtPayload } from "jsonwebtoken";

export const getUserInfo = async (): Promise<UserInfo | any> => {
  try {
    // API call to backend
    const response = await serverFetch.get("/auth/me", {
      next: { tags: ["user-info"], revalidate: 180 },
    });
    const result = await response.json();

    // Check if success
    if (!result.success) {
      throw new Error("Failed to fetch user info");
    }

    // Get access token from cookies
    const accessToken = await getCookie("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }

    // Verify token
    const verifiedToken = jwt.verify(
      accessToken,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    // Build user info object
    const userInfo: UserInfo = {
      id: result.data?.id || verifiedToken.userId || "",
      name: result.data?.name || verifiedToken.name || "Unknown User",
      email: result.data?.email || verifiedToken.email || "",
      role: result.data?.role || verifiedToken.role || "USER", // default USER
    };

    return userInfo;
  } catch (error: any) {
    console.error("Error fetching user info:", error);
    return {
      id: "",
      name: "Unknown User",
      email: "",
      role: "USER",
    };
  }
};
