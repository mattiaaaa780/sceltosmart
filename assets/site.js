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
    {keys:["pixel","google pixel","galaxy","samsung","telefono","smartphone","cellulare"],url:"prodotti/smartphone.html"},
    {keys:["notebook","portatile","pc","computer","laptop","informatica","tablet"],url:"guide/scegliere-notebook.html"},
    {keys:["cuffie","auricolari","wireless","bluetooth","accessori"],url:"guide/scegliere-cuffie.html"},
    {keys:["casa","domotica","smart home","wifi","router","lampadine"],url:"guide/casa-smart.html"},
    {keys:["guida","guide","consigli"],url:"guide/index.html"}
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
    if (match) window.location.href = root + match.url;
    else {
      if (feedback) feedback.textContent = "Nessun risultato preciso: guarda tutte le guide e le categorie.";
      const target = document.getElementById("categorie");
      if (target) target.scrollIntoView({behavior:"smooth"});
    }
  });
})();
