const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1";

const ROOT_DIR = __dirname;
const MAX_BODY_SIZE = 1_000_000;

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json",
  ".json": "application/json",
};

const sendJson = (res, statusCode, payload) => {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > MAX_BODY_SIZE) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(raw));
    req.on("error", reject);
  });

const safeText = (value, max = 3000) => {
  if (!value) return "";
  const text = String(value).replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max)}...` : text;
};

const buildPrompt = (payload) => {
  const topic = safeText(payload.topicLabel || payload.topicId || "");
  const question = safeText(payload.question, 2000);
  const summary = safeText(payload.summary, 1200);
  const notes = safeText(payload.notes, 1200);
  const resources = Array.isArray(payload.resources) ? payload.resources.slice(0, 6) : [];
  const resourceText = resources
    .map(
      (resource, index) =>
        `${index + 1}. ${safeText(resource.title, 120)} (${safeText(resource.type, 40)}): ${safeText(
          resource.note,
          160
        )} ${safeText(resource.url, 200)}`
    )
    .join("\n");

  const contextLines = [
    `Topic: ${topic}`,
    `Question: ${question}`,
    "",
    "Context:",
    summary ? `Summary: ${summary}` : "Summary: (not provided)",
    notes ? `User Notes: ${notes}` : "User Notes: (not provided)",
    resourceText ? `Resources:\n${resourceText}` : "Resources: (not provided)",
  ];

  return contextLines.join("\n");
};

const extractAnswer = (data) => {
  if (!data) return "";
  if (typeof data.output_text === "string") return data.output_text;
  if (!Array.isArray(data.output)) return "";

  const message = data.output.find((item) => item.type === "message");
  if (!message?.content) return "";

  return message.content
    .filter((part) => part.type === "output_text")
    .map((part) => part.text)
    .join("\n")
    .trim();
};

const handleAnswer = async (req, res) => {
  if (!OPENAI_API_KEY) {
    sendJson(res, 500, { error: "OPENAI_API_KEY is not set on the server." });
    return;
  }

  let payload = {};
  try {
    const raw = await readBody(req);
    payload = raw ? JSON.parse(raw) : {};
  } catch (error) {
    sendJson(res, 400, { error: "Invalid JSON payload." });
    return;
  }

  if (!payload.question) {
    sendJson(res, 400, { error: "Missing question." });
    return;
  }

  const instructions =
    "You are a precise GATE CSE tutor. Use the provided context first. " +
    "If the context is insufficient, say so and ask one clarifying question. " +
    "Keep the explanation concise, step-by-step, and highlight key formulas or rules. " +
    "If you reference a resource, cite it as [1], [2], etc based on the Resources list.";

  const input = buildPrompt(payload);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        instructions,
        input,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      sendJson(res, response.status, { error: errorText || "OpenAI request failed." });
      return;
    }

    const data = await response.json();
    const answer = extractAnswer(data) || "No answer returned.";
    sendJson(res, 200, { answer });
  } catch (error) {
    sendJson(res, 500, { error: "Server error while contacting OpenAI." });
  }
};

const serveStatic = (req, res, pathname) => {
  const filePath = pathname === "/" ? path.join(ROOT_DIR, "index.html") : path.join(ROOT_DIR, pathname);

  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath);
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
    });
    res.end(data);
  });
};

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = requestUrl.pathname;

  if (pathname === "/api/health" && req.method === "GET") {
    sendJson(res, 200, { ok: true, model: OPENAI_MODEL, hasKey: Boolean(OPENAI_API_KEY) });
    return;
  }

  if (pathname === "/api/config" && req.method === "GET") {
    sendJson(res, 200, { model: OPENAI_MODEL });
    return;
  }

  if (pathname === "/api/answer" && req.method === "POST") {
    await handleAnswer(req, res);
    return;
  }

  if (req.method === "GET") {
    serveStatic(req, res, pathname);
    return;
  }

  res.writeHead(405);
  res.end("Method not allowed");
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
