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
    {keys:["airpods","buds","wh-1000","jbl","anker","cuffie","auricolari","power bank","powerbank","caricatore","caricabatterie","custodia","accessori"],url:"prodotti/accessori.html",filter:true},
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
    if (match) window.location.href = root + match.url + (match.filter ? "?q=" + encodeURIComponent(input.value.trim()) : "");
    else {
      if (feedback) feedback.textContent = "Nessun risultato preciso: guarda tutte le guide e le categorie.";
      const target = document.getElementById("categorie");
      if (target) target.scrollIntoView({behavior:"smooth"});
    }
  });
})();


/* Filtri locali sul catalogo: nessuna richiesta al server e nessun cookie. */
(function () {
  const catalog=document.querySelector("[data-catalog]");
  if(!catalog)return;
  const search=document.querySelector("[data-catalog-search]");
  const type=document.querySelector("[data-catalog-filter]");
  const cards=[...catalog.querySelectorAll("[data-catalog-item]")];
  const counter=document.querySelector("[data-catalog-count]");
  const empty=document.querySelector("[data-catalog-empty]");
  const normalize=s=>(s||"").toLocaleLowerCase("it").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  function update(){
    const q=normalize(search&&search.value.trim()), filter=type?type.value:"all";
    let visible=0;
    cards.forEach(card=>{
      const text=normalize(card.dataset.search);
      const matches=(!q||text.includes(q))&&(filter==="all"||card.dataset.group===filter);
      card.hidden=!matches;if(matches)visible++;
    });
    if(counter)counter.textContent=visible+" prodotti mostrati";
    if(empty)empty.style.display=visible?"none":"block";
  }
  if(search){
    const initial=new URLSearchParams(window.location.search).get("q");
    if(initial)search.value=initial.slice(0,120);
    search.addEventListener("input",update);
  }
  if(type)type.addEventListener("change",update);
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
    if(img.complete&&!img.naturalWidth)mark();
    else img.addEventListener("error",mark,{once:true});
  });
})();
