/* SceltoSmart: pagina per tutte le 71 varianti, fonti per modello e campi mancanti espliciti. */
(function(){
"use strict";
const families=Array.isArray(window.SCELTOSMART_FAMIGLIE)?window.SCELTOSMART_FAMIGLIE:[];
const finder=Array.isArray(window.SCELTOSMART_FINDER_MODELS)?window.SCELTOSMART_FINDER_MODELS:[];
const verified=window.SCELTOSMART_SPECIFICHE||{};
const links=window.SCELTOSMART_LINK_AMAZON||{};
const el=document.getElementById("detail-content"),title=document.getElementById("detail-name"),subtitle=document.getElementById("detail-subtitle");
if(!el||!title||!subtitle)return;
const params=new URLSearchParams(window.location.search);
const requested=params.get("modello")||"",groupId=params.get("famiglia")||"";
const findFamily=name=>families.find(f=>f.models.some(m=>m.toLocaleLowerCase("it")===name.toLocaleLowerCase("it")));
const family=findFamily(requested)||families.find(f=>f.id===groupId);
const fullName=family&&family.models.find(n=>n.toLocaleLowerCase("it")===requested.toLocaleLowerCase("it"));
const safeUrl=v=>{try{const u=new URL(v);return u.protocol==="https:"?u.href:null}catch(e){return null}};
const main=document.createElement("div");main.className="product-details-grid";
function node(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n}
function a(href,label,cls){const n=node("a",cls,label);n.href=href;return n}
function imagePanel(f){const visual=node("div","product-details-visual");const url=safeUrl(f?.img);if(!url){visual.textContent="📱 Immagine non disponibile";return visual;}const img=node("img");img.src=url;img.alt="Immagine rappresentativa della famiglia "+f.title+", la variante può essere differente";img.referrerPolicy="no-referrer";img.loading="lazy";img.onerror=()=>{visual.textContent="📱 Immagine non disponibile";};visual.append(img);return visual;}
function versions(f){const wrap=node("div","product-version-picker");f.models.forEach(n=>{const link=a("scheda-smartphone.html?modello="+encodeURIComponent(n),n+" ↗");if(n===fullName)link.setAttribute("aria-current","page");wrap.append(link);});return wrap;}
function message(text){el.replaceChildren(node("p","product-details-note",text),a("smartphone.html","Torna al catalogo ↗","btn"));}
if(!family){title.textContent="Modello non trovato";subtitle.textContent="Scegli uno smartphone dal catalogo.";message("Questa scheda non corrisponde a un modello disponibile.");return;}
if(!fullName){title.textContent=family.title;subtitle.textContent="Scegli una delle versioni per aprire la scheda del telefono esatto.";document.title=family.title+" | SceltoSmart";const panel=node("div","product-details-panel");panel.append(node("h2",null,"Seleziona il modello"),versions(family));main.append(imagePanel(family),panel);el.replaceChildren(main);return;}
const base=finder.find(m=>m.name===fullName)||{};
const model=Object.assign({},base,verified[fullName]||{});
title.textContent=fullName;subtitle.textContent=base.note||family.desc;
document.title=fullName+" — Scheda tecnica | SceltoSmart";
const panel=node("div","product-details-panel");
panel.append(node("h2",null,"Specifiche del modello"));
const list=node("dl","product-details-specs");
const valid=v=>v!==undefined&&v!==null&&v!=="";
const fmt=n=>Number(n).toLocaleString("it-IT");
const fields=[
["Marca",family.brand],["Sistema operativo",family.os],["Schermo",valid(model.screen)?String(model.screen).replace(".",",")+" pollici":null],
["Frequenza display",valid(model.hz)?model.hz+" Hz":null],
["Processore",model.chip],["Batteria tipica",valid(model.battery)?fmt(model.battery)+" mAh":null],
["Autonomia video dichiarata da Apple",valid(model.video)?model.video+" ore":null],
["Fotocamera principale",valid(model.mainMp)?model.mainMp+" MP":null],
["Ultragrandangolo",model.ultrawide===true?"Presente":model.ultrawide===false?"Non presente":null],
["Teleobiettivo ottico",model.tele>0?model.tele+"×":null],
["Memoria disponibile",model.storage],["Peso",valid(model.weight)?fmt(model.weight)+" g":null],
["Ricarica via cavo",valid(model.charge)?model.charge+" W":null],
["Ricarica wireless",model.wireless===true?"Supportata":model.wireless===false?"Non supportata":null],
["Supporto software dichiarato",valid(model.updates)?model.updates+" anni":null]
];
let filled=0;
fields.forEach(([k,v])=>{const box=node("div","product-details-spec");const dt=node("dt",null,k);const dd=node("dd",null,valid(v)?String(v):"Da verificare");if(valid(v))filled++;else dd.className="spec-unverified";box.append(dt,dd);list.append(box);});
panel.append(list);
const notice=node("p","product-details-note",filled+" dati e caratteristiche disponibili in questa scheda. I valori non documentati sono segnalati esplicitamente: non sono stati copiati da altre versioni né stimati.");
panel.append(notice);
const source=safeUrl(model.source)||safeUrl(family.source);
const buttons=node("div","product-details-actions");
if(source){const link=a(source,"Specifiche ufficiali ↗","btn btn-soft");link.target="_blank";link.rel="noopener noreferrer";buttons.append(link);}
const key=fullName==="Google Pixel 10a"?"pixel10a":fullName==="Samsung Galaxy A57 5G"?"galaxyA57":fullName.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/\+/g,"-plus").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const affiliate=safeUrl(links[key]);
if(affiliate){const url=new URL(affiliate);if(["link.amazon","amzn.to","amzn.eu"].includes(url.hostname)||(url.hostname.endsWith("amazon.it")&&url.searchParams.has("tag"))){const l=a(affiliate,"Vedi su Amazon ↗","btn btn-green");l.target="_blank";l.rel="sponsored noopener noreferrer";buttons.append(l);}}
panel.append(buttons);
panel.append(node("p","note-inline","Le foto sono rappresentative della famiglia, non necessariamente della variante selezionata. Prezzi, configurazioni e disponibilità vanno verificati presso il venditore. I link Amazon possono essere affiliati."));
panel.append(node("h3",null,"Altre versioni della famiglia"),versions(family));
main.append(imagePanel(family),panel);el.replaceChildren(main);
})();
