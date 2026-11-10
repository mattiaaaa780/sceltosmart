#!/usr/bin/env node
"use strict";
/* Aggiorna soltanto i blocchi di specifiche delle 53 schede statiche.
   Legge l'archivio JS SceltoSmart. Nessuna richiesta di rete. 
   --check: verifica l'allineamento senza modificare file (per CI). */
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const data={window:{}};
for(const file of ["prodotti/dati-smartphone.js","prodotti/specifiche-verificate.js","scripts/schede-template.js"]){
 vm.runInNewContext(fs.readFileSync(path.join(root,file),"utf8"),data,{filename:file});
}
const families=data.window.SCELTOSMART_FAMIGLIE||[];
const verified=data.window.SCELTOSMART_SPECIFICHE||{};
const {slug,specSections}=data.window.SCELTOSMART_STATIC_RENDER;
const escape=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safeUrl=x=>typeof x==="string"&&/^https:\/\//.test(x)?x:"";
let changed=0,count=0,missing=[];
for(const family of families)for(const name of family.models){
 count++;
 const full=path.join(root,"prodotti","schede",slug(name)+".html");
 if(!fs.existsSync(full)){missing.push(name);continue;}
 const old=fs.readFileSync(full,"utf8");
 const model=verified[name]||{};
 const source=safeUrl(model.source)||safeUrl(family.source);
 const start=old.indexOf('<section class="product-spec-section">');
 const note=old.indexOf('<p class="product-details-note">',start);
 const stop=note>=0?note:old.indexOf('<div class="product-details-actions">',start);
 if(start<0||stop<0){missing.push(name+" (sezioni non trovate)");continue;}
 let next=old.slice(0,start)+specSections(family,model,source)+"\n"+old.slice(stop);
 const oldSource=old.match(/<a\b(?=[^>]*\bclass="product-source-link")[^>]*\bhref="([^"]+)"/)?.[1];
 if(oldSource&&source&&oldSource!==escape(source)){next=next.split(oldSource).join(escape(source));}
 if(next!==old){changed++;if(!process.argv.includes("--check"))fs.writeFileSync(full,next);}
}
if(missing.length){console.error("Schede mancanti:",missing);process.exitCode=1;}
if(process.argv.includes("--check")&&changed){console.error(changed+" schede statiche non sincronizzate. Esegui: node scripts/sync_schede.cjs");process.exitCode=1;}
console.log("Schede controllate:",count,"da aggiornare:",changed);
