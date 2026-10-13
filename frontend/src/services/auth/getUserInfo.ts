/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { UserInfo } from "@/types/user.interface";

export const getUserInfo = async (): Promise<UserInfo> => {
  try {
    // const response = await serverFetch.get("/user/me", {
    //   next: { tags: ["user-info"], revalidate: 180 },
    // });
    const response = await serverFetch.get("/user/me", {
      credentials: "include",
      next: { tags: ["user-info"], revalidate: 180 },
    });

    const result = await response.json();
    console.log("User info response:", result);

    if (!response.ok || !result.success || !result.data) {
      throw new Error(result.message || "Failed to fetch user info");
    }

    return {
      id: result.data.id ?? "",
      name: result.data.name ?? "Unknown User",
      email: result.data.email ?? "",
      role: result.data.role ?? "USER",
    };
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
