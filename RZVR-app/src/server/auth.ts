import * as crypto from "crypto";

const SECRET = (process.env.ADMIN_SECRET as string) || "dev-secret-change-me";

function base64url(input: Buffer) {
  return input.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export function signToken(payload: object, expiresInSec = 3600) {
  const exp = Math.floor(Date.now() / 1000) + expiresInSec;
  const data = { ...payload, exp };
  const json = Buffer.from(JSON.stringify(data));
  const sig = crypto.createHmac("sha256", SECRET).update(json).digest();
  return `${base64url(json)}.${base64url(sig)}`;
}

export function verifyToken(token: string) {
  try {
    const [jsonB64, sigB64] = token.split(".");
    if (!jsonB64 || !sigB64) return null;
    const json = Buffer.from(jsonB64.replace(/-/g, "+").replace(/_/g, "/"), "base64");
    const expectedSig = crypto.createHmac("sha256", SECRET).update(json).digest();
    const sig = Buffer.from(sigB64.replace(/-/g, "+").replace(/_/g, "/"), "base64");
    if (!crypto.timingSafeEqual(expectedSig, sig)) return null;
    const data = JSON.parse(json.toString());
    if (data.exp && typeof data.exp === "number" && data.exp < Math.floor(Date.now() / 1000))
      return null;
    return data;
  } catch (e) {
    return null;
  }
}
