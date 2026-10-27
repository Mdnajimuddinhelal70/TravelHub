import { getCookie } from "@/services/auth/tokenHandlers";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

const serverFetchHelper = async (
  endpoint: string,
  options: RequestInit,
): Promise<Response> => {
  const { headers, ...restOptions } = options;
  const accessToken = await getCookie("accessToken");

  const headersWithAuth = new Headers(headers);

  // if (accessToken) {
  //   headersWithAuth.set("Authorization", accessToken);
  // }
  if (accessToken) {
    headersWithAuth.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${BACKEND_API_URL}${endpoint}`, {
    ...restOptions,
    headers: headersWithAuth,
    credentials: "include",
  });

  return response;
};

export const serverFetch = {
  get: (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "GET" }),

  post: (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "POST" }),

  put: (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "PUT" }),

  patch: (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "PATCH" }),

  delete: (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "DELETE" }),
};
