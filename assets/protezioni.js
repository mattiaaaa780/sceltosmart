/* SceltoSmart | ricerca vetri e cover. Nessun tracker, nessuna richiesta esterna. */
(function(){
"use strict";
const root=document.querySelector("[data-protection-catalog]");
if(!root)return;
const buttons=[...document.querySelectorAll("[data-filter-brand]")];
const items=[...root.querySelectorAll("[data-protection-device]")];
const groups=[...root.querySelectorAll("[data-protection-group]")];
const search=document.getElementById("protection-query");
const model=document.getElementById("protection-model");
const counter=document.getElementById("protection-count");
const empty=document.getElementById("protections-empty");
const clear=document.getElementById("protection-reset");
const normalize=s=>String(s||"").toLocaleLowerCase("it").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
let brand="all";
const params=new URLSearchParams(window.location.search);
const initialBrand=params.get("marca");
if(["Apple","Samsung","Google"].includes(initialBrand))brand=initialBrand;
const initialQuery=params.get("q")||params.get("modello");
if(initialQuery)search.value=initialQuery.slice(0,120);
function fillModels(){
const old=model.value;
const list=items.filter(x=>brand==="all"||x.dataset.brand===brand).map(x=>({name:x.dataset.model,id:x.id}));
model.replaceChildren(new Option("Tutti i modelli","all"));
for(const item of list)model.add(new Option(item.name,item.id));
if(list.some(x=>x.id===old))model.value=old;
}
function apply(){
const q=normalize(search.value.trim()),selected=model.value;
let n=0;
for(const item of items){
const okBrand=brand==="all"||item.dataset.brand===brand;
const okQuery=!q||normalize(item.dataset.model).includes(q);
const okSelect=selected==="all"||item.id===selected;
const show=okBrand&&okQuery&&okSelect;
item.hidden=!show;
if(show)n++;
}
for(const g of groups)g.hidden=![...g.querySelectorAll("[data-protection-device]")].some(x=>!x.hidden);
for(const b of buttons)b.setAttribute("aria-pressed",String(b.dataset.filterBrand===brand));
if(counter)counter.textContent=n+" "+(n===1?"modello trovato":"modelli trovati")+" · "+(n*2)+" opzioni cover e vetro";
if(empty)empty.hidden=n!==0;
}
buttons.forEach(b=>b.addEventListener("click",()=>{
brand=b.dataset.filterBrand;
model.value="all";
fillModels();
apply();
}));
search.addEventListener("input",()=>{if(model.value!=="all")model.value="all";apply()});
model.addEventListener("change",()=>{if(model.value!=="all"){search.value="";}apply();if(model.value!=="all"){const item=document.getElementById(model.value);if(item)item.scrollIntoView({behavior:"smooth",block:"start"});}});
clear.addEventListener("click",()=>{brand="all";search.value="";fillModels();model.value="all";apply();search.focus();});
root.querySelectorAll(".protection-device-head img").forEach(img=>{
 const failed=()=>{img.hidden=true;const place=document.createElement("span");place.className="protection-img-fallback";place.textContent="📱";place.setAttribute("aria-label","Immagine non disponibile");img.parentNode.insertBefore(place,img.nextSibling);};
 if(img.complete&&!img.naturalWidth)failed();else img.addEventListener("error",failed,{once:true});
});
fillModels();
const deepModel=params.get("id");
if(deepModel&&items.some(x=>x.id===deepModel)){model.value=deepModel;search.value="";}
apply();
})();
