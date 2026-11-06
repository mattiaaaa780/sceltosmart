/* SceltoSmart: template unificato delle 71 schede statiche. */
window.SCELTOSMART_STATIC_RENDER = (function factory(){
"use strict";
const origin="https://mattiaaaa780.github.io/sceltosmart/";
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const slug=s=>String(s).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/\+/g,"-plus").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const valid=https=>typeof https==="string"&&/^https:\/\//.test(https)?https:"";
const has=x=>x!==undefined&&x!==null&&x!=="";
const m=(x,u)=>has(x)?String(x).replace(".",",")+u:"";
const key=n=>n==="Google Pixel 10a"?"pixel10a":n==="Samsung Galaxy A57 5G"?"galaxyA57":slug(n);
function section(title,rows,src){
  rows=rows.filter(([,v])=>has(v));if(!rows.length)return "";
  const fields=rows.map(([k,v])=>`<div class="product-details-spec"><dt>${esc(k)}</dt><dd>${esc(v)}</dd>${src?`<a class="product-field-source" href="${esc(src)}" target="_blank" rel="noopener noreferrer" aria-label="Fonte ufficiale per ${esc(k)}">Fonte ↗</a>`:""}</div>`).join("");
  return `<section class="product-spec-section"><h2>${esc(title)}</h2><dl class="product-details-specs">${fields}</dl></section>`;
}
function render(n,f,s,amazon,image){
const src=valid(s.source)||valid(f.source);
const canonical=origin+"prodotti/schede/"+slug(n)+".html";
const verifiedPhoto=!!(image&&valid(image.src)&&["ufficiale-modello","modello-identificabile"].includes(image.status));
const imageMarkup=verifiedPhoto?`<img src="${esc(image.src)}" alt="Fotografia del modello ${esc(n)}" width="480" height="480" loading="lazy" decoding="async" referrerpolicy="no-referrer">`:`<span class="photo-fallback" role="img" aria-label="Foto specifica non verificata">📱 Foto del modello in verifica</span>`;
const photoCaption=verifiedPhoto?`Foto: ${esc(image.credit||"Fonte esterna")}. ${valid(image.source)?`<a href="${esc(image.source)}" target="_blank" rel="noopener noreferrer">Origine immagine ↗</a>`:""} · L'attribuzione non sostituisce l'autorizzazione al riutilizzo.`:`Nessuna foto di altre versioni viene mostrata al posto di ${esc(n)}. <a href="${esc(src)}" target="_blank" rel="noopener noreferrer">Consulta il produttore ↗</a>`;
const specInfo=[has(s.screen)?m(s.screen,"″"):"",s.chip||"",has(s.battery)?m(s.battery," mAh"):""].filter(Boolean);
const desc=`Scheda tecnica ${n}${specInfo.length?": "+specInfo.join(", "):""}. Dati ufficiali disponibili e immagine specifica se verificata.`;
const sections=[
 section("Schermo e design",[["Diagonale",m(s.screen,"″")],["Tecnologia",s.displayTech],["Risoluzione",s.resolution],["Frequenza display",m(s.hz," Hz")],["Peso",m(s.weight," g")],["Resistenza acqua/polvere",s.ipRating],["Schermo esterno",s.coverDisplay],["Caratteristiche speciali",s.features]],src),
 section("Prestazioni e memoria",[["Sistema operativo",f.os],["Processore",s.chip],["RAM",s.ram],["Memoria",s.storage],["Supporto software",s.updatesInfo||(has(s.updates)?m(s.updates," anni"):"")]],src),
 section("Fotocamere e video",[["Fotocamera principale",m(s.mainMp," MP")],["Ultragrandangolo",s.ultrawide===true?"Presente":s.ultrawide===false?"Non presente":""],["Teleobiettivo",s.tele>0?m(s.tele,"× ottico"):s.tele===0?"Non presente":""],["Sensore teleobiettivo",m(s.teleMp," MP")],["Fotocamera frontale",m(s.frontMp," MP")],["Video",s.videoRecording]],src),
 section("Batteria e ricarica",[["Batteria tipica",m(s.battery," mAh")],["Autonomia video",s.videoNote||(s.video?m(s.video," ore dichiarate"):"")],["Ricarica cablata",m(s.charge," W")],["Wireless",s.wireless===true?"Supportata":s.wireless===false?"Non supportata":""],["Potenza wireless",m(s.wirelessChargeW," W")],["Indicazioni ricarica",s.chargingInfo]],src),
 section("Connettività",[["Wi-Fi",s.wifi],["Bluetooth",s.bluetooth],["NFC",s.nfc],["USB",s.usb],["SIM / eSIM",s.sim]],src)
].join("");
const other=f.models.map(model=>`<a href="${slug(model)}.html"${model===n?' aria-current="page"':""}>${esc(model)} ↗</a>`).join("");
const okAmazon=typeof amazon==="string"&&/^https:\/\/(?:link\.amazon|amzn\.to|amzn\.eu)\/[A-Za-z0-9]+/.test(amazon);
const buy=okAmazon?`<a class="btn btn-green" href="${esc(amazon)}" target="_blank" rel="sponsored noopener noreferrer">Vedi su Amazon · link affiliato ↗</a>`:"";
const breadcrumb=JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":origin},{"@type":"ListItem","position":2,"name":"Smartphone","item":origin+"prodotti/smartphone.html"},{"@type":"ListItem","position":3,"name":n,"item":canonical}]}).replace(/</g,"\\u003c");
return `<!doctype html>
<html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#10152b">
<title>${esc(n)}: scheda tecnica e specifiche | SceltoSmart</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="article"><meta property="og:locale" content="it_IT"><meta property="og:site_name" content="SceltoSmart">
<meta property="og:title" content="${esc(n)} | SceltoSmart"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${esc(canonical)}">
<link rel="icon" href="../../assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../../assets/style.css?v=qa-20261106"><link rel="stylesheet" href="../../assets/catalogo-extra.css?v=model-photos-20261106">
<script src="../../assets/site.js?v=model-photos-20261106" defer></script><script src="../../assets/schede-navigation.js?v=qa-20261106" defer></script>
<script type="application/ld+json">${breadcrumb}</script></head>
<body>
<a class="skip-link" href="#contenuto">Vai al contenuto</a>
<div class="topbar">Guide gratuite · Link affiliati dichiarati · <a href="../../trasparenza.html">Trasparenza affiliazioni</a></div>
<header class="site-header"><div class="wrap nav-wrap"><a class="brand" href="../../index.html" aria-label="SceltoSmart, torna alla home"><span class="brand-mark" aria-hidden="true">ϟ</span><span>Scelto<b>Smart</b></span></a><button class="nav-toggle" type="button" data-nav-toggle aria-controls="site-nav" aria-expanded="false">☰ Menu</button>
<nav class="nav-links" id="site-nav" aria-label="Navigazione principale"><a href="../../index.html">Home</a><a href="../smartphone.html" aria-current="page">Smartphone</a><a href="../accessori.html">Accessori</a><a href="../../guide/index.html">Guide</a><a href="../../chi-siamo.html">Chi siamo</a><a href="../../contatti.html" class="nav-cta">Contatti</a></nav></div></header>
<main id="contenuto" class="wrap">
<div class="crumb"><a href="../../index.html">Home</a> / <a href="../smartphone.html">Smartphone</a> / ${esc(n)}</div>
<a href="../smartphone.html" class="product-back-link" data-smartphone-back>← Torna indietro</a>
<section class="product-details-hero"><span class="kicker">SceltoSmart · Scheda tecnica con fonti</span><h1>${esc(n)}</h1><p>${esc(f.desc)}</p></section>
<section class="product-details-grid">
<figure class="product-details-visual static-product-photo">${imageMarkup}<figcaption>${photoCaption}</figcaption></figure>
<div class="product-details-panel">
<div class="product-source-banner"><strong>Dati tecnici con fonte del produttore</strong><p>Controlla sempre la configurazione e la disponibilità nel tuo mercato.</p><a class="product-source-link" href="${esc(src)}" target="_blank" rel="noopener noreferrer">Consulta la fonte ufficiale ↗</a>${s.checkedAt?`<small>Archivio controllato: ${esc(s.checkedAt.split("-").reverse().join("/"))}</small>`:""}</div>
${sections}
<p class="product-details-note">Le voci prive di informazioni documentate sono omesse. Dati e foto del modello sono gestiti da archivi centrali, non dalla foto della famiglia.</p>
<div class="product-details-actions"><a href="${esc(src)}" target="_blank" rel="noopener noreferrer" class="btn btn-soft">Produttore ↗</a>${buy}</div>
<p class="note-inline">I link Amazon possono generare commissioni. Nessun prezzo è presentato come offerta in tempo reale. <a href="../../trasparenza.html">Trasparenza affiliazioni</a>.</p>
<h2 class="product-other-heading">Altre versioni della famiglia</h2><nav class="product-version-picker" aria-label="Altre versioni di ${esc(f.title)}">${other}</nav>
</div></section>
<div class="product-backbar product-backbar-bottom"><a href="../smartphone.html" class="product-back-link" data-smartphone-back>← Torna indietro</a><a href="index.html" class="product-back-link">Tutte le schede ↗</a></div></main>
<a href="#contenuto" class="product-scroll-top" data-product-scroll-top hidden aria-label="Torna all'inizio della scheda">↑ Torna su</a>
<footer class="site-footer"><div class="wrap"><div class="footer-grid"><div class="footer-brand"><a class="brand" href="../../index.html"><span class="brand-mark" aria-hidden="true">ϟ</span><span>Scelto<b>Smart</b></span></a><p>Guide indipendenti per scegliere prodotti tecnologici con consapevolezza.</p></div><div><p class="footer-heading">Esplora</p><nav class="footer-list"><a href="../smartphone.html">Smartphone</a><a href="../accessori.html">Accessori</a><a href="../../trova-smartphone.html">Trova smartphone</a><a href="../../guide/index.html">Guide</a></nav></div><div><p class="footer-heading">Informazioni</p><nav class="footer-list"><a href="../../chi-siamo.html">Chi siamo</a><a href="../../contatti.html">Contatti</a><a href="../../trasparenza.html">Trasparenza affiliazioni</a><a href="../../privacy.html">Privacy</a><a href="../../cookie.html">Cookie</a></nav></div></div><div class="footer-bottom"><span>© 2026 SceltoSmart · Progetto editoriale indipendente</span><span>In qualità di Affiliato Amazon io ricevo un guadagno dagli acquisti idonei.</span></div></div></footer>
</body></html>
`;
}
function all(families,specs,links,images){
const out=[],seen=new Set();
for(const f of families)for(const n of f.models){
 if(seen.has(n))throw new Error("Duplicato: "+n);seen.add(n);
 if(!specs[n]||!specs[n].source)throw new Error("Fonte specifiche mancante "+n);
 if(!(n in images))throw new Error("Foto non censita "+n);
 out.push({name:n,path:"prodotti/schede/"+slug(n)+".html",content:render(n,f,specs[n],links[key(n)],images[n])});
}
if(out.length!==71)throw new Error("Attese 71 schede, trovate "+out.length);
return out;
}
return {all,render,slug,key};
})();
