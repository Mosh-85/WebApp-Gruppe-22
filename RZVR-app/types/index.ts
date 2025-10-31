export interface Staff {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  password: string;
  role: boolean;
  created_at: string | null;
}

export interface AdminSessionPayload {
  user: string; // email
  isAdmin: boolean;
  exp?: number;
}

export interface StaffRow {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  password?: string;
  role: boolean | number | string;
  created_at?: string | null;
}

export interface CreateUserPayload {
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}

export interface AppEnv {
  DB?: any;
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_DATABASE_ID?: string;
  CLOUDFLARE_D1_TOKEN?: string;
  ADMIN_SECRET?: string;
}

export const COOKIE_NAME = "admin_token";
export const SESSION_EXPIRES_SECONDS = 60 * 60 * 6;
