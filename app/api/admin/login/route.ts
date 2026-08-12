import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { createSessionToken } from '@/lib/session';
import { isAllowed } from '@/lib/rateLimit';

function secureCompare(a: string, b: string): boolean {
  const aHash = crypto.createHash('sha256').update(a).digest();
  const bHash = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(aHash, bHash);
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

    // In-memory IP rate-limiting: Max 5 attempts per minute
    if (!isAllowed(ip, 'login')) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json(
        { error: 'Admin authentication is not configured on the server.' },
        { status: 500 }
      );
    }

    let isAuthenticated = false;

    // 1. Direct environment password check for username 'admin'
    if (username === 'admin') {
      if (secureCompare(password, adminPassword)) {
        isAuthenticated = true;
      }
    }

    // 2. Optional DB lookup fallback if not authenticated yet, with no automatic seeding
    if (!isAuthenticated) {
      const dbUser = await prisma.admin.findUnique({
        where: { username },
      });
      if (dbUser) {
        isAuthenticated = await bcrypt.compare(password, dbUser.password);
      }
    }

    if (!isAuthenticated) {
      // Avoid verbose errors: generic failure message to prevent username harvesting
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Successful authentication: Create dynamic, cryptographically signed session token
    const token = createSessionToken(username);

    const response = NextResponse.json({ success: true, message: 'Authentication successful' });

    // Cookie valid for 2 hours
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7200, // 2 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
