/* Schede editoriali costruite esclusivamente sui dati già documentati nel Finder. */
(function(){
"use strict";
const models=Array.isArray(window.SCELTOSMART_FINDER_MODELS)?window.SCELTOSMART_FINDER_MODELS:[];
const families=Array.isArray(window.SCELTOSMART_FAMIGLIE)?window.SCELTOSMART_FAMIGLIE:[];
const el=document.getElementById("detail-content");
const name=document.getElementById("detail-name");
const subtitle=document.getElementById("detail-subtitle");
const requested=new URLSearchParams(location.search).get("modello")||"";
const model=models.find(m=>m.name.toLocaleLowerCase("it")===requested.toLocaleLowerCase("it"));
if(!model){name.textContent="Scheda non disponibile";subtitle.textContent="Non abbiamo ancora una scheda tecnica documentata per questo modello.";el.textContent="";const a=document.createElement("a");a.href="smartphone.html";a.textContent="Torna a tutti gli smartphone ↗";a.className="btn";el.append(a);return;}
document.title=model.name+" — Scheda tecnica | SceltoSmart";
name.textContent=model.name;
subtitle.textContent=model.note;
const family=families.find(f=>f.id===model.family);
const validHttps=raw=>{try{const u=new URL(raw);return u.protocol==="https:"?u.href:null}catch(e){return null}};
const specEntries=[
["Sistema operativo",model.os],["Schermo",model.screen?String(model.screen).replace(".",",")+" pollici":null],
["Frequenza schermo",model.hz?model.hz+" Hz":null],
["Processore",model.chip],["Fotocamera principale",model.mainMp?model.mainMp+" MP":null],
["Teleobiettivo",model.tele?model.tele+"× ottico":"Non dichiarato in questa scheda"],
["Ultragrandangolo",model.ultrawide?"Presente":"Non indicato"],
["Batteria tipica",model.battery?model.battery.toLocaleString("it-IT")+" mAh":null],
["Video dichiarato da Apple",model.video? "Fino a "+model.video+" ore":null],
["Peso",model.weight?model.weight+" g":null],
["Ricarica via cavo",model.charge?model.charge+" W":null],
["Ricarica wireless",model.wireless?"Presente":"Non indicata"],
["Supporto software dichiarato",model.updates?model.updates+" anni":null]
].filter(([,value])=>value!==null&&value!==undefined);
const section=document.createElement("div");section.className="product-details-grid";
const visual=document.createElement("div");visual.className="product-details-visual";
if(family&&validHttps(family.img)){const img=document.createElement("img");img.src=validHttps(family.img);img.alt="Immagine rappresentativa della famiglia "+family.title;img.loading="lazy";img.referrerPolicy="no-referrer";img.onerror=()=>{img.remove();visual.textContent="📱 Immagine non disponibile";};visual.append(img);}else visual.textContent="📱 Immagine non disponibile";
const panel=document.createElement("div");panel.className="product-details-panel";
const heading=document.createElement("h2");heading.textContent="Caratteristiche dichiarate";panel.append(heading);
const dl=document.createElement("dl");dl.className="product-details-specs";
specEntries.forEach(([label,value])=>{const box=document.createElement("div");box.className="product-details-spec";const dt=document.createElement("dt");dt.textContent=label;const dd=document.createElement("dd");dd.textContent=value;box.append(dt,dd);dl.append(box);});panel.append(dl);
const note=document.createElement("p");note.className="product-details-note";note.textContent=model.note;panel.append(note);
const checks=document.createElement("h3");checks.textContent="Cosa controllare prima di scegliere";panel.append(checks);
const ul=document.createElement("ul");ul.className="product-details-checklist";
["Confronta capacità di memoria e configurazione della versione acquistata.","Controlla garanzia, venditore e prezzo finale sulla pagina del negozio.","Le specifiche non sostituiscono prove dirette e non descrivono l’autonomia reale."].forEach(t=>{const li=document.createElement("li");li.textContent=t;ul.append(li);});panel.append(ul);
const actions=document.createElement("div");actions.className="product-details-actions";
function link(href,label,cls,rel){const a=document.createElement("a");a.href=href;a.textContent=label;a.className=cls;a.target="_blank";a.rel=rel;actions.append(a);}
const source=validHttps(model.source);if(source)link(source,"Fonte ufficiale ↗","btn btn-soft","noopener noreferrer");
const key=model.name.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/\+/g,"-plus").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const affiliate=window.SCELTOSMART_LINK_AMAZON&&window.SCELTOSMART_LINK_AMAZON[key];
const safeAffiliate=validHttps(affiliate);
if(safeAffiliate&&["link.amazon","amzn.to","amzn.eu","amazon.it","www.amazon.it"].includes(new URL(safeAffiliate).hostname)){link(safeAffiliate,"Vedi su Amazon ↗","btn btn-green","sponsored noopener noreferrer");}
panel.append(actions);
const disclosure=document.createElement("p");disclosure.className="note-inline";disclosure.textContent="I link Amazon, quando presenti, sono affiliati: SceltoSmart può ricevere una commissione sugli acquisti idonei. Non mostriamo prezzi o disponibilità in tempo reale.";panel.append(disclosure);
section.append(visual,panel);el.replaceChildren(section);
})();