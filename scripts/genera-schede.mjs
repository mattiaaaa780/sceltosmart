import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

/* Rigenerazione deterministica delle 71 schede.
 * Uso: node scripts/genera-schede.mjs
 * Controllo senza scrivere: node scripts/genera-schede.mjs --check
 * Fonte unica: dati-smartphone.js, specifiche-verificate.js, link-affiliati.js,
 * immagini-smartphone.js e scripts/schede-template.js.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const paths = [
  "prodotti/dati-smartphone.js",
  "prodotti/specifiche-verificate.js",
  "prodotti/link-affiliati.js",
  "prodotti/immagini-smartphone.js",
  "scripts/schede-template.js"
];
const sandbox = { window: {} };
for (const name of paths) {
  const script = await readFile(join(root, name), "utf8");
  runInNewContext(script, sandbox, { filename: name, timeout: 3000 });
}
const data = sandbox.window;
const pages = data.SCELTOSMART_STATIC_RENDER.all(
  data.SCELTOSMART_FAMIGLIE,
  data.SCELTOSMART_SPECIFICHE,
  data.SCELTOSMART_LINK_AMAZON,
  data.SCELTOSMART_IMMAGINI
);
const check = process.argv.includes("--check");
let modified = 0;
for (const page of pages) {
  const dst = join(root, page.path);
  let current = "";
  try { current = await readFile(dst, "utf8"); } catch {}
  if (current === page.content) continue;
  modified++;
  if (!check) {
    await mkdir(dirname(dst), { recursive: true });
    await writeFile(dst, page.content, "utf8");
  }
}
console.log(`${pages.length} schede, ${modified} ${check ? "da aggiornare" : "aggiornate"}`);
if (check && modified) process.exitCode = 1;
