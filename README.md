# 🔗 UTM Tracker Pro

Applicazione professionale per la creazione di link UTM e il monitoraggio dei click, con sistema di autenticazione multi-utente.

## Funzionalità

- **Autenticazione** — Super Admin + registrazione libera per agenti
- **Landing page** — Animazione SVG FloatingPaths
- **Wizard UTM guidato** — Cliente → Link → Canale → (GBP Placement / Organico-Pagamento) → Conferma
- **12 canali preimpostati** — WhatsApp, Meta, Instagram, Facebook, Google Ads, GBP, LinkedIn, TikTok, YouTube, Email, SMS, QR Code, Sito Internet
- **Google Business Profile con 9 posizionamenti** — Sito, WhatsApp, Indicazioni, Chiama, Post, Offerta, Prodotto, Prenotazione, Menu
- **Dashboard avanzata** — Trend giornaliero, click settimanali, top clienti, top link
- **Analytics per cliente/link** — Device, browser, OS, referer, paesi
- **Link abbreviati** — `/r/xxx` con tracking interno
- **100% Mobile responsive** — Sidebar drawer, cards invece di tabelle su mobile

---

## 🔐 Credenziali

### Super Admin
- **Username:** `admin`
- **Password:** `admin2026_?`

L'admin viene creato automaticamente al primo login. Ha accesso alla sezione "Gestione Utenti" per attivare/disattivare/eliminare gli agenti.

### Agenti
Si registrano liberamente dalla pagina `/register` fornendo:
- Nome e Cognome
- Area / Zona geografica
- Email
- Username
- Password (min. 6 caratteri)

---

## 🚀 Setup Turso (Database)

### Step 1: Crea il database su Turso

Le tabelle devono essere create manualmente (una sola volta) perché Vercel-Turso ha un bug con le migration automatiche.

1. Vai su [app.turso.tech](https://app.turso.tech)
2. Apri il tuo database
3. Clicca tab **"Edit Data"** → icona **"SQL console"**
4. Incolla il contenuto di `init-db.sql` e clicca **Run**

### Step 2: Environment Variables

Aggiungi su Vercel (Settings → Environment Variables):

| Key | Value |
|---|---|
| `TURSO_DATABASE_URL` | `libsql://...` |
| `TURSO_AUTH_TOKEN` | `eyJhbGc...` |
| `SESSION_SECRET` | *(opzionale, default già presente — ma per sicurezza metti una stringa random tua)* |

Per lo sviluppo locale crea `.env.local` con gli stessi valori.

---

## 💻 Sviluppo Locale

```bash
npm install
npm run dev
```

Apri `http://localhost:3000`.

---

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS**
- **Turso / libsql** — Database SQLite edge
- **motion** — Animazioni SVG landing
- **Vercel** — Deploy

## License

MIT
