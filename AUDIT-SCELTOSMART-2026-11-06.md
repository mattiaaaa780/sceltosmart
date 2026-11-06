# Audit tecnico SceltoSmart — 6 novembre 2026

**Progetto:** SceltoSmart, sito statico pubblicato su GitHub Pages.  
**Ambito:** catalogo smartphone, 71 schede HTML, archivio specifiche, accessori, link Amazon, immagini esterne, note affiliazioni, pagina Privacy e Cookie.

## Risultati delle verifiche dei file

| Controllo | Esito |
|---|---|
| Famiglie smartphone | 28 |
| Modelli/varianti smartphone | 71, senza duplicati |
| Schede tecniche statiche | 71/71 presenti e presenti nella sitemap |
| Voci dell'archivio specifiche | 71/71, ciascuna con URL sul dominio del produttore |
| Mappatura link per modelli | 71/71 chiavi corrispondenti |
| Link Amazon configurati nel catalogo smartphone | 32, senza URL duplicati |
| Varianti ancora senza un link Amazon | 39: non è stato inventato alcun collegamento |
| Verifica HTML delle 71 schede | Nessun link Amazon non coerente con la mappa; nessuna fonte assente; nessuna discrepanza nei principali campi numerici confrontabili |
| Catalogo accessori | 12 schede, tutte con immagine e fonte ufficiale |
| Link Amazon accessori | 10, tutti con `rel="sponsored noopener noreferrer"` |
| Fotografie delle 28 famiglie | Tutti i campi `img` contengono URL HTTPS; sono risorse esterne e **non** sono stati verificati live né i permessi di riutilizzo |
| Prodotto/indicizzazione | Sitemap XML aggiornata; lo stato reale Google Search Console non è stato consultato in questo audit |

**Limiti importanti:** la verifica delle 71 schede è una verifica di coerenza nel repository (presenza, URL, mappatura e alcuni valori numerici), **non** un riesame manuale di ogni singolo dato sul sito del produttore. Non è stata effettuata una verifica live con browser di tutti i collegamenti e delle immagini. Un link breve `link.amazon` sintatticamente valido non dimostra la destinazione corretta o l'accredito delle commissioni.

## Correzioni applicate al repository

1. `assets/site.js`: identificazione più evidente dei collegamenti Amazon sponsorizzati; fallback quando le immagini delle schede statiche non si caricano.
2. `prodotti/catalogo-smartphone.js`: il collegamento "Produttore" di ogni variante punta alla pagina ufficiale relativa a quella variante, se presente nell'archivio; etichetta affiliata nei pulsanti generati dal catalogo.
3. `prodotti/specifiche-verificate.js`: arricchiti Samsung Galaxy Z Fold8, Galaxy Z Fold8 Ultra e POCO X8 con dati presenti sulle pagine ufficiali dei produttori.
4. `prodotti/schede/samsung-galaxy-z-fold8.html`, `samsung-galaxy-z-fold8-ultra.html`, `poco-x8.html`: aggiunte le informazioni coerenti e aggiornati i riferimenti ufficiali.
5. Homepage, smartphone, accessori, protezioni, scheda dinamica e indice schede: aggiornati gli URL di caricamento JavaScript per evitare l'uso di versioni obsolete memorizzate nella cache.

## Verifiche ancora aperte prima di considerare concluso il lancio

### Priorità alta

- **Fotografie e licenze.** Le immagini del catalogo sono prevalentemente caricate da produttori o rivenditori esterni. Citare la fonte non dà automaticamente il diritto di riprodurle. Occorre confermare i permessi e, quando non disponibili, usare fotografie autorizzate o illustrazioni originali.
- **Collegamenti Amazon.** Aprire ciascuno dei 32 link brevi degli smartphone e dei 10 degli accessori, controllando modello, variante, marketplace e corretto tracciamento nell'account Affiliati. Qui il reindirizzamento non è stato verificabile.
- **Privacy e cookie.** La pagina Privacy segnala correttamente che l'identificazione completa del titolare, la revisione dei fornitori e altri dettagli sono ancora da completare. Va affrontato prima di considerare definitivi gli aspetti legali.

### Priorità media

- **Immagini dal vivo.** Testare da un browser desktop e mobile le immagini esterne, che possono rifiutare hotlink o scomparire in seguito. I fallback impediscono di mostrare un'area vuota, ma non sostituiscono una foto funzionante.
- **Riesame delle 71 specifiche.** Continuare a controllare modello per modello tutti i valori, in particolare varianti per paese, aggiornamenti software, ricarica, fotocamere e fonti non specifiche. La sola presenza di un URL ufficiale non prova ogni campo.
- **Search Console.** Attendere e verificare direttamente lo stato di acquisizione della sitemap e l'indicizzazione; non è dimostrata dalle verifiche GitHub.

## Fonti ufficiali usate per le nuove specifiche

- Samsung Galaxy Z Fold8 e Fold8 Ultra: https://www.samsung.com/it/support/mobile-devices/what-is-the-difference-between-the-galaxy-z-fold8-ultra-and-z-fold8/
- POCO X8: https://www.mi.com/global/product/poco-x8/specs/
- Trasparenza link: https://programma-affiliazione.amazon.it/help/node/topic/GHQNZAU6669EZS98

**Questo documento è un report tecnico, non una certificazione legale, di accessibilità o di conformità alle regole Amazon.**
