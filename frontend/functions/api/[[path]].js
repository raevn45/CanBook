export async function onRequest(context) {
  const apiOrigin = String(context.env.CANBOOK_API_ORIGIN || "").replace(/\/$/, "");

  if (!apiOrigin) {
    return Response.json({ error: "CANBOOK_API_ORIGIN is not configured." }, { status: 503 });
  }

  const incoming = new URL(context.request.url);
  const upstream = new URL(`${apiOrigin}${incoming.pathname}${incoming.search}`);
  const headers = new Headers(context.request.headers);
  headers.delete("host");
  headers.delete("origin");
  headers.delete("referer");

  const request = new Request(upstream.toString(), {
    method: context.request.method,
    headers,
    body: ["GET", "HEAD"].includes(context.request.method) ? undefined : context.request.body,
    redirect: "manual",
  });

  const response = await fetch(request);
  const outputHeaders = new Headers(response.headers);
  outputHeaders.delete("content-length");
  outputHeaders.delete("content-encoding");
  outputHeaders.set("cache-control", "no-store");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: outputHeaders,
  });
}
