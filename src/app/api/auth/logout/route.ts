import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function GET(request: Request) {
  await clearSessionCookie();
  return NextResponse.redirect(new URL('/login', request.url));
}

export async function POST(request: Request) {
  await clearSessionCookie();

  const acceptHeader = request.headers.get('accept') || '';
  const contentType = request.headers.get('content-type') || '';

  // If request is from an HTML form submission or browser navigation, redirect to /login
  if (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data') ||
    acceptHeader.includes('text/html')
  ) {
    return NextResponse.redirect(new URL('/login', request.url), 303);
  }

  return NextResponse.json({ success: true, message: 'تم تسجيل الخروج بنجاح.' });
}
