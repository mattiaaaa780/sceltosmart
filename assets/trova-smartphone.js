/* SceltoSmart — assistente locale, accessibile, senza rete/tracciamento.
   I punteggi ordinano caratteristiche documentate, NON il valore o la
   qualità reale del prodotto. Nessun prezzo o test inventato. */
(function(){
  "use strict";
  const root=document.querySelector("[data-finder]");
  if(!root)return;
  const models=Array.isArray(window.SCELTOSMART_FINDER_MODELS)?window.SCELTOSMART_FINDER_MODELS:[];
  const form=document.getElementById("finder-form");
  const output=document.getElementById("finder-cards");
  const summary=document.getElementById("finder-summary");
  const count=document.getElementById("finder-count");
  const reset=document.getElementById("finder-reset");
  const methodology=document.getElementById("finder-method");
  if(!form||!output||!summary||!count||!models.length){
    if(summary)summary.textContent="Non è stato possibile caricare le schede. Visita il catalogo smartphone.";
    return;
  }
  const safe=x=>String(x==null?"":x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const slug=x=>String(x).toLocaleLowerCase("it").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\+/g,"-plus").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  const readable=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,".");
  const values=()=>({
    os:form.querySelector('input[name="os"]:checked')?.value||"any",
    use:form.querySelector('input[name="use"]:checked')?.value||"daily",
    size:form.querySelector('input[name="size"]:checked')?.value||"any"
  });
  const isSmall=p=>p.screen<=6.4;
  const isLarge=p=>p.screen>=6.65;
  function rank(p,use){
    const capacity=p.battery||0;
    const tier=p.tier||1;
    if(use==="daily")return (p.updates>=6?7:0)+(p.hz>=120?2:0)+(capacity>=4800?3:0)+(p.weight&&p.weight<=185?2:p.weight&&p.weight<=200?1:0)+(tier===1?2:0);
    if(use==="battery")return p.os==="iOS" ? (p.video||0)*0.36+(p.wireless?1:0) : capacity/420+(p.charge>=60?3:p.charge>=40?1:0)+(p.wireless?1:0);
    if(use==="camera")return (p.tele>=5?8:p.tele>=3?6:p.tele>0?3:0)+(p.ultrawide?2:0)+(p.mainMp>=48?2:0);
    if(use==="performance")return tier*6+(p.hz>=120?1:0);
    return 0;
  }
  function reasons(p,use){
    const r=[];
    if(use==="daily"){
      if(p.updates>=6)r.push(p.updates+" anni di aggiornamenti dichiarati");
      if(p.battery>=4800)r.push("Capacità tipica della batteria: "+readable(p.battery)+" mAh");
      if(p.weight&&p.weight<=185)r.push("Peso dichiarato: "+p.weight+" g");
      if(p.hz>=120)r.push("Display con frequenza fino a "+p.hz+" Hz");
      if(!r.length)r.push("Display da "+p.screen.toLocaleString("it-IT")+"\" e caratteristiche utili da verificare");
    }else if(use==="battery"){
      if(p.os==="iOS"&&p.video)r.push("Apple dichiara fino a "+p.video+" ore di riproduzione video");
      if(p.battery)r.push("Batteria tipica dichiarata da "+readable(p.battery)+" mAh");
      if(p.charge)r.push("Ricarica cablata dichiarata fino a "+p.charge+" W");
      if(p.wireless)r.push("Ricarica wireless supportata");
    }else if(use==="camera"){
      if(p.tele)r.push("Teleobiettivo con zoom ottico "+p.tele.toLocaleString("it-IT")+"×");
      if(p.ultrawide)r.push("Fotocamera ultragrandangolare presente");
      if(p.mainMp)r.push("Fotocamera principale da "+p.mainMp+" MP (non indica da sola la qualità)");
    }else{
      r.push("Processore dichiarato: "+p.chip);
      if(p.hz>=120)r.push("Display fino a 120 Hz");
      if(p.tier===3)r.push("Chip della gamma alta del produttore, senza benchmark comparativi");
    }
    return r.slice(0,3);
  }
  function deviceCard(p,i,use,size){
    const screen=p.screen.toLocaleString("it-IT");
    const small=isSmall(p),large=isLarge(p);
    const sizeText=small?"Compatto":large?"Schermo grande":"Intermedio";
    const battery=p.battery?readable(p.battery)+" mAh tipici":p.video?"Fino a "+p.video+" h video (Apple)":"Dato non confrontabile";
    const sourceOK=/^https:\/\//.test(p.source);
    const familyOK=/^[a-z0-9-]+$/.test(p.family);
    const catalog=familyOK?"prodotti/smartphone.html#"+p.family:"prodotti/smartphone.html";
    const accessories=["Apple","Samsung","Google"].includes(p.brand)
       ? '<a class="finder-link-subtle" href="prodotti/protezioni.html?id=protezione-'+slug(p.name)+'">Cover e vetri compatibili ↗</a>' : "";
    const explain=reasons(p,use).map(t=>'<li><span aria-hidden="true">✓</span>'+safe(t)+'</li>').join("");
    const highlights=p.traits.map(t=>'<span>'+safe(t)+'</span>').join("");
    const note=(size!=="any")?'<span class="finder-match-note">Dimensione richiesta: '+(size==="small"?"compatta":"grande")+'</span>':"";
    return '<article class="finder-result">'+
       '<div class="finder-result-head">'+
       '<a class="finder-product-art-link" href="prodotti/schede/'+slug(p.name)+'.html" aria-label="Apri la scheda di '+safe(p.name)+'"><div class="finder-product-art" data-brand="'+safe(p.brand)+'" aria-hidden="true"><div class="finder-phone-back"><div class="finder-lenses"><i></i><i></i><i></i></div><span></span></div></div></a>'+
       '<div class="finder-result-title"><div class="finder-result-eyebrow">SUGGERIMENTO '+(i+1)+' · '+safe(p.brand)+' · '+safe(p.os)+'</div><h3>'+safe(p.name)+'</h3><p>'+safe(p.note)+'</p>'+note+'</div></div>'+
       '<div class="finder-facts"><span><b>'+safe(screen)+'″</b> Display</span><span><b>'+safe(p.hz)+' Hz</b> Frequenza massima</span><span><b>'+safe(battery)+'</b> Batteria</span></div>'+
       '<div class="finder-why"><strong>Perché può fare al caso tuo</strong><ul>'+explain+'</ul></div>'+
       '<div class="finder-highlights">'+highlights+'</div>'+
       '<div class="finder-card-links"><a class="finder-card-main" href="prodotti/schede/'+slug(p.name)+'.html">Scheda completa ↗</a>'+
       (sourceOK?'<a href="'+safe(p.source)+'" target="_blank" rel="noopener noreferrer">Specifiche ufficiali ↗</a>':"")+accessories+'</div>'+
       '</article>';
  }
  function refresh(){
    const v=values();
    form.querySelectorAll(".finder-option").forEach(el=>{
      const input=el.querySelector('input[type="radio"]');
      el.classList.toggle("is-selected",!!(input&&input.checked));
    });
    let pool=models.filter(p=>v.os==="any"||p.os===v.os);
    if(v.size==="small")pool=pool.filter(isSmall);
    if(v.size==="large")pool=pool.filter(isLarge);
    const priorityLabels={daily:"uso quotidiano",battery:"batteria e ricarica",camera:"fotocamera",performance:"prestazioni e processore"};
    const ranked=pool.map((p,index)=>({p,index,score:rank(p,v.use)}))
      .sort((a,b)=>b.score-a.score||a.index-b.index);
    let picks=ranked.slice(0,3);
    let mixedSystems=false;
    if(v.os==="any"){
      // Per "Indifferente" non escludere un ecosistema solo perché i
      // punteggi sono basati su metriche non confrontabili (es. mAh e ore video).
      // Ordina ciascun sistema in modo indipendente; non confrontare i due score.
      const android=ranked.filter(entry=>entry.p.os==="Android");
      const iphone=ranked.filter(entry=>entry.p.os==="iOS");
      if(android.length&&iphone.length){
        mixedSystems=true;
        // Mostra entrambi subito; completa il terzetto con un secondo Android
        // se disponibile (la selezione documentata include più Android).
        picks=[android[0],iphone[0],android[1]||iphone[1]].filter(Boolean);
      }
    }
    const suggested=picks.map(entry=>entry.p);
    count.textContent=pool.length+" "+(pool.length===1?"modello selezionato":"modelli selezionati")+" su "+models.length+" documentati";
    if(!suggested.length){
      summary.textContent="Nessun modello della selezione risponde a tutti i filtri. Prova a cambiare dimensioni o sistema operativo.";
      output.innerHTML='<div class="finder-no-results">Non abbiamo una scheda verificata per questa combinazione. <a href="prodotti/smartphone.html">Esplora il catalogo completo ↗</a></div>';
    }else{
      const sizeLabel=v.size==="small"?" · dimensioni compatte":v.size==="large"?" · schermo grande":"";
      const osLabel=v.os==="any"?"iOS e Android":v.os;
      summary.textContent=suggested.length+" proposte ragionate per "+osLabel+" · "+priorityLabels[v.use]+sizeLabel+". "+(mixedSystems?"Con Indifferente mostriamo Android e iPhone: ciascun sistema è valutato separatamente. ":"")+"Non è una classifica per qualità o prezzo.";
      output.innerHTML=suggested.map((p,i)=>deviceCard(p,i,v.use,v.size)).join("");
    }
  }
  form.addEventListener("change",refresh);
  if(reset)reset.addEventListener("click",function(){
    form.querySelector('input[name="os"][value="any"]').checked=true;
    form.querySelector('input[name="use"][value="daily"]').checked=true;
    form.querySelector('input[name="size"][value="any"]').checked=true;
    refresh();
    document.getElementById("finder-form")?.scrollIntoView({behavior:"smooth",block:"start"});
  });
  if(methodology){
    const tip=document.getElementById("finder-method-trigger");
    if(tip)tip.addEventListener("click",()=>methodology.open=!methodology.open);
  }
  refresh();
})();
