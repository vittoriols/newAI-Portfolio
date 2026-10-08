# Portfolio di Vittorio Loris Simonetti

Il sito è in [`site/`](site/README.md): contenuti, comandi e procedure di aggiornamento sono
descritti lì. Il deploy su GitHub Pages è in `.github/workflows/deploy.yml`.

L'analisi che ha portato al rifacimento è in [`report/analisi-portfolio.html`](report/analisi-portfolio.html).

## File del vecchio sito da rimuovere

Il vecchio sito (Create React App) non è più usato dalla build. Questi file e cartelle in radice si
possono cancellare:

- `src/`, `public/` (l'audio e la firma sono già stati copiati in `site/`)
- `package.json`, `package-lock.json`, `node_modules/`, `build/`
- `tailwind.config.js`, `postcss.config.js`
- il file chiamato `--force` (si cancella con `rm ./--force`)
