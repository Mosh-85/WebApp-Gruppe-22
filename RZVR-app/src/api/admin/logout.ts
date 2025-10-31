import { clearSessionHeader } from "../../server/session";

export default async function handler(req: Request) {
  const res = new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
  res.headers.append("Set-Cookie", clearSessionHeader());
  return res;
}
