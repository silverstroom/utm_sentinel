import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('utm_session')?.value;

  // Public routes that don't need auth
  const publicPaths = ['/', '/login', '/register', '/api/auth'];
  const isPublic = publicPaths.some(p => pathname === p || pathname.startsWith(p));

  // Allow redirect routes
  if (pathname.startsWith('/r/')) return NextResponse.next();

  // Allow public paths
  if (isPublic) {
    // If logged in and trying to access login/register, redirect to dashboard
    if (session && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protected routes — redirect to login if no session
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/(?!auth)).*)',
  ],
};
