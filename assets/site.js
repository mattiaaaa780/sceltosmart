/* SceltoSmart: menu mobile e ricerca locale, senza cookie o tracciamento. */
(function () {
  document.documentElement.classList.add("js");
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const opened = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(opened));
      toggle.textContent = opened ? "✕ Chiudi" : "☰ Menu";
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "☰ Menu";
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "☰ Menu";
        toggle.focus();
      }
    });
  }
  const form = document.querySelector("[data-site-search]");
  if (!form) return;
  const input = form.querySelector("input[type=search]");
  const feedback = document.getElementById("search-feedback");
  const root = form.dataset.root || "";
  const matches = [
    {keys:["cover","vetri","vetro temperato","protezione schermo","pellicola","case per","custodia per","spigen"],url:"prodotti/protezioni.html",filter:true,protect:true},
    {keys:["airpods","buds","wh-1000","jbl","anker","cuffie","auricolari","power bank","powerbank","caricatore","caricabatterie","custodia","accessori","airtag","smarttag","halolock","esr","ulanzi","ugreen","maggo","qi2","vetro","vetro temperato","cavo","treppiede","supporto auto","localizzatore"],url:"prodotti/accessori.html",filter:true},
    {keys:["pixel","google","galaxy","samsung","iphone","apple","xiaomi","redmi","poco","nothing","motorola","honor","oppo","oneplus","telefono","smartphone","cellulare"],url:"prodotti/smartphone.html",filter:true},
    {keys:["guida","guide","consigli"],url:"guide/index.html",filter:false}
  ];
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const query = (input.value || "").trim().toLocaleLowerCase("it");
    if (!query) {
      if (feedback) feedback.textContent = "Scrivi il nome di un prodotto o di una categoria.";
      input.focus();
      return;
    }
    const match = matches.find(item => item.keys.some(key => query.includes(key) || key.includes(query) && query.length >= 3));
    if (match) {
      const searched=match.protect?query.replace(/\b(cover|vetri|vetro|temperato|protezione|schermo|pellicola|custodia|case|spigen|per|di|del|della|il|la)\b/gi," ").replace(/\s+/g," ").trim():input.value.trim();
      window.location.href=root+match.url+(match.filter&&searched?"?q="+encodeURIComponent(searched):"");
    }
    else {
      if (feedback) feedback.textContent = "Nessun risultato preciso: guarda tutte le guide e le categorie.";
      const target = document.getElementById("categorie");
      if (target) target.scrollIntoView({behavior:"smooth"});
    }
  });
})();


/* Filtri locali sul catalogo: ricerca, categorie e schede responsive, senza tracciamento. */
(function () {
  "use strict";
  const catalog=document.querySelector("[data-catalog]");
  if(!catalog)return;
  const search=document.querySelector("[data-catalog-search]");
  const type=document.querySelector("[data-catalog-filter]");
  const cards=[...catalog.querySelectorAll("[data-catalog-item]")];
  const counter=document.querySelector("[data-catalog-count]");
  const empty=document.querySelector("[data-catalog-empty]");
  const chips=[...document.querySelectorAll("[data-accessory-category]")];
  const groups=[...catalog.querySelectorAll("[data-accessory-group]")];
  const clear=document.querySelector("[data-accessory-clear]");
  const normalize=s=>(s||"").toLocaleLowerCase("it").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  function update(){
    const q=normalize(search&&search.value.trim());
    const filter=type?type.value:"all";
    let visible=0;
    cards.forEach(card=>{
      const text=normalize(card.dataset.search);
      const matches=(!q||text.includes(q))&&(filter==="all"||card.dataset.group===filter);
      card.hidden=!matches;
      if(matches)visible++;
    });
    groups.forEach(group=>{
      group.hidden=![...group.querySelectorAll("[data-catalog-item]")].some(card=>!card.hidden);
    });
    chips.forEach(chip=>chip.setAttribute("aria-pressed",String(chip.dataset.accessoryCategory===filter)));
    if(counter)counter.textContent=visible+" "+(visible===1?"prodotto mostrato":"prodotti mostrati");
    if(empty){
      empty.hidden=visible!==0;
      empty.style.display=visible?"none":"block";
    }
  }
  const params=new URLSearchParams(window.location.search);
  if(search){
    const initial=params.get("q");
    if(initial)search.value=initial.slice(0,120);
    search.addEventListener("input",update);
  }
  if(type){
    const initial=params.get("categoria");
    if(initial&&[...type.options].some(option=>option.value===initial))type.value=initial;
    type.addEventListener("change",update);
  }
  chips.forEach(chip=>chip.addEventListener("click",function(){
    if(!type)return;
    const target=chip.dataset.accessoryCategory;
    type.value=type.value===target?"all":target;
    update();
    const catalogStart=document.getElementById("catalogo-accessori");
    if(catalogStart)catalogStart.scrollIntoView({behavior:"smooth",block:"start"});
  }));
  if(clear)clear.addEventListener("click",function(){
    if(type)type.value="all";
    if(search)search.value="";
    update();
    if(search)search.focus();
  });
  catalog.querySelectorAll(".catalog-picture img").forEach(img=>{
    const showFallback=()=>{
      if(img.dataset.fallbackShown==="true")return;
      img.dataset.fallbackShown="true";
      img.hidden=true;
      const art=document.createElement("span");
      art.className="accessory-no-image";
      art.setAttribute("role","img");
      art.setAttribute("aria-label","Immagine temporaneamente non disponibile");
      art.textContent=img.closest("[data-catalog-item]")?.dataset.group==="audio"?"🎧":"📦";
      img.parentElement.append(art);
    };
    if(img.complete&&!img.naturalWidth)showFallback();
    else img.addEventListener("error",showFallback,{once:true});
  });
  update();
})();

/* Fallback grafico: se una foto ospitata da terzi non è disponibile,
   la scheda resta leggibile e navigabile. */
(function () {
  const pics=document.querySelectorAll(".home-revamp .home-stage img, .home-revamp .home-category img, .home-revamp .home-product-media img, .home-revamp .home-accessory-img img");
  pics.forEach(function(img){
    const mark=function(){
      const container=img.parentElement;
      if(!container)return;
      img.style.display="none";
      container.classList.add("home-image-fallback");
    };
    const recover=function(){
      const reserve=img.dataset.fallbackImage;
      if(reserve&&img.dataset.fallbackTried!=="true"){
        img.dataset.fallbackTried="true";
        img.src=reserve;
        return;
      }
      mark();
    };
    img.addEventListener("error",recover);
    if(img.complete&&!img.naturalWidth)recover();
  });
})();
