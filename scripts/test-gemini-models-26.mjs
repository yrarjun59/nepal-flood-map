// Probe candidate models for keys 2-7 (which rejected gemini-2.5-flash)
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

// Only test keys 2-7 (key1 already known-working on 2.5-flash)
const keys = [];
for (let i = 2; i <= 7; i++) {
  const k = env[`GEMINI_API_KEY${i}`]?.trim();
  if (k) keys.push({ num: i, key: k });
}

const candidates = [
  "gemini-3.6-flash",
  "gemini-3.6-flash-latest",
  "gemini-3.6-flash-001",
  "gemini-3.0-flash",
  "gemini-3-flash",
  "gemini-flash-latest",
];

for (const { num, key } of keys) {
  console.log(`\n── GEMINI_API_KEY${num} (${key.slice(0, 6)}…${key.slice(-4)}) ──`);
  for (const model of candidates) {
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=` + key;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "Reply exactly: OK" }] }],
          generationConfig: { maxOutputTokens: 10 },
        }),
        signal: AbortSignal.timeout(15000),
      });
      let body = null;
      try { body = await res.json(); } catch {}
      const text = body?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      const err = body?.error?.message ?? "";
      const tag = res.ok ? "✅" : "❌";
      console.log(`  ${tag} ${model.padEnd(26)} HTTP ${res.status}  ${res.ok ? JSON.stringify(text.slice(0,20)) : err.slice(0, 70)}`);
    } catch (e) {
      console.log(`  ❌ ${model.padEnd(26)} ERR ${String(e).slice(0, 70)}`);
    }
  }
}
