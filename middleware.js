import { NextResponse } from 'next/server';

const ADMIN_PATHS = ['/admin'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const needsAuth = ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
  if (!needsAuth) return NextResponse.next();

  const auth = request.headers.get('authorization');
  const USER = process.env.ADMIN_USER || '';
  const PASS = process.env.ADMIN_PASS || '';

  if (!auth || !auth.startsWith('Basic ')) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="SpoilerShelf Admin"' },
    });
  }
  try {
    const base64 = auth.split(' ')[1];
    const [user, pass] = atob(base64).split(':');
    if (user === USER && pass === PASS) {
      return NextResponse.next();
    }
  } catch {}

  return new NextResponse('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="SpoilerShelf Admin"' },
  });
}

export const config = {
  matcher: ['/admin/:path*'],
};

