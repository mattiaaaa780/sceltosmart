/* Schede editoriali costruite esclusivamente sui dati già documentati nel Finder. */
(function(){
"use strict";
const models=Array.isArray(window.SCELTOSMART_FINDER_MODELS)?window.SCELTOSMART_FINDER_MODELS:[];
const families=Array.isArray(window.SCELTOSMART_FAMIGLIE)?window.SCELTOSMART_FAMIGLIE:[];
const el=document.getElementById("detail-content");
const name=document.getElementById("detail-name");
const subtitle=document.getElementById("detail-subtitle");
const requested=new URLSearchParams(location.search).get("modello")||"";
const familyRequested=new URLSearchParams(location.search).get("famiglia")||"";
const familyByModel=families.find(f=>f.models.some(n=>n.toLocaleLowerCase("it")===requested.toLocaleLowerCase("it")));
const familySelected=families.find(f=>f.id===familyRequested);
const family=familyByModel||familySelected;
const fullName=familyByModel?.models.find(n=>n.toLocaleLowerCase("it")===requested.toLocaleLowerCase("it"))||"";
const model=models.find(m=>m.name.toLocaleLowerCase("it")===fullName.toLocaleLowerCase("it"));
if(!fullName && familySelected){
  name.textContent=familySelected.title;
  subtitle.textContent="Scegli la versione precisa: le caratteristiche possono cambiare tra modello base, Plus, Pro e Ultra.";
  el.replaceChildren();
  const layout=document.createElement("div");layout.className="product-details-grid";
  const visual=document.createElement("div");visual.className="product-details-visual";
  const img=document.createElement("img");img.src=familySelected.img;img.alt="Foto rappresentativa della famiglia "+familySelected.title;img.referrerPolicy="no-referrer";img.onerror=()=>{visual.textContent="📱 Immagine non disponibile";};visual.append(img);
  const panel=document.createElement("div");panel.className="product-details-panel";
  const h=document.createElement("h2");h.textContent="Quale versione vuoi consultare?";panel.append(h);
  const list=document.createElement("div");list.className="product-version-picker";
  familySelected.models.forEach(n=>{const a=document.createElement("a");a.href="scheda-smartphone.html?modello="+encodeURIComponent(n);a.textContent=n+" ↗";list.append(a);});
  panel.append(list);layout.append(visual,panel);el.append(layout);return;
}
if(!fullName){
  name.textContent="Smartphone non trovato";
  subtitle.textContent="Seleziona un telefono dal catalogo.";
  el.replaceChildren();const a=document.createElement("a");a.href="smartphone.html";a.className="btn";a.textContent="Torna al catalogo ↗";el.append(a);return;
}
if(!model){
  name.textContent=fullName;
  document.title=fullName+" — Scheda prodotto | SceltoSmart";
  subtitle.textContent=family.desc;
  const section=document.createElement("div");section.className="product-details-grid";
  const visual=document.createElement("div");visual.className="product-details-visual";
  const img=document.createElement("img");img.src=family.img;img.referrerPolicy="no-referrer";img.alt="Immagine rappresentativa della famiglia "+family.title;
  img.onerror=()=>{visual.textContent="📱 Immagine non disponibile";};visual.append(img);
  const panel=document.createElement("div");panel.className="product-details-panel";
  const h=document.createElement("h2");h.textContent="Informazioni sul modello";panel.append(h);
  const dl=document.createElement("dl");dl.className="product-details-specs";
  [["Produttore",family.brand],["Sistema operativo",family.os],["Famiglia",family.title]].forEach(([k,v])=>{const box=document.createElement("div");box.className="product-details-spec";const dt=document.createElement("dt");dt.textContent=k;const dd=document.createElement("dd");dd.textContent=v;box.append(dt,dd);dl.append(box);});panel.append(dl);
  const notice=document.createElement("p");notice.className="product-details-note";notice.textContent="Specifiche dettagliate non ancora documentate per questa versione. Display, batteria, processore, fotocamere e aggiornamenti non vengono indicati finché non sono verificati con una scheda ufficiale del modello esatto.";panel.append(notice);
  const actions=document.createElement("div");actions.className="product-details-actions";
  const link=document.createElement("a");link.className="btn btn-soft";link.href=family.source;link.target="_blank";link.rel="noopener noreferrer";link.textContent="Consulta il produttore ↗";actions.append(link);
  panel.append(actions);
  const other=document.createElement("h3");other.textContent="Altre versioni della famiglia";panel.append(other);
  const picker=document.createElement("div");picker.className="product-version-picker";
  family.models.forEach(n=>{const a=document.createElement("a");a.href="scheda-smartphone.html?modello="+encodeURIComponent(n);a.textContent=n+" ↗";if(n===fullName)a.setAttribute("aria-current","page");picker.append(a);});panel.append(picker);
  section.append(visual,panel);el.replaceChildren(section);return;
}
document.title=model.name+" — Scheda tecnica | SceltoSmart";
name.textContent=model.name;
subtitle.textContent=model.note;
// family deriva dalla variante esatta; non si attribuiscono immagini a una variante specifica.
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
const relatedTitle=document.createElement("h3");relatedTitle.textContent="Altre versioni della famiglia";panel.append(relatedTitle);
const related=document.createElement("div");related.className="product-version-picker";
if(family)family.models.forEach(n=>{const a=document.createElement("a");a.href="scheda-smartphone.html?modello="+encodeURIComponent(n);a.textContent=n+" ↗";if(n===fullName)a.setAttribute("aria-current","page");related.append(a);});panel.append(related);
const disclosure=document.createElement("p");disclosure.className="note-inline";disclosure.textContent="I link Amazon, quando presenti, sono affiliati: SceltoSmart può ricevere una commissione sugli acquisti idonei. Non mostriamo prezzi o disponibilità in tempo reale.";panel.append(disclosure);
section.append(visual,panel);el.replaceChildren(section);
})();