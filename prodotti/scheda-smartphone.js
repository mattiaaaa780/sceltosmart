/* SceltoSmart — schede tecniche con riferimenti ufficiali, versione 2026-11-05. */
(function(){
"use strict";
const families=Array.isArray(window.SCELTOSMART_FAMIGLIE)?window.SCELTOSMART_FAMIGLIE:[];
const finder=Array.isArray(window.SCELTOSMART_FINDER_MODELS)?window.SCELTOSMART_FINDER_MODELS:[];
const verified=window.SCELTOSMART_SPECIFICHE||{};
const links=window.SCELTOSMART_LINK_AMAZON||{};
const content=document.getElementById("detail-content");
const title=document.getElementById("detail-name");
const subtitle=document.getElementById("detail-subtitle");
if(!content||!title||!subtitle)return;
/* Torna alla pagina visitata sul sito (catalogo, Finder o scelta della variante).
   Quando si arriva da fuori o si apre la scheda direttamente, usa il catalogo. */
const previous=document.referrer;
let internalPrevious=false;
try{const url=new URL(previous);internalPrevious=url.origin===location.origin&&history.length>1;}catch(_){}
document.querySelectorAll("[data-smartphone-back]").forEach(control=>{
 control.addEventListener("click",event=>{
  if(!internalPrevious)return; // il normale href è il fallback affidabile
  event.preventDefault();
  history.back();
 });
});

/* Controllo "Torna su": visibile solo quando serve, con fallback all'ancora. */
const scrollTopControl=document.querySelector("[data-product-scroll-top]");
if(scrollTopControl){
 const updateScrollControl=()=>{scrollTopControl.hidden=window.scrollY<420;};
 scrollTopControl.addEventListener("click",event=>{
   event.preventDefault();
   const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
   window.scrollTo({top:0,behavior:reduceMotion?"instant":"smooth"});
 });
 window.addEventListener("scroll",updateScrollControl,{passive:true});
 updateScrollControl();
}
const params=new URLSearchParams(window.location.search);
const wanted=(params.get("modello")||"").toLocaleLowerCase("it");
const requestedFamily=params.get("famiglia")||"";
const family=families.find(f=>f.models.some(n=>n.toLocaleLowerCase("it")===wanted))||families.find(f=>f.id===requestedFamily);
const fullName=family?.models.find(n=>n.toLocaleLowerCase("it")===wanted);
const create=(tag,cls,value)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(value!==undefined)n.textContent=String(value);return n};
const safeUrl=x=>{try{const u=new URL(x);return u.protocol==="https:"?u.href:null}catch{return null}};
const link=(url,text,cls,target)=>{const n=create("a",cls,text);n.href=url;if(target){n.target="_blank";n.rel="noopener noreferrer"}return n};
const has=v=>v!==null&&v!==undefined&&v!=="";
const num=n=>Number(n).toLocaleString("it-IT");
const unit=(n,s)=>has(n)?num(n)+" "+s:null;
const inch=n=>has(n)?String(n).replace(".",",")+"″":null;
const page="schede/";
const slug=x=>String(x).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/\+/g,"-plus").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
function photo(f){
 const wrap=create("div","product-details-visual");const src=safeUrl(f?.img);
 if(!src){wrap.append(create("span","photo-fallback","📱 Immagine non disponibile"));return wrap;}
 const img=create("img");img.src=src;img.alt="Foto rappresentativa della famiglia "+f.title+"; le versioni possono differire";
 img.loading="lazy";img.decoding="async";img.referrerPolicy="no-referrer";
 img.addEventListener("error",()=>{wrap.replaceChildren(create("span","photo-fallback","📱 Immagine non disponibile"));},{once:true});
 wrap.append(img);return wrap;
}
function picker(f,active){
 const wrap=create("nav","product-version-picker");wrap.setAttribute("aria-label","Altre versioni di "+f.title);
 f.models.forEach(n=>{const a=link(page+slug(n)+".html",n+" ↗");if(n===active)a.setAttribute("aria-current","page");wrap.append(a)});
 return wrap;
}
function noModel(message){const box=create("div","product-details-panel");box.append(create("p","product-details-note",message),link("smartphone.html","Torna al catalogo ↗","btn"));content.replaceChildren(box);}
if(!family){title.textContent="Modello non trovato";subtitle.textContent="Scegli uno smartphone dal catalogo.";noModel("Questa scheda non esiste nel catalogo corrente.");return;}
if(!fullName){
 title.textContent=family.title;document.title=family.title+" — Modelli | SceltoSmart";
 subtitle.textContent="Scegli la versione esatta: fotocamere, dimensioni e batteria possono cambiare.";
 const panel=create("section","product-details-panel");panel.append(create("h2",null,"Quale versione vuoi consultare?"),picker(family));
 const layout=create("div","product-details-grid");layout.append(photo(family),panel);content.replaceChildren(layout);return;
}
const base=finder.find(m=>m.name===fullName)||{};
const model={...base,...(verified[fullName]||{})};
title.textContent=fullName;document.title=fullName+" — Specifiche e fonti | SceltoSmart";
subtitle.textContent=base.note||family.desc;
const source=safeUrl(model.source)||safeUrl(family.source);
const panel=create("div","product-details-panel");
const banner=create("div","product-source-banner");
banner.append(create("strong",null,"Scheda basata sulle informazioni del produttore"));
banner.append(create("p",null,"Caratteristiche per la versione selezionata; alcuni valori dipendono dal mercato e dalla configurazione."));
if(source){const a=link(source,"Consulta la fonte ufficiale ↗","product-source-link",true);banner.append(a);}
if(model.checkedAt)banner.append(create("small",null,"Archivio controllato: "+model.checkedAt.split("-").reverse().join("/")));
panel.append(banner);
let provided=0;
function section(heading,items){
 const values=items.filter(([,value])=>has(value));
 if(!values.length)return;
 const block=create("section","product-spec-section"),h=create("h2",null,heading),grid=create("dl","product-details-specs");
 block.append(h);
 values.forEach(([label,value])=>{
  const item=create("div","product-details-spec"),dt=create("dt",null,label),dd=create("dd",null,value);
  provided++;
  item.append(dt,dd);
  if(source){const a=link(source,"Fonte ↗","product-field-source",true);a.setAttribute("aria-label","Apri la fonte ufficiale per "+label);item.append(a);}
  grid.append(item);
 });
 block.append(grid);panel.append(block);
}
section("Display e design",[
 ["Schermo",inch(model.screen)],["Tecnologia del display",model.displayTech],
 ["Risoluzione",model.resolution],["Frequenza massima",unit(model.hz,"Hz")],
 ["Peso dichiarato",unit(model.weight,"g")],["Resistenza a polvere e acqua",model.ipRating],["Display esterno",model.coverDisplay],
 ["Caratteristiche speciali",model.features]
]);
section("Processore e memoria",[
 ["Sistema operativo",family.os],["Chip / processore",model.chip],
 ["RAM",model.ram],["Memoria interna",model.storage],["Supporto software",model.updatesInfo||unit(model.updates,"anni")]
]);
section("Fotocamere",[
 ["Fotocamera principale",unit(model.mainMp,"MP")],
 ["Ultragrandangolo",model.ultrawide===true?"Presente":model.ultrawide===false?"Non presente":null],
 ["Teleobiettivo",model.tele>0?num(model.tele)+"× ottico":model.tele===0?"Non presente":null],
 ["Sensore teleobiettivo",unit(model.teleMp,"MP")],
 ["Fotocamera frontale",unit(model.frontMp,"MP")],["Video",model.videoRecording]
]);
section("Batteria e ricarica",[
 ["Capacità tipica dichiarata",unit(model.battery,"mAh")],
 ["Autonomia video dichiarata",model.videoNote||(model.video?("Fino a "+num(model.video)+" ore"):null)],
 ["Ricarica cablata",unit(model.charge,"W")],
 ["Ricarica wireless",model.wireless===true?"Supportata":model.wireless===false?"Non supportata":null],
 ["Potenza ricarica wireless",unit(model.wirelessChargeW,"W")],
 ["Altre indicazioni sulla ricarica",model.chargingInfo]
]);
section("Connettività",[
 ["Wi‑Fi",model.wifi],["Bluetooth",model.bluetooth],["NFC",model.nfc],["Porta USB",model.usb],["SIM / eSIM",model.sim]
]);
panel.append(create("p","product-details-note","Questa scheda raccoglie "+provided+" caratteristiche documentate. Le voci prive di dati attendibili non vengono mostrate: per l'elenco integrale, le note per mercato e le configurazioni, consulta il sito ufficiale."));
const actions=create("div","product-details-actions");
if(source)actions.append(link(source,"Scheda tecnica del produttore ↗","btn btn-soft",true));
const key=fullName==="Google Pixel 10a"?"pixel10a":fullName==="Samsung Galaxy A57 5G"?"galaxyA57":fullName.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/\+/g,"-plus").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const amazon=safeUrl(links[key]);
if(amazon){const u=new URL(amazon);if(["link.amazon","amzn.to","amzn.eu"].includes(u.hostname)||(["amazon.it","www.amazon.it"].includes(u.hostname)&&u.searchParams.has("tag"))){const a=link(amazon,"Vedi su Amazon ↗","btn btn-green",true);a.rel="sponsored noopener noreferrer";actions.append(a);}}
panel.append(actions,create("h2","product-other-heading","Altre versioni della stessa famiglia"),picker(family,fullName));
const warning=create("p","note-inline","I link Amazon possono essere affiliati. Nessun prezzo in tempo reale. L'immagine rappresenta la famiglia e potrebbe non mostrare esattamente questa versione; attribuire un'immagine alla fonte non sostituisce il permesso di riutilizzarla.");
const layout=create("div","product-details-grid");layout.append(photo(family),panel);
content.replaceChildren(layout,warning);
})();
