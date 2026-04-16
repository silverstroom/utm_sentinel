import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('utm_session')?.value;
    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    return NextResponse.json({ user: session });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
