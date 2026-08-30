// Try a few candidate Gemini model names against one key to find what works
import fs from "fs";
import path from "path";

const envPath = path.join(process.cwd(), ".env.local");
const envRaw = fs.readFileSync(envPath, "utf8");
const env = {};
for (const line of envRaw.split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const i = t.indexOf("=");
  if (i === -1) continue;
  const k = t.slice(0, i).trim();
  let v = t.slice(i + 1).trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
  env[k] = v;
}

const key = env["GEMINI_API_KEY1"]?.trim();
if (!key) {
  console.log("No GEMINI_API_KEY1 found");
  process.exit(0);
}

const candidates = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-001",
  "gemini-1.5-flash-latest",
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
  "gemini-2.0-flash-exp",
  "gemini-flash-latest",
  "gemini-1.5-pro",
  "gemini-2.5-flash",
];

console.log(`Testing model names with GEMINI_API_KEY1 (${key.slice(0, 6)}…${key.slice(-4)})\n`);

for (const model of candidates) {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=` + key;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: "Reply with exactly: OK" }] }],
        generationConfig: { maxOutputTokens: 10 },
      }),
      signal: AbortSignal.timeout(15000),
    });
    let body = null;
    try { body = await res.json(); } catch {}
    const text = body?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const err = body?.error?.message ?? "";
    const tag = res.ok ? "✅" : "❌";
    console.log(`${tag} ${model.padEnd(28)} HTTP ${res.status}  ${res.ok ? JSON.stringify(text.slice(0,30)) : err.slice(0, 80)}`);
  } catch (e) {
    console.log(`❌ ${model.padEnd(28)} ERR ${String(e).slice(0, 80)}`);
  }
}
