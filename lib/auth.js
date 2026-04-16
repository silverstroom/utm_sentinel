import { createHash, randomBytes } from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'utm-tracker-secret-key-2026';

// ─── Password Hashing ──────────────────────────────────
export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256').update(password + salt).digest('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const computed = createHash('sha256').update(password + salt).digest('hex');
  return computed === hash;
}

// ─── Session Token ─────────────────────────────────────
export function createSessionToken(user) {
  const payload = JSON.stringify({
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name,
    surname: user.surname,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  const signature = createHash('sha256').update(payload + SESSION_SECRET).digest('hex');
  const token = Buffer.from(payload).toString('base64') + '.' + signature;
  return token;
}

export function verifySessionToken(token) {
  try {
    if (!token) return null;
    const [payloadB64, signature] = token.split('.');
    if (!payloadB64 || !signature) return null;

    const payload = Buffer.from(payloadB64, 'base64').toString();
    const expectedSig = createHash('sha256').update(payload + SESSION_SECRET).digest('hex');

    if (signature !== expectedSig) return null;

    const data = JSON.parse(payload);
    if (data.exp < Date.now()) return null;

    return data;
  } catch {
    return null;
  }
}

// ─── Cookie helpers ────────────────────────────────────
export function getSessionCookie() {
  return {
    name: 'utm_session',
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    },
  };
}
