import { NextResponse } from 'next/server';
import { getSessionCookie } from '@/lib/auth';

export async function POST() {
  const cookie = getSessionCookie();
  const response = NextResponse.json({ success: true });
  response.cookies.set(cookie.name, '', { ...cookie.options, maxAge: 0 });
  return response;
}
