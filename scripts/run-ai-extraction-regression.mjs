import fs from "fs/promises";
import path from "path";
import { orchestrateRequirementExtraction } from "../server/services/aiOrchestrationService.js";

function scoreCase(result, expected) {
  let total = 6;
  let hits = 0;
  if (result.requirements?.moq?.value === expected.moq) hits += 1;
  if (result.requirements?.timeline?.normalized_days === expected.timeline_days)
    hits += 1;
  if (result.requirements?.price?.min === expected.price_min) hits += 1;
  if (result.requirements?.price?.max === expected.price_max) hits += 1;
  if (
    (result.requirements?.fabric?.material || "").toLowerCase() ===
    String(expected.fabric_material || "").toLowerCase()
  )
    hits += 1;
  const certs = result.requirements?.compliance?.certifications || [];
  if ((expected.certifications || []).every((item) => certs.includes(item)))
    hits += 1;
  return { hits, total, accuracy: hits / total };
}

const evalPath = path.join(
  process.cwd(),
  "server",
  "evals",
  "requirements_extraction_eval_set.json",
);
const rows = JSON.parse(await fs.readFile(evalPath, "utf8"));

const byCategory = new Map();
for (const row of rows) {
  const result = await orchestrateRequirementExtraction({ text: row.text });
  const score = scoreCase(result, row.expected);
  if (!byCategory.has(row.category)) byCategory.set(row.category, []);
  byCategory.get(row.category).push(score.accuracy);
  console.log(`${row.id}: ${(score.accuracy * 100).toFixed(1)}%`);
}

console.log("\nCategory accuracy");
for (const [category, values] of byCategory.entries()) {
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  console.log(`- ${category}: ${(avg * 100).toFixed(1)}%`);
}
