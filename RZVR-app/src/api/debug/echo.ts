export default async function handler(req: Request) {
  try {
    const headersObj: Record<string, string> = {};
    req.headers.forEach((v, k) => (headersObj[k] = v));
    let raw = "";
    try {
      raw = await req.text();
    } catch (e) {
      raw = `<error reading body: ${String(e)}>`;
    }
    return new Response(JSON.stringify({ method: req.method, headers: headersObj, rawBody: raw }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
