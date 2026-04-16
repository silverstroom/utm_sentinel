import { NextResponse } from 'next/server';
import { getUserByUsername, getUserByEmail, createUser } from '@/lib/db';
import { hashPassword, createSessionToken, getSessionCookie } from '@/lib/auth';
import { generateId } from '@/lib/utils';

export async function POST(request) {
  try {
    const { name, surname, area, email, username, password } = await request.json();

    if (!name || !surname || !email || !username || !password) {
      return NextResponse.json({ error: 'Tutti i campi sono obbligatori' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'La password deve avere almeno 6 caratteri' }, { status: 400 });
    }

    if (username === 'admin') {
      return NextResponse.json({ error: 'Username non disponibile' }, { status: 400 });
    }

    const existingUsername = await getUserByUsername(username);
    if (existingUsername) {
      return NextResponse.json({ error: 'Username già in uso' }, { status: 400 });
    }

    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      return NextResponse.json({ error: 'Email già registrata' }, { status: 400 });
    }

    const password_hash = hashPassword(password);
    const user = await createUser({
      id: generateId(),
      username,
      email,
      password_hash,
      name,
      surname,
      area,
      role: 'agent',
    });

    const token = createSessionToken(user);
    const cookie = getSessionCookie();

    const response = NextResponse.json({
      user: { id: user.id, username: user.username, name: user.name, surname: user.surname, role: user.role },
    });

    response.cookies.set(cookie.name, token, cookie.options);
    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}
