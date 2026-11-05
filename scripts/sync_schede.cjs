#!/usr/bin/env node
"use strict";
/* Aggiorna soltanto i blocchi di specifiche delle 71 schede statiche.
   Legge l'archivio JS SceltoSmart. Nessuna richiesta di rete. 
   --check: verifica l'allineamento senza modificare file (per CI). */
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const data={window:{}};
for(const file of ["prodotti/dati-smartphone.js","assets/trova-smartphone-data.js","prodotti/specifiche-verificate.js"]){
 vm.runInNewContext(fs.readFileSync(path.join(root,file),"utf8"),data,{filename:file});
}
const families=data.window.SCELTOSMART_FAMIGLIE||[];
const finder=data.window.SCELTOSMART_FINDER_MODELS||[];
const verified=data.window.SCELTOSMART_SPECIFICHE||{};
const escape=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const valid=v=>v!==null&&v!==undefined&&v!=="";
const num=n=>Number(n).toLocaleString("it-IT");
const slug=x=>String(x).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/\+/g,"-plus").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const safeUrl=x=>typeof x==="string"&&/^https:\/\/[A-Za-z0-9.-]+[/:?]/.test(x)?x:null;
function sections(m,f,source){
 const items=[
  ["Schermo e design",[
   ["Diagonale",valid(m.screen)?String(m.screen).replace(".",",")+"″":null],["Tecnologia",m.displayTech],["Risoluzione",m.resolution],
   ["Frequenza display",valid(m.hz)?num(m.hz)+" Hz":null],["Peso",valid(m.weight)?num(m.weight)+" g":null],
   ["Resistenza acqua/polvere",m.ipRating],["Display esterno",m.coverDisplay],["Altre caratteristiche",m.features]
  ]],
  ["Prestazioni e memoria",[
   ["Sistema operativo",f.os],["Processore",m.chip],["RAM",m.ram],["Memoria",m.storage],
   ["Supporto software",m.updatesInfo||((valid(m.updates))?m.updates+" anni":null)]
  ]],
  ["Fotocamere e video",[
   ["Fotocamera principale",valid(m.mainMp)?m.mainMp+" MP":null],["Ultragrandangolo",m.ultrawide===true?"Presente":m.ultrawide===false?"Non presente":null],
   ["Zoom teleobiettivo",m.tele>0?m.tele+"× ottico":m.tele===0?"Non presente":null],
   ["Sensore teleobiettivo",valid(m.teleMp)?m.teleMp+" MP":null],["Fotocamera frontale",valid(m.frontMp)?m.frontMp+" MP":null],["Video",m.videoRecording]
  ]],
  ["Batteria e ricarica",[
   ["Batteria tipica",valid(m.battery)?num(m.battery)+" mAh":null],["Autonomia video dichiarata",m.videoNote||(valid(m.video)?"Fino a "+m.video+" ore":null)],
   ["Ricarica con cavo",valid(m.charge)?m.charge+" W":null],
   ["Ricarica wireless",m.wireless===true?"Supportata":m.wireless===false?"Non supportata":null],
   ["Potenza ricarica wireless",valid(m.wirelessChargeW)?m.wirelessChargeW+" W":null],["Note sulla ricarica",m.chargingInfo]
  ]],
  ["Connettività",[
   ["Wi-Fi",m.wifi],["Bluetooth",m.bluetooth],["NFC",m.nfc],["USB",m.usb],["SIM / eSIM",m.sim]
  ]]
 ];
 return items.map(([head,pairs])=>{
  const rows=pairs.filter(([,v])=>valid(v));if(!rows.length)return "";
  return '<section class="product-spec-section"><h2>'+escape(head)+'</h2><dl class="product-details-specs">'+rows.map(([label,value])=>
   '<div class="product-details-spec"><dt>'+escape(label)+'</dt><dd>'+escape(value)+'</dd>'+(source?'<a class="product-field-source" href="'+escape(source)+'" target="_blank" rel="noopener noreferrer" aria-label="Fonte ufficiale per '+escape(label)+'">Fonte ↗</a>':"")+'</div>'
  ).join("")+'</dl></section>';
 }).join("");
}
let changed=0,count=0,missing=[];
for(const family of families)for(const name of family.models){
 count++;
 const full=path.join(root,"prodotti","schede",slug(name)+".html");
 if(!fs.existsSync(full)){missing.push(name);continue;}
 let old=fs.readFileSync(full,"utf8");
 const model={...(finder.find(x=>x.name===name)||{}),...(verified[name]||{})};
 const source=safeUrl(model.source)||safeUrl(family.source);
 const start=old.indexOf('<section class="product-spec-section">');
 const stop=old.indexOf('<div class="product-details-actions">',start);
 if(start<0||stop<0){missing.push(name+" (sezioni non trovate)");continue;}
 let next=old.slice(0,start)+sections(model,family,source)+"\n"+old.slice(stop);
 const oldSource=next.match(/<a href="([^"]+)"[^>]*class="product-source-link"/)?.[1];
 if(oldSource&&source&&oldSource!==escape(source)){next=next.split(oldSource).join(escape(source));}
 if(next!==old){changed++;if(!process.argv.includes("--check"))fs.writeFileSync(full,next);}
}
if(missing.length){console.error("Schede mancanti:",missing);process.exitCode=1;}
if(process.argv.includes("--check")&&changed){console.error(changed+" schede statiche non sincronizzate. Esegui: node scripts/sync_schede.cjs");process.exitCode=1;}
console.log("Schede controllate:",count,"da aggiornare:",changed);
