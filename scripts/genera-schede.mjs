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

/* Allinea le foto delle 36 schede protezioni con lo stesso archivio immagini. */
const protectionPath=join(root,"prodotti/protezioni.html");
const protectionCurrent=await readFile(protectionPath,"utf8");
let protectionModels=0;
const protectedHtml=protectionCurrent.replace(/<article class="protection-device"[^>]*\bdata-model="([^"]+)"[^>]*>[\s\S]*?<\/article>/g,(article,model)=>{
  const img=data.SCELTOSMART_IMMAGINI[model];
  if(!img||!["ufficiale-modello","modello-identificabile"].includes(img.status)||!img.src)
    throw new Error("Foto non verificata per protezione: "+model);
  const attr=value=>String(value).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");
  let changed=article.replace(/(<div class="protection-device-head"><img src=")[^"]*"/,(_,prefix)=>prefix+attr(img.src)+'"');
  changed=changed.replace(/(<div class="protection-device-head"><img[^>]* alt=")[^"]*"/,(_,prefix)=>prefix+attr("Foto del modello "+model)+'"');
  changed=changed.replace("Foto rappresentativa della famiglia ·","Foto del modello ·");
  protectionModels++;
  return changed;
});
if(protectionModels!==36)throw new Error("Trovate "+protectionModels+" protezioni invece di 36");
if(protectionCurrent!==protectedHtml){
  modified++;
  if(!check)await writeFile(protectionPath,protectedHtml,"utf8");
}

console.log(`${pages.length} schede, ${modified} ${check ? "da aggiornare" : "aggiornate"}`);
if (check && modified) process.exitCode = 1;
