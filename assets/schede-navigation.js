/* Navigazione delle schede statiche SceltoSmart: nessun tracciamento. */
(function(){
"use strict";
const back=document.querySelectorAll("[data-smartphone-back]");
const previous=document.referrer;
let sameSite=false;
try{const u=new URL(previous);sameSite=u.origin===location.origin&&history.length>1;}catch(_){}
back.forEach(a=>a.addEventListener("click",e=>{if(!sameSite)return;e.preventDefault();history.back();}));
const top=document.querySelector("[data-product-scroll-top]");
if(top){const update=()=>{top.hidden=window.scrollY<420;};top.addEventListener("click",e=>{e.preventDefault();window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});});
window.addEventListener("scroll",update,{passive:true});update();}
document.querySelectorAll(".static-product-photo img").forEach(img=>{const fail=()=>{img.replaceWith(Object.assign(document.createElement("span"),{className:"photo-fallback",textContent:"📱 Immagine non disponibile"}));};img.addEventListener("error",fail,{once:true});if(img.complete&&!img.naturalWidth)fail();});
})();