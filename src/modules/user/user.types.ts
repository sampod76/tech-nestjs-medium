// 🔹 constant (UPPER_CASE)
export const ROLE = {
  OWNER: "owner",
  SYSTEM_ADMIN: "system_admin",

  ADMIN: "admin",
  ADMIN_MANAGER: "admin_manager",

  MANAGER: "manager",
  OPERATOR: "operator",

  MODERATOR: "moderator",
  REVIEWER: "reviewer",
  SUPPORT: "support",

  USER: "user",
  GUEST: "guest",
} as const;

// 🔹 type (PascalCase, no prefix)
export type Role = (typeof ROLE)[keyof typeof ROLE];
