# ⚡ SceltoSmart

SceltoSmart è un sito editoriale italiano, pubblicato con **GitHub Pages**, per orientarsi tra smartphone, accessori e guide d'acquisto senza presentare prezzi non verificati.

## Le sezioni

- `index.html`: homepage e percorsi principali.
- `prodotti/smartphone.html`: catalogo di 28 famiglie e 71 varianti, con ricerca e filtri.
- `prodotti/schede/`: 71 schede HTML autonome con URL permanente, fonte del produttore e navigazione accessibile.
- `prodotti/scheda-smartphone.html`: pagina di compatibilità per i vecchi collegamenti e selezione di famiglia.
- `prodotti/specifiche-verificate.js`: dati per variante e collegamenti alle fonti ufficiali.
- `trova-smartphone.html` + `assets/trova-smartphone*.js`: assistente orientativo locale (non classifica di prezzi o qualità).
- `prodotti/accessori.html` e `prodotti/protezioni.html`: accessori e protezioni.
- `privacy.html`, `cookie.html`, `trasparenza.html`: informazioni per gli utenti.

## Qualità e verifica

Il repository ha due workflow GitHub Actions: **controllo statico** (link, file, sitemap, sintassi JS) e **test mobile** tramite Chromium/Playwright. Per eseguire l'audit statico in locale:

```bash
python3 scripts/site_audit.py
```

Per i test mobile serve Node.js e Playwright (`qa/mobile-smoke.cjs`). L'audit non sostituisce una prova reale su tutti i browser e con le risorse esterne abilitate.

## Aggiornare le specifiche

1. Controllare la **versione esatta** e la relativa pagina ufficiale.
2. Aggiornare `prodotti/specifiche-verificate.js` evitando valori dedotti da altre varianti.
3. Sincronizzare le 71 schede HTML statiche con `node scripts/sync_schede.cjs` (sostituisce i blocchi tecnici quando i dati dell’archivio cambiano).
4. Eseguire `node scripts/sync_schede.cjs --check` e `python3 scripts/site_audit.py`; i workflow GitHub Actions controllano automaticamente sia i collegamenti sia l’allineamento tra dati e schede.
5. Verificare tutti i link e l'esito dei workflow prima della pubblicazione.

Per i punti ancora da completare prima del lancio pubblico, consultare [qa/VERIFICHE-LANCIO.md](qa/VERIFICHE-LANCIO.md). Le immagini esterne necessitano di autorizzazioni o licenze d'uso verificate.
