# Portfolio di Vittorio Loris Simonetti

Sito statico in [Astro](https://astro.build), pubblicato su GitHub Pages. Tutti i contenuti
stanno in `content/`: le pagine, l'assistente AskMe e l'immagine di anteprima si generano da lì.

```
content/
  profile.yaml              chi sei, frase di apertura, link, audio
  experience.yaml           ruoli (titoli e date da LinkedIn, testi tuoi)
  engagements.yaml          clienti, sempre anonimi
  publications.yaml         libro, brevetto, defensive publication
  projects.yaml             progetti con codice pubblico
  recognition.yaml          riconoscimenti, insegnamento, community
  skills.yaml               competenze, senza percentuali
  certifications-extra.yaml certificazioni che non sono su Credly
  badges.overrides.yaml     quali badge Credly mostrare
  credly/badges.json        generato da import:credly, non modificarlo a mano
  askme/notes.md            cose che AskMe deve sapere e non sono nelle pagine
  askme/checks.yaml         domande di prova per AskMe
scripts/                    import e generazione (Credly, LinkedIn, AskMe, audio, anteprima)
src/                        pagine e componenti
worker/                     proxy di AskMe su Cloudflare Workers
```

**Regola d'oro:** tutto quello che sta in `content/` è pubblico. Va online e AskMe può ripeterlo a
chiunque. Niente nomi di clienti, telefono, indirizzo o date personali.

## Aggiornare tutto in un colpo

Dalla cartella `site/`:

```bash
npm run update
```

Importa le badge da Credly e confronta l'ultimo export LinkedIn trovato in Download. Poi esegue i
test del Worker, le domande di prova ad AskMe (se `GROQ_API_KEY` è impostata) e la build, mostra
cosa è cambiato e apre l'anteprima su http://localhost:4321/newAI-Portfolio/. Non pubblica niente.

Se il risultato ti convince:

```bash
npm run update:publish
```

Rifà gli stessi controlli e, dopo una tua conferma, fa commit e push su `master`: GitHub Actions
pubblica in circa un minuto. Funziona solo dal branch `master`, e si ferma se un test o la build
falliscono.

Opzioni: `--linkedin <file.zip>` per indicare un export preciso, `--apply` per scrivere le modifiche
di LinkedIn in `experience.yaml`, `--worker` (con `update:publish`) per ripubblicare anche il Worker.

## Comandi

Dalla cartella `site/`:

```bash
npm install
```

```bash
npm run dev
```

Apre il sito su http://localhost:4321/newAI-Portfolio/ e si aggiorna a ogni modifica.

| Comando | Cosa fa |
|---|---|
| `npm run build` | Genera il sito in `dist/` (e l'immagine di anteprima `public/og.png`) |
| `npm test` | Prova il Worker di AskMe senza Cloudflare né Groq |
| `npm run import:credly` | Scarica le badge dal profilo Credly pubblico |
| `npm run import:linkedin -- <zip>` | Confronta l'export LinkedIn con i contenuti |
| `npm run askme:check` | Fa ad AskMe le domande di prova (serve `GROQ_API_KEY`) |
| `npm run audio:script` | Scrive il copione dell'audio (serve `GROQ_API_KEY`) |
| `npm run audio:voice` | Trasforma il copione approvato in mp3 (serve `GEMINI_API_KEY`) |

## Aggiornare i contenuti

### Badge Credly: automatico
Il deploy importa le badge ogni lunedì e salva la fotografia in `content/credly/badges.json`.
Per farlo subito: **Actions, Deploy to GitHub Pages, Run workflow**.

Cosa compare sul sito lo decide `content/badges.overrides.yaml`: oggi le certificazioni di terze
parti (The Open Group, SAP, Anthropic, Microsoft...) e le credenziali IBM su AI e Agentic AI di
livello practitioner o superiore. Le badge scadute sono nascoste; tra un Level 1 e un Level 2 della
stessa certificazione resta il più alto. Per forzare una badge, mettine l'id in `include` o
`exclude` (l'id è l'ultima parte dell'indirizzo della badge su Credly).

### Posizioni da LinkedIn: semi-automatico
1. Su LinkedIn: **Impostazioni e privacy, Privacy dei dati, Ottieni una copia dei tuoi dati**.
   Scegli i file singoli (Posizioni, Profilo, Licenze e certificazioni, Pubblicazioni), non
   l'archivio completo.
2. Lancia il confronto: lo script legge solo quei file e ignora l'indirizzo.
   ```bash
   npm run import:linkedin -- ~/Downloads/Basic_LinkedInDataExport.zip
   ```
3. Se le differenze sono giuste, applicale. Aggiunge i ruoli nuovi e corregge le date, senza
   toccare i testi che hai scritto.
   ```bash
   npm run import:linkedin -- ~/Downloads/Basic_LinkedInDataExport.zip --write
   ```
4. Scrivi `summary` e `highlights` dei ruoli nuovi in `content/experience.yaml`: su LinkedIn non
   ci sono descrizioni. La build avvisa se un ruolo non ha ancora un testo.
5. Commit e push. Lo zip non va mai nel repo (`.gitignore` lo esclude).

### AskMe: automatico
Il contesto si rigenera a ogni build da tutti i file di `content/` e viene pubblicato in
`askme/context.json`; il Worker lo rilegge ogni ora. Quando cambia qualcosa che vuoi raccontare,
aggiorna `content/askme/notes.md`. Dopo modifiche importanti aggiungi una domanda in
`content/askme/checks.yaml` e lancia `npm run askme:check`.

### Audio di presentazione: semi-automatico
L'audio attuale è quello fatto con NotebookLM a ottobre 2025: la build avvisa che è più vecchio
dell'ultimo cambio di ruolo. Per rifarlo:

1. Scrivi il copione:
   ```bash
   npm run audio:script
   ```
2. Leggi e correggi `content/askme/audio-script.md`, poi metti `approved: true`.
3. Genera l'audio. Comprime l'mp3 e aggiorna durata e data in `profile.yaml`; il copione diventa la
   trascrizione sotto il player.
   ```bash
   npm run audio:voice
   ```

Con NotebookLM a mano: carica `askme/context.json` come fonte, scarica l'mp3, poi comprimilo
nel sito.
```bash
npm run audio:voice -- --compress ~/Downloads/overview.mp3
```

## AskMe: attivare l'assistente

Finché il Worker non è online il sito funziona lo stesso: AskMe mostra "Not connected" e le
domande suggerite portano alle sezioni della pagina.

1. **Ruota la chiave Groq** su console.groq.com: quella vecchia è stata pubblica nel sito
   precedente.
2. Pubblica il Worker (serve un account Cloudflare gratuito), dalla cartella `site/worker/`:
   ```bash
   npx wrangler login
   ```
   ```bash
   npx wrangler secret put GROQ_API_KEY
   ```
   ```bash
   npx wrangler deploy
   ```
   Wrangler stampa l'indirizzo del Worker, per esempio `https://askme.<tuo-account>.workers.dev`.
3. Su GitHub: **Settings, Secrets and variables, Actions, Variables**, crea `ASKME_ENDPOINT` con
   quell'indirizzo. Al prossimo deploy AskMe è online.
4. Facoltativo: crea il secret `GROQ_API_KEY` anche su GitHub. Il deploy eseguirà le domande di
   prova a ogni pubblicazione, senza bloccarla se una fallisce.

Il Worker accetta richieste solo dalle origini in `ALLOWED_ORIGINS` (`worker/wrangler.toml`),
limita le domande per visitatore e taglia conversazioni e messaggi troppo lunghi. Per un limite
più rigido si può aggiungere una regola di rate limiting di Cloudflare davanti al Worker.

**Da verificare:** il contesto pesa circa 4.000 token per domanda. Controlla che stia nei limiti di
token al minuto del tuo piano Groq; se no, cambia `MODEL` in `wrangler.toml` o passa a un piano
superiore.

## Pubblicazione

Ogni push su `master` pubblica il sito (workflow `.github/workflows/deploy.yml`). Il form di
contatto usa il secret esistente `REACT_APP_WEB3_TOKEN` (la chiave di Web3Forms, pubblica per
scelta del servizio). Senza chiave, ad esempio in locale, il form resta visibile e "Send message"
apre il programma di posta con il messaggio già scritto. Per provarlo in locale con l'invio vero,
crea `site/.env` con questa riga (il file è escluso da git):

```
PUBLIC_WEB3FORMS_KEY=<la tua chiave Web3Forms>
```

Con un dominio personale: nel workflow imposta `SITE_URL` (il dominio) e `BASE_PATH=/`, aggiorna
`CONTEXT_URL` e `ALLOWED_ORIGINS` in `worker/wrangler.toml`.

GitHub disattiva le build programmate nei repo pubblici dopo 60 giorni senza attività: arriva
un'email, e si riattivano con un clic da Actions.
