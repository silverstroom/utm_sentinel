import { NextResponse } from 'next/server';
import { getUserByUsername, createUser } from '@/lib/db';
import { hashPassword, verifyPassword, createSessionToken, getSessionCookie } from '@/lib/auth';
import { generateId } from '@/lib/utils';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Username e password obbligatori' }, { status: 400 });
    }

    // Check if admin exists, create if not (first run)
    let user = await getUserByUsername(username);

    if (!user && username === 'admin') {
      // Auto-create super admin on first login attempt
      const adminHash = hashPassword('admin2026_?');
      user = await createUser({
        id: generateId(),
        username: 'admin',
        email: 'admin@utmtracker.pro',
        password_hash: adminHash,
        name: 'Super',
        surname: 'Admin',
        area: '',
        role: 'admin',
      });
      // Now verify against the newly created user
    }

    if (!user) {
      return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 });
    }

    if (!user.is_active) {
      return NextResponse.json({ error: 'Account disattivato. Contatta l\'amministratore.' }, { status: 403 });
    }

    if (!verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 });
    }

    const token = createSessionToken(user);
    const cookie = getSessionCookie();

    const response = NextResponse.json({
      user: { id: user.id, username: user.username, name: user.name, surname: user.surname, role: user.role },
    });

    response.cookies.set(cookie.name, token, cookie.options);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}
