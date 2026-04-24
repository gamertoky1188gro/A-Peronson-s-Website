import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "server");
const OUT_FILE = path.join(process.cwd(), "server", "search_index.json");

function tokenize(text = "") {
  return String(text || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

async function buildIndex() {
  const productsPath = path.join(DATA_DIR, "company_products.json");
  let products = [];
  try {
    products = JSON.parse(await fs.readFile(productsPath, "utf8"));
  } catch {
    products = [];
  }

  const index = {};
  for (const p of products) {
    const id = String(p.id || "");
    const text = `${p.title || ""} ${p.category || ""} ${p.material || ""}`;
    const tokens = tokenize(text);
    for (const t of tokens) {
      index[t] = index[t] || new Set();
      index[t].add(id);
    }
  }

  const serial = Object.fromEntries(
    Object.entries(index).map(([k, v]) => [k, [...v]]),
  );
  await fs.writeFile(OUT_FILE, JSON.stringify(serial, null, 2), "utf8");
  console.log("Index written to", OUT_FILE);
}

if (process.argv[1].endsWith("indexer.mjs")) {
  buildIndex().catch((e) => {
    console.error(e);
    process.exit(2);
  });
}

export { buildIndex };
