// Validates the data files and writes the deployable site to build/.
// No dependencies: run with `node scripts/build.mjs` (add --check to validate only).
import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const checkOnly = process.argv.includes("--check");
const errors = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    fail(path.replace(root + "/", ""), `not valid JSON (${e.message})`);
    return null;
  }
}

function jsonFiles(dir) {
  const full = join(root, dir);
  if (!existsSync(full)) return [];
  return readdirSync(full).filter((f) => f.endsWith(".json")).sort().map((f) => join(dir, f));
}

const isStr = (v) => typeof v === "string" && v.trim() !== "";
const isNum = (v) => typeof v === "number" && Number.isFinite(v);

// Evals
const evalData = readJson(join(root, "data/evals.json")) || { domains: [], evals: [], rating: {} };
const evalIds = new Set();
for (const e of evalData.evals || []) {
  const f = "data/evals.json";
  if (!isStr(e.id)) { fail(f, "an eval has no id"); continue; }
  if (evalIds.has(e.id)) fail(f, `duplicate eval id "${e.id}"`);
  evalIds.add(e.id);
  for (const k of ["domain", "name", "short", "measures", "metric", "scoring"]) {
    if (!isStr(e[k])) fail(f, `eval "${e.id}" is missing "${k}"`);
  }
  if (typeof e.rated !== "boolean") fail(f, `eval "${e.id}" needs "rated": true or false`);
}
const ratedIds = (evalData.evals || []).filter((e) => e.rated).map((e) => e.id);

// Models
const models = [];
const modelIds = new Set();
for (const file of jsonFiles("data/models")) {
  const m = readJson(join(root, file));
  if (!m) continue;
  const expected = basename(file, ".json");
  if (m.id !== expected) fail(file, `"id" must match the file name ("${expected}")`);
  if (!/^[a-z0-9][a-z0-9.-]*$/.test(m.id || "")) fail(file, `"id" may only use lowercase letters, digits, dots and hyphens`);
  for (const k of ["name", "developer", "license", "ollama"]) {
    if (!isStr(m[k])) fail(file, `missing "${k}"`);
  }
  if (!isNum(m.params_b) || m.params_b <= 0) fail(file, `"params_b" must be a positive number (billions of parameters)`);
  if (!["open-source", "open-weights"].includes(m.license_type)) fail(file, `"license_type" must be "open-source" or "open-weights"`);
  if (typeof m.medical_tuned !== "boolean") fail(file, `"medical_tuned" must be true or false`);
  if (m.hf != null && !isStr(m.hf)) fail(file, `"hf" must be a Hugging Face repo id or null`);
  modelIds.add(m.id);
  models.push(m);
}

// Results
const results = {};
for (const file of jsonFiles("data/results")) {
  const r = readJson(join(root, file));
  if (!r) continue;
  const expected = basename(file, ".json");
  if (r.model !== expected) fail(file, `"model" must match the file name ("${expected}")`);
  if (!modelIds.has(r.model)) fail(file, `no model file data/models/${r.model}.json`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(r.run_date || "")) fail(file, `"run_date" must be YYYY-MM-DD`);
  if (!Number.isInteger(r.samples_per_eval) || r.samples_per_eval < 1) fail(file, `"samples_per_eval" must be a positive whole number`);
  if (!isStr(r.hardware)) fail(file, `missing "hardware" (say what the run was made on)`);
  if (!isStr(r.submitted_by)) fail(file, `missing "submitted_by" (your GitHub handle)`);
  if (!r.scores || typeof r.scores !== "object") { fail(file, `missing "scores"`); continue; }
  for (const [id, s] of Object.entries(r.scores)) {
    if (!ratedIds.includes(id)) fail(file, `"${id}" is not a scored eval in data/evals.json`);
    if (!s || !isNum(s.score) || s.score < 0 || s.score > 100) fail(file, `score for "${id}" must be a number from 0 to 100`);
    if (!s || !Number.isInteger(s.n) || s.n < 1) fail(file, `"n" for "${id}" must be a positive whole number`);
  }
  if (r.speed != null && !(isNum(r.speed.tokens_per_second) && r.speed.tokens_per_second > 0)) {
    fail(file, `"speed.tokens_per_second" must be a positive number`);
  }
  results[r.model] = r;
}

if (errors.length) {
  console.error(`Found ${errors.length} problem(s):\n` + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}

console.log(`Data OK: ${models.length} models, ${Object.keys(results).length} with results, ${evalIds.size} evals.`);
if (checkOnly) process.exit(0);

const out = join(root, "build");
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(root, "site"), out, { recursive: true });
writeFileSync(
  join(out, "data.json"),
  JSON.stringify({ ...evalData, models, results, built_at: new Date().toISOString().slice(0, 10) })
);
console.log("Wrote build/");
