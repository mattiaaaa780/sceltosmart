# SceltoSmart — verifica prima del lancio

*Revisione tecnica: 5 novembre 2026. Questo documento non costituisce una certificazione di conformità legale.*

## Controlli tecnici effettuati

- **71 schede HTML statiche**, una per variante, nella directory `prodotti/schede/`. I link del catalogo e dell'assistente puntano alle singole schede.
- **88 URL nella sitemap XML e testuale**, con URL specifici per le 71 versioni; `robots.txt` segnala la sitemap.
- Titoli, meta description, canonical, Open Graph e dati strutturati di navigazione; nessun prezzo, rating, recensione o disponibilità inventati.
- **Controlli automatici GitHub Actions**: `scripts/site_audit.py` verifica link locali, metadati, sitemap, dati e copertura dei modelli; `scripts/sync_schede.cjs --check` controlla la coerenza tra archivio e 71 schede statiche; `qa/mobile-smoke.cjs` usa Playwright sui principali percorsi a 390, 768 e 1365 px.
- Immagini dei cataloghi con dimensioni stabilite, `loading="lazy"` fuori dallo schermo, priorità per le prime visibili e grafica di riserva dove prevista.
- Il Finder calcola le proposte nel browser senza inviare le preferenze a un nostro server. I link commerciali riportano l'attributo `rel="sponsored"` nei collegamenti verificati.

I test browser automatici **bloccano le richieste alle immagini esterne** per rendere i risultati ripetibili. Pertanto non dimostrano che le fotografie siano raggiungibili nella navigazione reale, né misurano i Core Web Vitals del sito pubblicato.

## Attività che non si possono chiudere senza il titolare

1. **Identità e contatto del titolare:** fornire i dati giuridicamente pertinenti e un indirizzo di contatto per Privacy e Contatti. Non compilare informazioni inventate.
2. **Diritti delle fotografie:** determinare la licenza/permesso per ogni immagine non originale. La fonte e i crediti fotografici non costituiscono da soli autorizzazione al riutilizzo. Sostituire le immagini senza permesso con foto proprie, autorizzate o illustrazioni originali.
3. **Cookie e richieste di terze parti:** verificare le richieste reali del browser, gli eventuali cookie e le condizioni dei fornitori prima del lancio; se compaiono tracciamenti non tecnici, impedirli prima del consenso e predisporre la gestione delle scelte. Non inserire un banner fittizio senza verifica.
4. **Informativa privacy definitiva:** confermare titolare, basi giuridiche, destinatari, periodi di conservazione e trasferimenti. Richiedere una revisione professionale prima di dichiarare conformità al GDPR.
5. **Search Console:** verificare lo stato effettivo della proprietà e inviare o confermare `https://mattiaaaa780.github.io/sceltosmart/sitemap.xml`; controllare copertura e indicizzazione delle schede.
6. **Verifica dal vivo:** testare su Chrome, Safari e Firefox con rete reale, insieme a Lighthouse/PageSpeed Insights, cache, HTTPS, immagini, link affiliati e prestazioni su mobile.
7. **Aggiornamenti di prodotto:** controllare che i dettagli delle pagine HTML statiche restino allineati con `prodotti/specifiche-verificate.js` quando si cambiano modelli e caratteristiche.

## Inventario dei domini immagini esterne

Campione ricavato da `prodotti/dati-smartphone.js`, `index.html`, `prodotti/accessori.html` e `prodotti/protezioni.html`. I duplicati sono conteggiati come utilizzi; una stessa fotografia può apparire su più pagine.

**Domini:** 38 · **riferimenti rilevati:** 87.

| Dominio | Riferimenti | Dove compare |
|---|---:|---|
| `s3-ap-southeast-2.amazonaws.com` | 13 | Catalogo smartphone, index.html, prodotti/protezioni.html |
| `youget.pt` | 8 | Catalogo smartphone, index.html, prodotti/protezioni.html |
| `vividgold.co.ke` | 6 | Catalogo smartphone, prodotti/protezioni.html |
| `images4.joy-sourcing.com` | 6 | Catalogo smartphone, prodotti/protezioni.html |
| `image.vandenborre.be` | 5 | Catalogo smartphone, prodotti/protezioni.html |
| `cdsassets.apple.com` | 3 | Catalogo smartphone, prodotti/protezioni.html |
| `cdn.idealo.com` | 3 | Catalogo smartphone, prodotti/protezioni.html |
| `media.materiel.net` | 3 | Catalogo smartphone, index.html, prodotti/accessori.html |
| `sonyworld.ae` | 3 | index.html, prodotti/accessori.html |
| `www.gadcet.com` | 2 | Catalogo smartphone, prodotti/protezioni.html |
| `files.foxtrot.com.ua` | 2 | Catalogo smartphone, prodotti/protezioni.html |
| `media.currys.biz` | 2 | Catalogo smartphone, prodotti/protezioni.html |
| `castore.uz` | 2 | Catalogo smartphone, prodotti/protezioni.html |
| `coralrsprod.blob.core.windows.net` | 2 | Catalogo smartphone, prodotti/protezioni.html |
| `i02.appmifile.com` | 2 | Catalogo smartphone, index.html |
| `www.instacart.com` | 2 | index.html, prodotti/accessori.html |
| `static.wixstatic.com` | 2 | index.html, prodotti/accessori.html |
| `cdn.shopify.com` | 1 | Catalogo smartphone |
| `dam.elcorteingles.es` | 1 | Catalogo smartphone |
| `mistore.dk` | 1 | Catalogo smartphone |
| `media.falabella.com` | 1 | Catalogo smartphone |
| `www.fons.gt` | 1 | Catalogo smartphone |
| `cdn.cimri.io` | 1 | Catalogo smartphone |
| `img.drz.lazcdn.com` | 1 | Catalogo smartphone |
| `cdn.ispace.cz` | 1 | Catalogo smartphone |
| `salgsbutikken.dk` | 1 | Catalogo smartphone |
| `shop.urbanrepublic.com.my` | 1 | Catalogo smartphone |
| `www.jbhifi.co.nz` | 1 | Catalogo smartphone |
| `i5.walmartimages.com` | 1 | Catalogo smartphone |
| `api.technopolis.bg` | 1 | Catalogo smartphone |
| `oechsle.vteximg.com.br` | 1 | prodotti/accessori.html |
| `www.proshop.fi` | 1 | prodotti/accessori.html |
| `www.ugreenindia.com` | 1 | prodotti/accessori.html |
| `product.hstatic.net` | 1 | prodotti/accessori.html |
| `in.esrtech.com` | 1 | prodotti/accessori.html |
| `i6.momoshop.com.tw` | 1 | prodotti/accessori.html |
| `www.canex.ca` | 1 | prodotti/accessori.html |
| `shikostore.com` | 1 | prodotti/accessori.html |

Tutti i domini vanno esaminati per condizioni d'uso, disponibilità e implicazioni privacy. Non sono stati verificati singolarmente i permessi di ripubblicazione.

## Procedura di mantenimento

- Per aggiornare una caratteristica: verificare la pagina ufficiale del produttore, modificare `prodotti/specifiche-verificate.js` ed eseguire `node scripts/sync_schede.cjs` per sincronizzare le 71 schede statiche; `node scripts/sync_schede.cjs --check` verifica le differenze.
- Per aggiungere un modello: aggiornare famiglia e dati, creare la nuova scheda statica, aggiungere il suo URL alla sitemap XML/testuale, aggiornare catalogo e test.
- Prima di pubblicare: controllare esito verde dei workflow **SceltoSmart - controllo siti e link** e **Audit mobile SceltoSmart**. Un test superato non sostituisce l'ispezione reale del sito.

## Fonti istituzionali utili

- [Garante Privacy — FAQ Cookie](https://www.garanteprivacy.it/faq/cookie)
- [Amazon.it — Accordo del Programma Affiliazione](https://programma-affiliazione.amazon.it/help/operating/agreement)
- [Google Search Central — Creare e inviare una sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=it)
