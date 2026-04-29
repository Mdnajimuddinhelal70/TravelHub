export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "USER" | "GUIDE";
}
