import { signToken, verifyToken } from "./auth";
import type { AdminSessionPayload } from "../../types";

const COOKIE_NAME = "admin_token";

export function createSessionHeader(payload: object, expiresInSec = 60 * 60 * 6) {
  const token = signToken(payload, expiresInSec);
  const parts = [
    `${COOKIE_NAME}=${token}`,
    `HttpOnly`,
    `Path=/`,
    `Max-Age=${expiresInSec}`,
    `SameSite=Strict`,
  ];
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  return parts.join("; ");
}

export function clearSessionHeader() {
  const parts = [`${COOKIE_NAME}=`, `HttpOnly`, `Path=/`, `Max-Age=0`, `SameSite=Strict`];
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  return parts.join("; ");
}

function parseCookies(cookieHeader?: string | null) {
  if (!cookieHeader) return {} as Record<string, string>;
  return Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [k, ...v] = c.split("=");
      return [k.trim(), v.join("=").trim()];
    })
  );
}

export function getSessionFromRequest(req: Request): AdminSessionPayload | null {
  const cookieHeader = (req as any).headers?.get?.("cookie") || null;
  const cookies = parseCookies(cookieHeader);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  const payload = verifyToken(token);
  return payload;
}
