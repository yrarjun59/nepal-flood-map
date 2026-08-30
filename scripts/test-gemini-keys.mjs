// Test script: load GEMINI_API_KEY1-7 from .env.local and verify each against the live API
import fs from "fs";
import path from "path";

const envPath = path.join(process.cwd(), ".env.local");
const envRaw = fs.readFileSync(envPath, "utf8");

// Parse .env.local into a map (handles KEY=value, ignores comments/blank lines)
const env = {};
for (const line of envRaw.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const idx = trimmed.indexOf("=");
  if (idx === -1) continue;
  const key = trimmed.slice(0, idx).trim();
  let val = trimmed.slice(idx + 1).trim();
  // strip surrounding quotes if present
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  env[key] = val;
}

// Collect Gemini keys
const keys = [];
for (let i = 1; i <= 7; i++) {
  const k = env[`GEMINI_API_KEY${i}`];
  if (k && k.trim()) keys.push({ num: i, key: k.trim() });
}

console.log(`\n=== Found ${keys.length} Gemini key(s) in .env.local ===\n`);
for (const { num, key } of keys) {
  console.log(
    `GEMINI_API_KEY${num}: len=${key.length}  preview=${key.slice(0, 6)}…${key.slice(-4)}`
  );
}

if (keys.length === 0) {
  console.log("No Gemini keys configured. Exiting.");
  process.exit(0);
}

// Real API test using gemini-2.5-flash
async function testKey(label, key) {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
    key;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: "Reply with exactly: OK" }],
          },
        ],
        generationConfig: { maxOutputTokens: 10 },
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (res.ok) {
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      return { ok: true, status: res.status, text: text.trim().slice(0, 40) };
    }

    // Read error body
    let body = null;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    const errMsg =
      body?.error?.message ||
      (body?.error?.details
        ?.map((d) => d.message)
        .join("; ")) ||
      `HTTP ${res.status}`;
    return { ok: false, status: res.status, text: errMsg.slice(0, 120) };
  } catch (err) {
    return { ok: false, status: 0, text: String(err).slice(0, 120) };
  }
}

console.log(`\n=== Live API test (gemini-2.5-flash) ===\n`);
let working = 0;
for (const { num, key } of keys) {
  const r = await testKey(`GEMINI_API_KEY${num}`, key);
  const tag = r.ok ? "✅ WORKS" : "❌ FAIL";
  if (r.ok) working++;
  console.log(
    `${tag}  GEMINI_API_KEY${num}  [HTTP ${r.status}]  ${r.text}`
  );
}

console.log(
  `\n=== Result: ${working}/${keys.length} key(s) working ===\n`
);
