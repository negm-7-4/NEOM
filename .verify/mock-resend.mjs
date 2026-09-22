/**
 * Minimal stand-in for the Resend API, used to exercise the accepted-send path
 * locally without real credentials. Point the app at it with
 * RESEND_BASE_URL=http://127.0.0.1:4321.
 *
 * It captures the full request (headers + body) to .verify/captured-email.json
 * and writes the rendered HTML and plain-text parts to separate files so the
 * Arabic RTL template can be inspected directly.
 */
import { createServer } from "node:http";
import { writeFileSync, mkdirSync } from "node:fs";

const OUT = new URL("./", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

let counter = 0;

createServer((req, res) => {
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    if (req.method !== "POST" || !req.url.startsWith("/emails")) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "not found" }));
      return;
    }

    let payload;
    try {
      payload = JSON.parse(body);
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "bad json" }));
      return;
    }

    const id = `mock-${String(++counter).padStart(4, "0")}`;
    const capture = {
      receivedAt: new Date().toISOString(),
      id,
      idempotencyKeyHeader: req.headers["idempotency-key"] ?? null,
      authorization: req.headers.authorization ? "Bearer <redacted>" : null,
      from: payload.from,
      to: payload.to,
      reply_to: payload.reply_to ?? payload.replyTo ?? null,
      subject: payload.subject,
      headers: payload.headers ?? null,
      htmlLength: payload.html?.length ?? 0,
      textLength: payload.text?.length ?? 0,
    };

    writeFileSync(`${OUT}captured-email.json`, JSON.stringify(capture, null, 2));
    writeFileSync(`${OUT}captured-email.html`, payload.html ?? "");
    writeFileSync(`${OUT}captured-email.txt`, payload.text ?? "");

    console.log(`[mock-resend] accepted ${id} subject="${payload.subject}"`);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ id }));
  });
}).listen(4321, "127.0.0.1", () => console.log("[mock-resend] listening on 4321"));
