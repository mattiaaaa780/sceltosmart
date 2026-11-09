/* SceltoSmart — confronto libero di tutti i modelli presenti in catalogo.
   Non aggiunge prezzi, valutazioni o dati tecnici non registrati. */
(function(){
  "use strict";
  const form=document.getElementById("manual-compare-form");
  if(!form)return;
  const families=Array.isArray(window.SCELTOSMART_FAMIGLIE)?window.SCELTOSMART_FAMIGLIE:[];
  const verified=window.SCELTOSMART_SPECIFICHE||{};
  const first=document.getElementById("manual-compare-first");
  const second=document.getElementById("manual-compare-second");
  const status=document.getElementById("manual-compare-status");
  const submit=document.getElementById("manual-compare-submit");
  const dialog=document.getElementById("manual-compare-dialog");
  const results=document.getElementById("manual-compare-results");
  const total=document.getElementById("manual-compare-total");
  const safe=value=>String(value==null?"":value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const slug=value=>String(value).toLocaleLowerCase("it").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\+/g,"-plus").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  const present=value=>value!==null&&value!==undefined&&value!=="";
  const fmt=value=>typeof value==="number"?value.toLocaleString("it-IT"):String(value);
  const valueOr=(value,unit="")=>present(value)?fmt(value)+unit:"Dato non verificato";
  const linkOk=url=>typeof url==="string"&&/^https:\/\//i.test(url);
  const models=new Map();
  families.forEach(family=>(family.models||[]).forEach(name=>{
    if(!models.has(name))models.set(name,{name,brand:family.brand,os:family.os,source:family.source,spec:verified[name]||{}});
  }));
  const names=[...models.keys()].sort((a,b)=>a.localeCompare(b,"it",{sensitivity:"base",numeric:true}));
  const groups=new Map();
  names.forEach(name=>{
    const brand=models.get(name).brand||"Altri";
    if(!groups.has(brand))groups.set(brand,[]);
    groups.get(brand).push(name);
  });
  [first,second].forEach(select=>{
    [...groups.keys()].sort((a,b)=>a.localeCompare(b,"it")).forEach(brand=>{
      const group=document.createElement("optgroup");
      group.label=brand;
      groups.get(brand).forEach(name=>{
        const option=document.createElement("option");
        option.value=name;
        option.textContent=name;
        group.appendChild(option);
      });
      select.appendChild(group);
    });
  });
  total.textContent=names.length+" modelli";
  function update(){
    const a=first.value, b=second.value;
    submit.disabled=!a||!b||a===b;
    status.textContent=a&&b&&a===b
      ?"Scegli due modelli diversi per il confronto."
      :a&&b?"Pronto: "+a+" e "+b+"."
      :"Puoi confrontare anche modelli di marche diverse, ad esempio iPhone e Samsung.";
  }
  first.addEventListener("change",update);
  second.addEventListener("change",update);
  function row(label,format,one,two){
    return '<tr><th scope="row">'+safe(label)+'</th><td>'+safe(format(one))+'</td><td>'+safe(format(two))+'</td></tr>';
  }
  function sourceOrSheet(p){
    const url=linkOk(p.spec.source)?p.spec.source:linkOk(p.source)?p.source:null;
    const source=url?'<a href="'+safe(url)+'" target="_blank" rel="noopener noreferrer">Fonte del produttore ↗</a>':"";
    return '<div class="finder-manual-links"><a href="prodotti/schede/'+slug(p.name)+'.html">Apri la scheda completa ↗</a>'+source+'</div>';
  }
  form.addEventListener("submit",event=>{
    event.preventDefault();
    const a=models.get(first.value),b=models.get(second.value);
    if(!a||!b||a===b){update();return;}
    const s=a.spec,t=b.spec;
    const toText=value=>valueOr(value);
    const truth=value=>value===true?"Sì":value===false?"No":"Dato non verificato";
    const display=p=>present(p.screen)?valueOr(p.screen,"″"):"Dato non verificato";
    const num=(v,u)=>valueOr(v,u);
    const labels=[
      ["Sistema operativo",()=>a.os,()=>b.os],
      ["Marca",()=>a.brand,()=>b.brand],
      ["Schermo",()=>display(s),()=>display(t)],
      ["Tecnologia display",()=>toText(s.displayTech),()=>toText(t.displayTech)],
      ["Risoluzione",()=>toText(s.resolution),()=>toText(t.resolution)],
      ["Frequenza massima",()=>num(s.hz," Hz"),()=>num(t.hz," Hz")],
      ["Processore",()=>toText(s.chip),()=>toText(t.chip)],
      ["RAM",()=>toText(s.ram),()=>toText(t.ram)],
      ["Memoria interna",()=>toText(s.storage),()=>toText(t.storage)],
      ["Peso",()=>num(s.weight," g"),()=>num(t.weight," g")],
      ["Batteria tipica",()=>num(s.battery," mAh"),()=>num(t.battery," mAh")],
      ["Autonomia video dichiarata",()=>num(s.video," ore"),()=>num(t.video," ore")],
      ["Ricarica",()=>toText(s.chargingInfo|| (present(s.charge)?fmt(s.charge)+" W":"")),()=>toText(t.chargingInfo||(present(t.charge)?fmt(t.charge)+" W":""))],
      ["Ricarica wireless",()=>truth(s.wireless),()=>truth(t.wireless)],
      ["Fotocamera principale",()=>num(s.mainMp," MP"),()=>num(t.mainMp," MP")],
      ["Ultragrandangolare",()=>truth(s.ultrawide),()=>truth(t.ultrawide)],
      ["Teleobiettivo (zoom ottico)",()=>num(s.tele,"×"),()=>num(t.tele,"×")],
      ["Fotocamera frontale",()=>num(s.frontMp," MP"),()=>num(t.frontMp," MP")],
      ["Resistenza dichiarata",()=>toText(s.ipRating),()=>toText(t.ipRating)],
      ["Aggiornamenti software",()=>toText(s.updatesInfo||(present(s.updates)?fmt(s.updates)+" anni":"")),()=>toText(t.updatesInfo||(present(t.updates)?fmt(t.updates)+" anni":""))]
    ];
    const tbody=labels.map(([label,fnA,fnB])=>row(label,x=>x,fnA(),fnB())).join("");
    results.innerHTML='<table class="finder-manual-table" aria-label="Confronto caratteristiche degli smartphone"><thead><tr><th scope="col">Caratteristica</th><th scope="col">'+safe(a.name)+'</th><th scope="col">'+safe(b.name)+'</th></tr></thead><tbody>'+tbody+'</tbody><tfoot><tr><td>Approfondisci</td><td>'+sourceOrSheet(a)+'</td><td>'+sourceOrSheet(b)+'</td></tr></tfoot></table>';
    if(typeof dialog.showModal==="function"){dialog.showModal();results.scrollTop=0;}
    else {results.scrollIntoView({behavior:"smooth",block:"start"});}
  });
  update();
})();
