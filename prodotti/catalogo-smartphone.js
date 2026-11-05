/* Catalogo famiglie e versioni SceltoSmart: nessun tracker, nessuna offerta fittizia. */
(function () {
  "use strict";
  const families=Array.isArray(window.SCELTOSMART_FAMIGLIE)?window.SCELTOSMART_FAMIGLIE:[];
  const links=window.SCELTOSMART_LINK_AMAZON||{};
  const root=document.getElementById("family-catalog");
  if(!root||families.length===0)return;
  const search=document.getElementById("family-search");
  const brand=document.getElementById("family-brand");
  const os=document.getElementById("family-os");
  const counter=document.getElementById("family-count");
  const size=document.getElementById("family-size");
  const spec=document.getElementById("family-spec");
  const sort=document.getElementById("family-sort");
  const reset=document.getElementById("family-reset");
  const documented=Array.isArray(window.SCELTOSMART_FINDER_MODELS)?window.SCELTOSMART_FINDER_MODELS:[];
  const modelByName=new Map(documented.map(m=>[m.name.toLocaleLowerCase("it"),m]));
  const empty=document.getElementById("family-empty");
  const htmlEscape=x=>String(x==null?"":x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const keyFor=s=>{
    if(s==="Google Pixel 10a")return "pixel10a";
    if(s==="Samsung Galaxy A57 5G")return "galaxyA57";
    return String(s).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/\+/g,"-plus").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  };
  function validLink(raw){
    if(typeof raw!=="string"||!raw.trim())return null;
    try{
      const u=new URL(raw);if(u.protocol!=="https:")return null;
      const h=u.hostname.toLowerCase();
      if(h==="link.amazon"||h==="amzn.to"||h==="amzn.eu")return u.href;
      if((h==="www.amazon.it"||h==="amazon.it")&&u.searchParams.has("tag"))return u.href;
    }catch(e){/* ignora URL errati */}
    return null;
  }
  const sourceUrl=s=>{try{const u=new URL(s);return u.protocol==="https:"?u.href:"";}catch(e){return""}};
  const brands=[...new Set(families.map(f=>f.brand))].sort((a,b)=>a.localeCompare(b,"it"));
  brands.forEach(value=>{
    const option=document.createElement("option");
    option.value=value;option.textContent=value;brand.append(option);
  });
  const output=families.map(f=>{
    const imgUrl=sourceUrl(f.img);
    const src=sourceUrl(f.source);
    const models=f.models.map(model=>{
      const key=keyFor(model);
      const affiliate=validLink(links[key]);
      const action=affiliate
        ? '<a class="variant-amazon" href="'+htmlEscape(affiliate)+'" target="_blank" rel="sponsored noopener noreferrer">Vedi su Amazon ↗</a>'
        : '<span class="variant-pending">Link Amazon da aggiungere</span>';
      const legacy=model==="Google Pixel 10a"?' id="pixel"':model==="Samsung Galaxy A57 5G"?' id="samsung"':"";
      return '<li class="variant-item"'+legacy+' data-variant="'+htmlEscape(model)+'"><div class="variant-name"><strong>'+htmlEscape(model)+'</strong><small>Versione specifica: verifica memoria, colore e venditore.</small></div><div class="variant-actions"><a href="'+htmlEscape(src)+'" target="_blank" rel="noopener noreferrer">Produttore ↗</a>'+action+'</div></li>';
    }).join("");
    const open=" open";
    return '<article class="catalog-row family-card" id="'+htmlEscape(f.id)+'" data-family-brand="'+htmlEscape(f.brand)+'" data-family-os="'+htmlEscape(f.os)+'" data-family-search="'+htmlEscape((f.brand+" "+f.title+" "+f.desc+" "+f.models.join(" ")).toLowerCase())+'"><div class="catalog-picture family-image"><img src="'+htmlEscape(imgUrl)+'" alt="Foto rappresentativa della gamma '+htmlEscape(f.title)+'; le varianti possono avere un aspetto diverso" width="220" height="220" loading="lazy" decoding="async" referrerpolicy="no-referrer"></div><div class="catalog-copy"><div class="family-tags"><span class="small-tag">'+htmlEscape(f.brand)+'</span><span class="small-tag green">'+htmlEscape(f.models.length)+' versioni</span></div><h2>'+htmlEscape(f.title)+'</h2><p>'+htmlEscape(f.desc)+'</p><details class="family-variants"'+open+'><summary>Mostra le '+htmlEscape(f.models.length)+' versioni della famiglia <span aria-hidden="true">⌄</span></summary><ul class="variant-list">'+models+'</ul></details><p class="catalog-credit">Foto esemplificativa: '+htmlEscape(f.credit)+'. <a href="'+htmlEscape(src)+'" target="_blank" rel="noopener noreferrer">Fonte ufficiale del produttore ↗</a></p></div></article>';
  }).join("");
  if(root.querySelectorAll(".family-card").length !== families.length)root.innerHTML=output;
  // Aggiorna i pulsanti delle versioni dal file di configurazione, senza ricreare
  // la lista visibile. Così i nuovi link aggiunti in futuro compaiono da soli.
  root.querySelectorAll(".variant-item").forEach(item=>{
    const model=item.getAttribute("data-variant");
    const actions=item.querySelector(".variant-actions");
    if(!model||!actions)return;
    const prev=actions.querySelector(".variant-amazon, .variant-pending");
    if(prev)prev.remove();
    const affiliate=validLink(links[keyFor(model)]);
    if(affiliate){
      const a=document.createElement("a");
      a.className="variant-amazon";
      a.href=affiliate;
      a.target="_blank";
      a.rel="sponsored noopener noreferrer";
      a.textContent="Vedi su Amazon ↗";
      actions.append(a);
    }else{
      const span=document.createElement("span");
      span.className="variant-pending";
      span.textContent="Link Amazon da aggiungere";
      actions.append(span);
    }
  });
  root.querySelectorAll(".family-image img").forEach(img=>{
    if(img.closest("#xiaomi17")&&!img.dataset.fallbackImage)
      img.dataset.fallbackImage="../assets/xiaomi17-riserva.svg";
    const fallback=()=>{
      if(img.dataset.fallbackShown==="true")return;
      if(img.dataset.fallbackImage&&img.dataset.fallbackTried!=="true"){
        img.dataset.fallbackTried="true";
        img.src=img.dataset.fallbackImage;
        return;
      }
      img.dataset.fallbackShown="true";
      img.hidden=true;
      const placeholder=document.createElement("span");
      placeholder.className="photo-fallback";
      placeholder.setAttribute("role","img");
      placeholder.setAttribute("aria-label","Immagine temporaneamente non disponibile");
      placeholder.textContent="📱";
      img.parentElement.append(placeholder);
    };
    img.addEventListener("error",fallback);
    if(img.complete&&!img.naturalWidth)fallback();
  });
  const cards=[...root.querySelectorAll(".family-card")];
  const normalize=s=>String(s||"").toLocaleLowerCase("it").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  // Le dimensioni possono essere filtrate soltanto per i modelli documentati.
  // Le famiglie restano visibili se almeno una variante corrisponde.
  root.querySelectorAll(".variant-item").forEach(item=>{
    const model=modelByName.get((item.dataset.variant||"").toLocaleLowerCase("it"));
    if(!model)return;
    const actions=item.querySelector(".variant-actions");
    if(!actions||actions.querySelector(".variant-details"))return;
    const a=document.createElement("a");
    a.className="variant-details";
    a.textContent="Scheda completa ↗";
    a.href="scheda-smartphone.html?modello="+encodeURIComponent(model.name);
    actions.prepend(a);
  });
  function filter(){
    let shown=0,versions=0;
    const q=normalize(search.value.trim());
    const chosenSize=size?size.value:"all";
    const documentedOnly=spec&&spec.value==="documented";
    cards.forEach(card=>{
      const matchBrand=!brand.value||brand.value==="all"||card.dataset.familyBrand===brand.value;
      const matchOs=!os.value||os.value==="all"||card.dataset.familyOs===os.value;
      const variants=[...card.querySelectorAll(".variant-item")];
      let matchingVersions=0;
      variants.forEach(item=>{
        const name=item.dataset.variant||"";
        const model=modelByName.get(name.toLocaleLowerCase("it"));
        const matchText=!q||normalize(name+" "+card.dataset.familySearch).includes(q);
        const matchSize=chosenSize==="all"||(model&&
          (chosenSize==="small"?model.screen<=6.4:chosenSize==="medium"?model.screen>6.4&&model.screen<6.65:model.screen>=6.65));
        const visible=matchText&&matchSize&&(!documentedOnly||!!model);
        item.hidden=!visible;
        if(visible)matchingVersions++;
      });
      const visible=matchBrand&&matchOs&&matchingVersions>0;
      card.hidden=!visible;
      if(visible){
        shown++;versions+=matchingVersions;
        if(q||chosenSize!=="all"||documentedOnly)card.querySelector("details").open=true;
      }
    });
    counter.textContent=shown+" famiglie · "+versions+" versioni";
    empty.hidden=shown!==0;
    if(sort&&sort.value!=="original"){
      [...cards].sort((a,b)=>a.querySelector("h2").textContent.localeCompare(b.querySelector("h2").textContent,"it")*(sort.value==="az"?1:-1)).forEach(card=>root.append(card));
    }else{
      cards.forEach(card=>root.append(card));
    }
  }
  const initialQuery=new URLSearchParams(window.location.search).get("q");
  if(initialQuery)search.value=initialQuery.slice(0,120);
  search.addEventListener("input",filter);
  brand.addEventListener("change",filter);
  os.addEventListener("change",filter);
  if(size)size.addEventListener("change",filter);
  if(spec)spec.addEventListener("change",filter);
  if(sort)sort.addEventListener("change",filter);
  if(reset)reset.addEventListener("click",()=>{search.value="";brand.value="all";os.value="all";if(size)size.value="all";if(spec)spec.value="all";if(sort)sort.value="original";filter();search.focus();});
  filter();
  if(window.location.hash){
    const id=decodeURIComponent(window.location.hash.slice(1));
    const target=document.getElementById(id);
    if(target){const details=target.closest("details");if(details)details.open=true;requestAnimationFrame(()=>target.scrollIntoView({block:"start"}));}
  }
})();
