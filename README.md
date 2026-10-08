# Portfolio di Vittorio Loris Simonetti

Il sito è in [`site/`](site/README.md): contenuti, comandi e procedure di aggiornamento sono
descritti lì. Il deploy su GitHub Pages è in `.github/workflows/deploy.yml`.

L'analisi che ha portato al rifacimento è in [`report/analisi-portfolio.html`](report/analisi-portfolio.html).

## Aggiornare il sito: i due comandi

Si lanciano dalla cartella `site/` (la prima volta su un PC: `npm install`).

### 1. Anteprima in locale

```bash
npm run update
```

1. Importa le badge dal profilo Credly pubblico.
2. Cerca in Download l'ultimo export LinkedIn (`*LinkedInDataExport*.zip`) e mostra le differenze
   con i ruoli del sito, senza scrivere nulla. Con `-- --apply` le applica a `experience.yaml`; con
   `-- --linkedin "<percorso>"` usa un file preciso.
3. Esegue i test del Worker di AskMe.
4. Fa le domande di prova ad AskMe, se nel terminale è impostata `GROQ_API_KEY`.
5. Fa la build del sito e dell'immagine di anteprima per LinkedIn.
6. Salva in Download `VLS_Portfolio_context_NotebookLM.txt`: tutti i contenuti del sito in un solo
   file di testo, da caricare su NotebookLM insieme al CV in PDF.
7. Mostra il riepilogo e le modifiche non ancora pubblicate, poi apre il sito su
   http://localhost:4321/newAI-Portfolio/ (Ctrl+C per chiudere).

Non pubblica niente.

### 2. Pubblicazione

```bash
npm run update:publish
```

1. Rifà gli stessi passaggi da 1 a 6. Se un test o la build falliscono, si ferma.
2. Mostra i file che verranno pubblicati e chiede conferma.
3. Con la conferma fa commit e push su `master`: GitHub Actions pubblica il sito in circa un minuto.

Funziona solo dal branch `master`. Con `-- --worker` ripubblica anche il Worker di AskMe (serve solo
se ne è cambiato il codice).

In locale, AskMe e il form di contatto leggono le chiavi da `site/.env`, che va creato su ogni PC
(è escluso da git):

```
PUBLIC_ASKME_ENDPOINT=https://askme.<tuo-account>.workers.dev
PUBLIC_WEB3FORMS_KEY=<chiave Web3Forms>
```
