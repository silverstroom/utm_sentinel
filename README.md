# 🔗 UTM Tracker Pro

Applicazione professionale per la creazione di link UTM e il monitoraggio dei click, organizzata per cliente.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![Turso](https://img.shields.io/badge/Turso-SQLite-00e5a0) ![Vercel](https://img.shields.io/badge/Vercel-Deploy-black)

## Funzionalità

- **Gestione Clienti** — Crea e organizza clienti con colori personalizzati
- **UTM Builder** — Genera link UTM con suggerimenti automatici per source/medium
- **Short Links** — Ogni link UTM viene abbreviato con un codice tracciabile (`/r/abc123`)
- **Click Tracking** — Registra automaticamente dispositivo, browser, OS, referer e IP
- **Dashboard Analytics** — Grafici a barre, breakdown per dispositivo/browser, top link
- **Filtri per Cliente** — Visualizza analytics globali o per singolo cliente/link

## Stack Tecnologico

- **Frontend**: Next.js 14 (App Router), Tailwind CSS
- **Database**: Turso (SQLite edge-compatibile via libsql)
- **Deploy**: Vercel

---

## 🚀 Setup Locale

### 1. Clona e installa

```bash
git clone https://github.com/TUO-USERNAME/utm-tracker-pro.git
cd utm-tracker-pro
npm install
```

### 2. Avvia in locale (senza Turso)

Per lo sviluppo locale, l'app usa automaticamente un file SQLite locale:

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

---

## ☁️ Deploy su Vercel

### Step 1 — Crea un database Turso (gratuito)

1. Vai su [turso.tech](https://turso.tech) e crea un account
2. Installa la CLI:
   ```bash
   # macOS
   brew install tursodatabase/tap/turso
   
   # Linux / WSL
   curl -sSfL https://get.tur.so/install.sh | bash
   ```
3. Login:
   ```bash
   turso auth login
   ```
4. Crea il database:
   ```bash
   turso db create utm-tracker
   ```
5. Ottieni l'URL del database:
   ```bash
   turso db show utm-tracker --url
   # Output: libsql://utm-tracker-tuo-username.turso.io
   ```
6. Crea un token di autenticazione:
   ```bash
   turso db tokens create utm-tracker
   # Output: eyJhbGciOiJF...
   ```

### Step 2 — Carica su GitHub

```bash
git init
git add .
git commit -m "Initial commit: UTM Tracker Pro"
git branch -M main
git remote add origin https://github.com/TUO-USERNAME/utm-tracker-pro.git
git push -u origin main
```

### Step 3 — Deploy su Vercel

1. Vai su [vercel.com](https://vercel.com) e importa il repository GitHub
2. Nelle **Environment Variables** aggiungi:
   | Variable | Value |
   |---|---|
   | `TURSO_DATABASE_URL` | `libsql://utm-tracker-tuo-username.turso.io` |
   | `TURSO_AUTH_TOKEN` | `eyJhbGciOiJF...` (il token generato sopra) |
3. Clicca **Deploy**

L'app sarà live su `https://tuo-progetto.vercel.app`.

---

## 📖 Come Funziona

### Flusso di un link UTM

```
1. Crei un link → /r/abc123
2. L'utente clicca /r/abc123
3. Il server registra: IP, device, browser, OS, referer, timestamp
4. Redirect 302 → URL destinazione + parametri UTM
5. I dati appaiono nella dashboard analytics
```

### Struttura del Progetto

```
utm-tracker/
├── app/
│   ├── page.js                 # Dashboard principale
│   ├── layout.js               # Layout con sidebar
│   ├── globals.css             # Stili globali + Tailwind
│   ├── create/page.js          # Form creazione link UTM
│   ├── clients/page.js         # Gestione clienti
│   ├── links/page.js           # Elenco tutti i link
│   ├── analytics/[id]/page.js  # Analytics per cliente/link
│   ├── r/[code]/route.js       # Redirect + click tracking
│   └── api/
│       ├── clients/route.js    # CRUD clienti
│       ├── links/route.js      # CRUD link
│       └── clicks/route.js     # Stats click
├── components/
│   └── Sidebar.js              # Navigazione laterale
├── lib/
│   ├── db.js                   # Layer database (Turso/libsql)
│   └── utils.js                # Utility (ID generation, UA parser)
└── package.json
```

---

## 🛠 Comandi Utili

```bash
npm run dev      # Avvia in sviluppo (localhost:3000)
npm run build    # Build di produzione
npm run start    # Avvia build di produzione
```

## License

MIT
