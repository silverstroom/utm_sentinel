import { createClient as createDbClient } from '@libsql/client';

let client;

function getDb() {
  if (!client) {
    client = createDbClient({
      url: process.env.TURSO_DATABASE_URL || 'file:local.db',
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return client;
}

// No ensureInit() at runtime — tables are created via `npm run db:init` separately.
// This avoids @libsql/client's migration jobs API calls which fail with 400 on
// Vercel-managed Turso databases.

// ─── Clients ───────────────────────────────────────────
export async function getAllClients() {
  const result = await getDb().execute(`
    SELECT c.*, COUNT(DISTINCT l.id) as link_count, COUNT(cl.id) as total_clicks
    FROM clients c
    LEFT JOIN links l ON l.client_id = c.id
    LEFT JOIN clicks cl ON cl.link_id = l.id
    GROUP BY c.id ORDER BY c.created_at DESC
  `);
  return result.rows;
}

export async function getClient(id) {
  const r = await getDb().execute({ sql: 'SELECT * FROM clients WHERE id = ?', args: [id] });
  return r.rows[0] || null;
}

export async function createClient({ id, name, color }) {
  await getDb().execute({ sql: 'INSERT INTO clients (id, name, color) VALUES (?, ?, ?)', args: [id, name, color || '#4c6ef5'] });
  return getClient(id);
}

export async function updateClient(id, { name, color }) {
  await getDb().execute({ sql: "UPDATE clients SET name = ?, color = ?, updated_at = datetime('now') WHERE id = ?", args: [name, color, id] });
  return getClient(id);
}

export async function deleteClient(id) {
  const db = getDb();
  await db.execute({ sql: 'DELETE FROM clicks WHERE link_id IN (SELECT id FROM links WHERE client_id = ?)', args: [id] });
  await db.execute({ sql: 'DELETE FROM links WHERE client_id = ?', args: [id] });
  await db.execute({ sql: 'DELETE FROM clients WHERE id = ?', args: [id] });
}

// ─── Links ─────────────────────────────────────────────
export async function getAllLinks(clientId = null) {
  let sql = `SELECT l.*, c.name as client_name, c.color as client_color, COUNT(cl.id) as click_count
    FROM links l JOIN clients c ON c.id = l.client_id LEFT JOIN clicks cl ON cl.link_id = l.id`;
  const args = [];
  if (clientId) { sql += ' WHERE l.client_id = ?'; args.push(clientId); }
  sql += ' GROUP BY l.id ORDER BY l.created_at DESC';
  const r = await getDb().execute({ sql, args });
  return r.rows;
}

export async function getLink(id) {
  const r = await getDb().execute({
    sql: `SELECT l.*, c.name as client_name, c.color as client_color, COUNT(cl.id) as click_count
      FROM links l JOIN clients c ON c.id = l.client_id LEFT JOIN clicks cl ON cl.link_id = l.id
      WHERE l.id = ? GROUP BY l.id`,
    args: [id],
  });
  return r.rows[0] || null;
}

export async function getLinkByCode(code) {
  const r = await getDb().execute({ sql: 'SELECT * FROM links WHERE short_code = ? AND is_active = 1', args: [code] });
  return r.rows[0] || null;
}

export async function createLink(data) {
  await getDb().execute({
    sql: `INSERT INTO links (id, client_id, short_code, destination_url, utm_source, utm_medium, utm_campaign, utm_term, utm_content, label) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [data.id, data.client_id, data.short_code, data.destination_url, data.utm_source || '', data.utm_medium || '', data.utm_campaign || '', data.utm_term || '', data.utm_content || '', data.label || ''],
  });
  return getLink(data.id);
}

export async function updateLink(id, data) {
  await getDb().execute({
    sql: `UPDATE links SET destination_url = ?, utm_source = ?, utm_medium = ?, utm_campaign = ?, utm_term = ?, utm_content = ?, label = ?, is_active = ? WHERE id = ?`,
    args: [data.destination_url, data.utm_source || '', data.utm_medium || '', data.utm_campaign || '', data.utm_term || '', data.utm_content || '', data.label || '', data.is_active ?? 1, id],
  });
  return getLink(id);
}

export async function deleteLink(id) {
  const db = getDb();
  await db.execute({ sql: 'DELETE FROM clicks WHERE link_id = ?', args: [id] });
  await db.execute({ sql: 'DELETE FROM links WHERE id = ?', args: [id] });
}

// ─── Clicks ────────────────────────────────────────────
export async function recordClick(data) {
  await getDb().execute({
    sql: `INSERT INTO clicks (link_id, ip_address, user_agent, referer, country, device, browser, os) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [data.link_id, data.ip_address || '', data.user_agent || '', data.referer || '', data.country || '', data.device || '', data.browser || '', data.os || ''],
  });
}

export async function getClickStats(linkId) {
  const db = getDb();
  const [totalRes, byDayRes, byDeviceRes, byBrowserRes, byCountryRes, byRefererRes] = await Promise.all([
    db.execute({ sql: 'SELECT COUNT(*) as count FROM clicks WHERE link_id = ?', args: [linkId] }),
    db.execute({ sql: `SELECT DATE(clicked_at) as date, COUNT(*) as count FROM clicks WHERE link_id = ? GROUP BY DATE(clicked_at) ORDER BY date DESC LIMIT 30`, args: [linkId] }),
    db.execute({ sql: `SELECT device, COUNT(*) as count FROM clicks WHERE link_id = ? GROUP BY device ORDER BY count DESC`, args: [linkId] }),
    db.execute({ sql: `SELECT browser, COUNT(*) as count FROM clicks WHERE link_id = ? GROUP BY browser ORDER BY count DESC`, args: [linkId] }),
    db.execute({ sql: `SELECT country, COUNT(*) as count FROM clicks WHERE link_id = ? GROUP BY country ORDER BY count DESC`, args: [linkId] }),
    db.execute({ sql: `SELECT referer, COUNT(*) as count FROM clicks WHERE link_id = ? AND referer != '' GROUP BY referer ORDER BY count DESC LIMIT 10`, args: [linkId] }),
  ]);
  return {
    total: totalRes.rows[0]?.count ?? 0,
    byDay: byDayRes.rows,
    byDevice: byDeviceRes.rows,
    byBrowser: byBrowserRes.rows,
    byCountry: byCountryRes.rows,
    byReferer: byRefererRes.rows,
  };
}

export async function getClientStats(clientId) {
  const db = getDb();
  const [totalRes, byDayRes, topLinksRes] = await Promise.all([
    db.execute({ sql: `SELECT COUNT(cl.id) as count FROM clicks cl JOIN links l ON l.id = cl.link_id WHERE l.client_id = ?`, args: [clientId] }),
    db.execute({ sql: `SELECT DATE(cl.clicked_at) as date, COUNT(*) as count FROM clicks cl JOIN links l ON l.id = cl.link_id WHERE l.client_id = ? GROUP BY DATE(cl.clicked_at) ORDER BY date DESC LIMIT 30`, args: [clientId] }),
    db.execute({ sql: `SELECT l.id, l.label, l.utm_campaign, l.destination_url, COUNT(cl.id) as click_count FROM links l LEFT JOIN clicks cl ON cl.link_id = l.id WHERE l.client_id = ? GROUP BY l.id ORDER BY click_count DESC LIMIT 10`, args: [clientId] }),
  ]);
  return {
    totalClicks: totalRes.rows[0]?.count ?? 0,
    clicksByDay: byDayRes.rows,
    topLinks: topLinksRes.rows,
  };
}

export async function getDashboardStats() {
  const db = getDb();
  const [totalsRes, recentRes, topClientsRes] = await Promise.all([
    db.execute(`SELECT (SELECT COUNT(*) FROM clients) as total_clients, (SELECT COUNT(*) FROM links) as total_links, (SELECT COUNT(*) FROM clicks) as total_clicks, (SELECT COUNT(*) FROM clicks WHERE clicked_at >= datetime('now', '-1 day')) as clicks_today`),
    db.execute(`SELECT DATE(clicked_at) as date, COUNT(*) as count FROM clicks GROUP BY DATE(clicked_at) ORDER BY date DESC LIMIT 14`),
    db.execute(`SELECT c.id, c.name, c.color, COUNT(cl.id) as click_count FROM clients c LEFT JOIN links l ON l.client_id = c.id LEFT JOIN clicks cl ON cl.link_id = l.id GROUP BY c.id ORDER BY click_count DESC LIMIT 5`),
  ]);
  const t = totalsRes.rows[0] || {};
  return {
    total_clients: Number(t.total_clients ?? 0),
    total_links: Number(t.total_links ?? 0),
    total_clicks: Number(t.total_clicks ?? 0),
    clicks_today: Number(t.clicks_today ?? 0),
    recentClicks: recentRes.rows,
    topClients: topClientsRes.rows,
  };
}

// ─── Users ─────────────────────────────────────────────
let usersTableReady = null;

async function ensureUsersTable() {
  if (!usersTableReady) {
    usersTableReady = getDb().execute(`
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
      )
    `).catch(e => { console.error('Users table init failed:', e.message); usersTableReady = null; });
  }
  return usersTableReady;
}

export async function getUserByUsername(username) {
  await ensureUsersTable();
  const r = await getDb().execute({ sql: 'SELECT * FROM users WHERE username = ?', args: [username] });
  return r.rows[0] || null;
}

export async function getUserByEmail(email) {
  await ensureUsersTable();
  const r = await getDb().execute({ sql: 'SELECT * FROM users WHERE email = ?', args: [email] });
  return r.rows[0] || null;
}

export async function getUserById(id) {
  await ensureUsersTable();
  const r = await getDb().execute({ sql: 'SELECT id, username, email, name, surname, area, role, is_active, created_at FROM users WHERE id = ?', args: [id] });
  return r.rows[0] || null;
}

export async function createUser({ id, username, email, password_hash, name, surname, area, role }) {
  await ensureUsersTable();
  await getDb().execute({
    sql: 'INSERT INTO users (id, username, email, password_hash, name, surname, area, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    args: [id, username, email || '', password_hash, name || '', surname || '', area || '', role || 'agent'],
  });
  return getUserById(id);
}

export async function getAllUsers() {
  await ensureUsersTable();
  const r = await getDb().execute('SELECT id, username, email, name, surname, area, role, is_active, created_at FROM users ORDER BY created_at DESC');
  return r.rows;
}

export async function updateUserStatus(id, isActive) {
  await ensureUsersTable();
  await getDb().execute({ sql: 'UPDATE users SET is_active = ? WHERE id = ?', args: [isActive ? 1 : 0, id] });
}

export async function deleteUser(id) {
  await ensureUsersTable();
  await getDb().execute({ sql: 'DELETE FROM users WHERE id = ?', args: [id] });
}

// Dashboard stats per agent
export async function getAgentStats(userId) {
  const db = getDb();
  const [totalsRes, recentRes, topLinksRes] = await Promise.all([
    db.execute(`SELECT (SELECT COUNT(*) FROM clients) as total_clients, (SELECT COUNT(*) FROM links) as total_links, (SELECT COUNT(*) FROM clicks) as total_clicks, (SELECT COUNT(*) FROM clicks WHERE clicked_at >= datetime('now', '-1 day')) as clicks_today, (SELECT COUNT(*) FROM clicks WHERE clicked_at >= datetime('now', '-7 days')) as clicks_week`),
    db.execute(`SELECT DATE(clicked_at) as date, COUNT(*) as count FROM clicks GROUP BY DATE(clicked_at) ORDER BY date DESC LIMIT 30`),
    db.execute(`SELECT l.id, l.label, l.utm_campaign, l.utm_source, l.utm_medium, l.destination_url, c.name as client_name, c.color as client_color, COUNT(cl.id) as click_count FROM links l LEFT JOIN clicks cl ON cl.link_id = l.id JOIN clients c ON c.id = l.client_id GROUP BY l.id ORDER BY click_count DESC LIMIT 10`),
  ]);
  const t = totalsRes.rows[0] || {};
  return {
    total_clients: Number(t.total_clients ?? 0),
    total_links: Number(t.total_links ?? 0),
    total_clicks: Number(t.total_clicks ?? 0),
    clicks_today: Number(t.clicks_today ?? 0),
    clicks_week: Number(t.clicks_week ?? 0),
    recentClicks: recentRes.rows,
    topLinks: topLinksRes.rows,
  };
}

