"use strict";
// Esegui controllo responsive dopo la correzione del breakpoint nav a 920px.
const {chromium}=require("playwright");
const assert=require("node:assert/strict");
const {spawn}=require("node:child_process");
const {mkdirSync}=require("node:fs");
const server=spawn("python3",["-m","http.server","8765","--bind","127.0.0.1"],{stdio:"ignore"});
const base="http://127.0.0.1:8765";
const files=["index.html","trova-smartphone.html","prodotti/smartphone.html","prodotti/accessori.html","prodotti/protezioni.html","privacy.html","cookie.html","prodotti/schede/google-pixel-11.html","prodotti/schede/iphone-17.html","prodotti/schede/xiaomi-17-ultra.html"];
mkdirSync("qa-results",{recursive:true});
let browser;
(async()=>{
 await new Promise(done=>setTimeout(done,1200));
 browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 let checked=0;
 for(const width of [390,768,1365]){
  const page=await browser.newPage({viewport:{width,height:844}});
  const errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  await page.route("**/*",route=>{
    const u=route.request().url();
    return u.startsWith(base)||u.startsWith("data:")?route.continue():route.abort();
  });
  for(const file of files){
   const r=await page.goto(base+"/"+file,{waitUntil:"domcontentloaded",timeout:20000});
   assert.equal(r.status(),200,"HTTP "+file);
   await page.waitForTimeout(240);
   const dims=await page.evaluate(()=>({w:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelectorAll("h1").length}));
   if(dims.scroll>dims.w+2){
     const off=await page.evaluate(()=>[...document.querySelectorAll("body *")].filter(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+3||r.left< -3}).slice(0,16).map(e=>{const r=e.getBoundingClientRect();return e.tagName.toLowerCase()+"#"+e.id+"."+String(e.className?.baseVal||e.className||"").slice(0,90)+"["+Math.round(r.left)+","+Math.round(r.right)+"]"}));
     throw Error(file+" overflow at "+width+"px: "+dims.scroll+" > "+dims.w+" offenders: "+off.join(" | "));
   }
   assert.equal(dims.h1,1,"H1 "+file);
   if(file==="index.html"){
     assert.equal(await page.locator(".home-product").count(),4);
     const img=page.locator('.home-product[href*="famiglia=xiaomi17"] img');
     await img.scrollIntoViewIfNeeded();
     await page.waitForFunction(()=>{const e=document.querySelector('.home-product[href*="famiglia=xiaomi17"] img');return !!e&&e.complete&&e.naturalWidth>0;},null,{timeout:10000});
     assert.match(await img.getAttribute("src"),/xiaomi17-riserva\.svg$/);
     if(width===390){
       const menu=page.locator("[data-nav-toggle]");
       await menu.click();assert.equal(await menu.getAttribute("aria-expanded"),"true");
       await menu.click();assert.equal(await menu.getAttribute("aria-expanded"),"false");
       await page.screenshot({path:"qa-results/home-mobile.png",fullPage:true});
     }
   }
   if(file==="trova-smartphone.html"){
     await page.waitForFunction(()=>document.querySelectorAll(".finder-result").length===3);
     const labels=await page.locator(".finder-result-eyebrow").allTextContents();
     assert(labels.some(x=>x.includes("Android"))&&labels.some(x=>x.includes("iOS")),"Mixed OS");
     await page.locator('input[name="os"][value="iOS"]').check();
     assert((await page.locator(".finder-result-eyebrow").allTextContents()).every(x=>x.includes("iOS")),"iOS filter");
     if(width===390)await page.screenshot({path:"qa-results/finder-mobile.png",fullPage:true});
   }
   if(file==="prodotti/smartphone.html"){
     assert.equal(await page.locator(".family-card").count(),28);
     await page.locator("#xiaomi17 .family-image img").scrollIntoViewIfNeeded();
     await page.waitForFunction(()=>{const e=document.querySelector("#xiaomi17 .family-image img");return !!e&&e.complete&&e.naturalWidth>0;},null,{timeout:10000});
     assert.match(await page.locator("#xiaomi17 .family-image img").getAttribute("src"),/xiaomi17-riserva\.svg$/);
     if(width===390)await page.screenshot({path:"qa-results/catalogo-mobile.png",fullPage:true});
   }

   if(file==="prodotti/smartphone.html"){
     assert.equal(await page.locator(".variant-details").count(),71,"71 schede cliccabili");
     const missingLinks=await page.locator('.variant-details:not([href^="schede/"])').count();
     assert.equal(missingLinks,0,"Collegamenti alle pagine statiche");
     const controls=await page.evaluate(()=>[...document.querySelectorAll(".catalog-toolbar label")].map(x=>{const r=x.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom};}));
     for(let a=0;a<controls.length;a++)for(let b=a+1;b<controls.length;b++){
       const x=controls[a],y=controls[b];
       const overlap=Math.min(x.right,y.right)-Math.max(x.x,y.x)>3&&Math.min(x.bottom,y.bottom)-Math.max(x.y,y.y)>3;
       assert.equal(overlap,false,"Filtri sovrapposti "+a+"/"+b+" a "+width+"px");
     }
   }
   if(file.startsWith("prodotti/schede/")){
     const canonical=await page.locator('link[rel="canonical"]').getAttribute("href");
     assert(canonical.endsWith("/"+file),"Canonical specifico per "+file);
     assert((await page.locator(".product-source-link").count())===1,"Fonte ufficiale disponibile");
     assert((await page.locator("[data-smartphone-back]").count())===2,"Pulsanti torna indietro");
     assert((await page.locator(".product-details-spec").count())>=4,"Specifiche compilate");
     if(width===390&&file.endsWith("google-pixel-11.html")){
       await page.screenshot({path:"qa-results/scheda-mobile.png",fullPage:true});
       await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
       await page.waitForTimeout(150);
       assert(await page.locator("[data-product-scroll-top]").isVisible(),"Pulsante Torna su");
       await page.locator("[data-product-scroll-top]").click();
     }
   }
   if(file==="prodotti/accessori.html")assert.equal(await page.locator("[data-catalog-item]").count(),12);
   if(file==="prodotti/protezioni.html")assert.equal(await page.locator("[data-protection-device]").count(),36);
   if(errors.length)throw Error(file+" JS errors: "+errors.join(" | "));
   checked++;console.log("PASS "+width+"px "+file+", no overflow");
  }
  await page.close();
 }
 console.log("ALL PASSED: "+checked+" viewport/page checks");
})().catch(e=>{console.error("FAIL",e.stack||e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.kill();});
