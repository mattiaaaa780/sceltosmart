/* SceltoSmart — assistente e confronto elaborati nel browser.
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
  const images=window.SCELTOSMART_IMMAGINI||{};
  const compareHint=document.getElementById("finder-compare-hint");
  const compareTray=document.getElementById("finder-compare-tray");
  const compareStatus=document.getElementById("finder-compare-status");
  const compareOpen=document.getElementById("finder-compare-open");
  const compareClear=document.getElementById("finder-compare-clear");
  const compareDialog=document.getElementById("finder-compare-dialog");
  const compareTable=document.getElementById("finder-compare-table");
  const compareNote=document.getElementById("finder-compare-note");
  const canCompare=typeof compareDialog?.showModal==="function";
  let selected=[];
  if(!form||!output||!summary||!count||!models.length){
    if(summary)summary.textContent="Non è stato possibile caricare le schede. Visita il catalogo smartphone.";
    return;
  }
  const safe=x=>String(x==null?"":x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const slug=x=>String(x).toLocaleLowerCase("it").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\+/g,"-plus").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  const readable=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,".");
  const modelPage=p=>"prodotti/schede/"+slug(p.name)+".html";
  const screenText=p=>p.screen.toLocaleString("it-IT")+"″";
  const batteryText=p=>p.battery ? readable(p.battery)+" mAh tipici"
    : p.video ? "Fino a "+p.video+" h di video" : "Dato da verificare";
  const imageFallback='<span class="finder-photo-fallback">Foto non disponibile</span>';
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
      if(p.updates>=6)r.push(p.updatesInfo||p.updates+" anni di aggiornamenti dichiarati");
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
  function officialLink(p,source=p.source,label="Specifiche ufficiali"){
    if(!/^https:\/\//.test(source))return "";
    return '<a href="'+safe(source)+'" target="_blank" rel="noopener noreferrer" aria-label="'+safe(label+" di "+p.name)+'">'+label+' ↗</a>';
  }
  function deviceCard(p,i,use,size,compareAvailable){
    const image=images[p.name];
    const imageUrl=image?.thumbnail||image?.src;
    const hasPhoto=image&&["ufficiale-modello","modello-identificabile"].includes(image.status)
      && /^https:\/\//.test(imageUrl);
    const photo=hasPhoto
      ? '<img src="'+safe(imageUrl)+'" alt="" width="140" height="140" loading="lazy" decoding="async" referrerpolicy="no-referrer">'
      : imageFallback;
    const accessories=["Apple","Samsung","Google"].includes(p.brand)
       ? '<a class="finder-link-subtle" href="prodotti/protezioni.html?id=protezione-'+slug(p.name)+'">Cover e vetri compatibili ↗</a>' : "";
    const explain=reasons(p,use).map(t=>'<li><span aria-hidden="true">✓</span>'+safe(t)+'</li>').join("");
    const highlights=p.traits.map(t=>'<span>'+safe(t)+'</span>').join("");
    const note=(size!=="any")?'<span class="finder-match-note">Dimensione richiesta: '+(size==="small"?"compatta":"grande")+'</span>':"";
    return '<article class="finder-result">'+
       '<div class="finder-result-head">'+
       '<a class="finder-product-art" href="'+modelPage(p)+'" aria-label="Apri la scheda di '+safe(p.name)+'">'+photo+'</a>'+
       '<div class="finder-result-title"><div class="finder-result-eyebrow">SUGGERIMENTO '+(i+1)+' · '+safe(p.brand)+' · '+safe(p.os)+'</div><h3>'+safe(p.name)+'</h3><p>'+safe(p.note)+'</p>'+note+'</div></div>'+
       '<div class="finder-facts"><span><b>'+safe(screenText(p))+'</b> Display</span><span><b>'+safe(p.hz)+' Hz</b> Frequenza massima</span><span><b>'+safe(batteryText(p))+'</b> Batteria</span></div>'+
       '<div class="finder-why"><strong>Perché può fare al caso tuo</strong><ul>'+explain+'</ul></div>'+
       '<div class="finder-highlights">'+highlights+'</div>'+
       '<div class="finder-card-links"><div class="finder-card-actions"><a class="finder-card-main" href="'+modelPage(p)+'">Scheda completa ↗</a>'+
       (compareAvailable?'<button class="finder-compare-toggle" type="button" aria-pressed="false" aria-label="Confronta '+safe(p.name)+'" data-finder-compare="'+safe(p.name)+'"><span aria-hidden="true"></span>Confronta</button>':"")+
       '</div>'+officialLink(p)+accessories+'</div>'+
       '</article>';
  }
  function updateComparison(){
    const full=selected.length===2;
    for(const button of output.querySelectorAll("[data-finder-compare]")){
      const picked=selected.some(p=>p.name===button.dataset.finderCompare);
      button.setAttribute("aria-pressed",String(picked));
      button.disabled=full&&!picked;
    }
    compareTray.hidden=selected.length===0;
    compareOpen.disabled=!full;
    compareStatus.textContent=selected.length
      ? selected.length+" di 2 · "+selected.map(p=>p.name).join(" e ")
      : "";
  }
  function openComparison(){
    if(selected.length!==2)return;
    const rows=[
      ["Display",p=>screenText(p)+" · fino a "+p.hz+" Hz"],
      ["Peso",p=>p.weight ? p.weight+" g" : "Dato da verificare"],
      ["Batteria e autonomia",batteryText],
      ["Fotocamere posteriori",p=>[
        p.mainMp&&"Principale "+p.mainMp+" MP",
        p.ultrawide&&"Ultragrandangolare",
        p.tele>0 ? "Teleobiettivo fino a "+p.tele.toLocaleString("it-IT")+"×" : "Teleobiettivo dedicato assente"
      ].filter(Boolean).join(" · ")],
      ["Aggiornamenti",p=>p.updatesInfo||(p.updates ? "Fino a "+p.updates+" anni" : "Durata da verificare"),"updatesSource"],
      ["Processore",p=>p.chip]
    ];
    const headers=selected.map((p,i)=>
      '<th id="finder-compare-model-'+i+'" scope="col"><span>'+safe(p.os)+'</span>'+safe(p.name)+'</th>'
    ).join("");
    const body=rows.map(([label,value,sourceField],row)=>{
      const rowId="finder-compare-field-"+row;
      const cells=selected.map((p,i)=>{
        const source=p[sourceField];
        const citation=source ? officialLink(p,source,"Fonte aggiornamenti") : "";
        return '<td headers="finder-compare-model-'+i+' '+rowId+'">'+safe(value(p))+citation+'</td>';
      }).join("");
      return '<tbody><tr><th id="'+rowId+'" scope="rowgroup" colspan="2">'+label+'</th></tr><tr>'+cells+'</tr></tbody>';
    }).join("");
    const links=selected.map((p,i)=>
      '<td headers="finder-compare-model-'+i+'"><a class="finder-compare-sheet" href="'+modelPage(p)+'" aria-label="Scheda completa di '+safe(p.name)+'">Scheda completa ↗</a>'+officialLink(p)+'</td>'
    ).join("");
    compareTable.innerHTML='<table aria-label="Specifiche a confronto"><thead><tr>'+headers+'</tr></thead>'+body+'<tfoot><tr>'+links+'</tr></tfoot></table>';
    compareNote.hidden=!(selected.some(p=>p.battery)&&selected.some(p=>p.video));
    compareDialog.showModal();
    compareTable.parentElement.scrollTop=0;
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
    const compareAvailable=canCompare&&suggested.length>1;
    count.textContent=pool.length+" "+(pool.length===1?"modello selezionato":"modelli selezionati")+" su "+models.length+" documentati";
    if(!suggested.length){
      summary.textContent="Nessun modello della selezione risponde a tutti i filtri. Prova a cambiare dimensioni o sistema operativo.";
      output.innerHTML='<div class="finder-no-results">Non abbiamo una scheda verificata per questa combinazione. <a href="prodotti/smartphone.html">Esplora il catalogo completo ↗</a></div>';
    }else{
      const sizeLabel=v.size==="small"?" · dimensioni compatte":v.size==="large"?" · schermo grande":"";
      const osLabel=v.os==="any"?"iOS e Android":v.os;
      summary.textContent=suggested.length+" proposte ragionate per "+osLabel+" · "+priorityLabels[v.use]+sizeLabel+". "+(mixedSystems?"Con Indifferente mostriamo Android e iPhone: ciascun sistema è valutato separatamente. ":"")+"Non è una classifica per qualità o prezzo.";
      output.innerHTML=suggested.map((p,i)=>deviceCard(p,i,v.use,v.size,compareAvailable)).join("");
    }
    if(canCompare){
      selected=compareAvailable ? selected.filter(p=>suggested.includes(p)) : [];
      compareHint.hidden=!compareAvailable;
      updateComparison();
    }
  }
  output.addEventListener("error",function(event){
    if(event.target.matches(".finder-product-art img")){
      event.target.parentElement.innerHTML=imageFallback;
    }
  },true);
  if(canCompare){
    output.addEventListener("click",function(event){
      const button=event.target.closest("[data-finder-compare]");
      if(!button||button.disabled)return;
      const model=models.find(p=>p.name===button.dataset.finderCompare);
      selected=selected.includes(model) ? selected.filter(p=>p!==model) : [...selected,model];
      updateComparison();
    });
    compareOpen.addEventListener("click",openComparison);
    compareClear.addEventListener("click",function(){
      const firstPicked=output.querySelector('[data-finder-compare][aria-pressed="true"]');
      selected=[];
      updateComparison();
      firstPicked?.focus();
    });
  }
  form.addEventListener("change",refresh);
  if(reset)reset.addEventListener("click",function(){
    form.reset();
    selected=[];
    refresh();
    form.scrollIntoView({block:"start"});
  });
  refresh();
})();
