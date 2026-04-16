-- Copia e incolla questo SQL nell'editor di Turso
-- (Dashboard Turso → Database → SQL console)

CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#4c6ef5',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS links (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  short_code TEXT UNIQUE NOT NULL,
  destination_url TEXT NOT NULL,
  utm_source TEXT DEFAULT '',
  utm_medium TEXT DEFAULT '',
  utm_campaign TEXT DEFAULT '',
  utm_term TEXT DEFAULT '',
  utm_content TEXT DEFAULT '',
  label TEXT DEFAULT '',
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  link_id TEXT NOT NULL,
  clicked_at TEXT DEFAULT (datetime('now')),
  ip_address TEXT,
  user_agent TEXT,
  referer TEXT,
  country TEXT,
  device TEXT,
  browser TEXT,
  os TEXT,
  FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE
);

-- Nuova tabella per gli utenti (agenti e admin)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT DEFAULT '',
  surname TEXT DEFAULT '',
  area TEXT DEFAULT '',
  role TEXT DEFAULT 'agent',
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_clicks_link_id ON clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_clicks_date ON clicks(clicked_at);
CREATE INDEX IF NOT EXISTS idx_links_client ON links(client_id);
CREATE INDEX IF NOT EXISTS idx_links_code ON links(short_code);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
