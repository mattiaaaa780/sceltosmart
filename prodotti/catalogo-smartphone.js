/* Catalogo famiglie e versioni SceltoSmart: nessun tracker, nessuna offerta fittizia. */
(function () {
  "use strict";
  const families=Array.isArray(window.SCELTOSMART_FAMIGLIE)?window.SCELTOSMART_FAMIGLIE:[];
  const links=window.SCELTOSMART_LINK_AMAZON||{};
  const root=document.getElementById("family-catalog");
  if(!root)return;
  const search=document.getElementById("family-search");
  const brand=document.getElementById("family-brand");
  const os=document.getElementById("family-os");
  const counter=document.getElementById("family-count");
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
        ? '<a class="variant-amazon" href="'+htmlEscape(affiliate)+'" target="_blank" rel="sponsored noopener noreferrer">Vedi su Amazon · affiliato ↗</a>'
        : '<span class="variant-pending">Link Amazon da aggiungere</span>';
      const legacy=model==="Google Pixel 10a"?' id="pixel"':model==="Samsung Galaxy A57 5G"?' id="samsung"':"";
      return '<li class="variant-item"'+legacy+' data-variant="'+htmlEscape(model)+'"><div class="variant-name"><strong>'+htmlEscape(model)+'</strong><small>Versione specifica: verifica memoria, colore e venditore.</small></div><div class="variant-actions"><a href="'+htmlEscape(src)+'" target="_blank" rel="noopener noreferrer">Produttore ↗</a>'+action+'</div></li>';
    }).join("");
    const open=(f.id==="pixel10"||f.id==="galaxya57")?" open":"";
    return '<article class="catalog-row family-card" id="'+htmlEscape(f.id)+'" data-family-brand="'+htmlEscape(f.brand)+'" data-family-os="'+htmlEscape(f.os)+'" data-family-search="'+htmlEscape((f.brand+" "+f.title+" "+f.desc+" "+f.models.join(" ")).toLowerCase())+'"><div class="catalog-picture family-image"><img src="'+htmlEscape(imgUrl)+'" alt="Foto rappresentativa della gamma '+htmlEscape(f.title)+'; le varianti possono avere un aspetto diverso" width="220" height="220" loading="lazy" decoding="async" referrerpolicy="no-referrer"></div><div class="catalog-copy"><div class="family-tags"><span class="small-tag">'+htmlEscape(f.brand)+'</span><span class="small-tag green">'+htmlEscape(f.models.length)+' versioni</span></div><h2>'+htmlEscape(f.title)+'</h2><p>'+htmlEscape(f.desc)+'</p><details class="family-variants"'+open+'><summary>Mostra le '+htmlEscape(f.models.length)+' versioni della famiglia <span aria-hidden="true">⌄</span></summary><ul class="variant-list">'+models+'</ul></details><p class="catalog-credit">Foto esemplificativa: '+htmlEscape(f.credit)+'. <a href="'+htmlEscape(src)+'" target="_blank" rel="noopener noreferrer">Fonte ufficiale del produttore ↗</a></p></div></article>';
  }).join("");
  root.innerHTML=output;
  root.querySelectorAll(".family-image img").forEach(img=>{
    img.addEventListener("error",()=>{
      img.hidden=true;
      const placeholder=document.createElement("span");
      placeholder.className="photo-fallback";
      placeholder.setAttribute("aria-label","Immagine non disponibile");
      placeholder.textContent="📱";
      img.parentElement.append(placeholder);
    },{once:true});
  });
  const cards=[...root.querySelectorAll(".family-card")];
  const normalize=s=>String(s||"").toLocaleLowerCase("it").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  function filter(){
    let shown=0,versions=0;
    const q=normalize(search.value.trim());
    cards.forEach(card=>{
      const matchBrand=!brand.value||brand.value==="all"||card.dataset.familyBrand===brand.value;
      const matchOs=!os.value||os.value==="all"||card.dataset.familyOs===os.value;
      const matches=!q||normalize(card.dataset.familySearch).includes(q);
      const visible=matchBrand&&matchOs&&matches;
      card.hidden=!visible;
      if(visible){shown++;versions+=card.querySelectorAll(".variant-item").length;if(q)card.querySelector("details").open=true;}
    });
    counter.textContent=shown+" famiglie · "+versions+" versioni";
    empty.hidden=shown!==0;
  }
  search.addEventListener("input",filter);
  brand.addEventListener("change",filter);
  os.addEventListener("change",filter);
  filter();
  if(window.location.hash){
    const id=decodeURIComponent(window.location.hash.slice(1));
    const target=document.getElementById(id);
    if(target){const details=target.closest("details");if(details)details.open=true;requestAnimationFrame(()=>target.scrollIntoView({block:"start"}));}
  }
})();
