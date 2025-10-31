import { getSessionFromRequest } from "../../server/session";

export default async function handler(req: Request) {
  const payload = getSessionFromRequest(req as Request | any);
  if (!payload)
    return new Response(JSON.stringify({ authenticated: false }), {
      headers: { "Content-Type": "application/json" },
    });
  return new Response(JSON.stringify({ authenticated: true, payload }), {
    headers: { "Content-Type": "application/json" },
  });
}
