// Final verification with retry/backoff — mimic route logic, resilient to timeouts
import fs from "fs";
import path from "path";

const envRaw = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
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

const MODELS = ["gemini-2.5-flash", "gemini-3.6-flash", "gemini-1.5-flash"];
const keys = [];
for (let i = 1; i <= 7; i++) {
  const k = env[`GEMINI_API_KEY${i}`]?.trim();
  if (k) keys.push({ num: i, key: k });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function callOnce(key, model) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: "Reply exactly: OK" }] }],
        generationConfig: { maxOutputTokens: 10 },
      }),
      signal: AbortSignal.timeout(20000),
    }
  );
  return res;
}

async function testKey(num, key) {
  for (const model of MODELS) {
    let lastStatus = 0;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await callOnce(key, model);
        lastStatus = res.status;
        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
          return { ok: true, model, text: text.trim().slice(0, 20) };
        }
        if (res.status === 429) return { ok: false, rateLimited: true, model };
        if (res.status === 404) break; // try next model
      } catch (e) {
        // timeout/network error → retry after backoff
        if (attempt < 2) await sleep(1500 * (attempt + 1));
      }
    }
    if (lastStatus === 404) continue;
  }
  return { ok: false };
}

console.log("=== Final Gemini key verification (with retry) ===\n");
let working = 0;
for (const { num, key } of keys) {
  const r = await testKey(num, key);
  if (r.ok) working++;
  const tag = r.ok ? "✅ WORKS" : r.rateLimited ? "⚠️ RATE-LIMITED" : "❌ FAIL";
  console.log(`${tag}  GEMINI_API_KEY${num}  ${r.ok ? `[via ${r.model}] ${JSON.stringify(r.text)}` : ""}`);
  await sleep(800); // small gap between keys to avoid hammering
}
console.log(`\n=== Result: ${working}/${keys.length} key(s) working ===\n`);
