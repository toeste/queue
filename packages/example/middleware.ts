import { NextRequest } from 'next/server'
import queueRequests from '@tomoeste/queue';

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}

export async function middleware(request: NextRequest) {
  return queueRequests(request);
}
