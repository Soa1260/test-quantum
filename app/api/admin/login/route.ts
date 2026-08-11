import { NextRequest, NextResponse } from 'next/server';
import { prisma, isMock } from '@/lib/db';
import bcrypt from 'bcrypt';
import { createSessionToken } from '@/lib/session';
import { isAllowed } from '@/lib/rateLimit';

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

    // Auto-seed admin user for live databases if they are empty
    if (!isMock) {
      try {
        const adminCount = await prisma.admin.count();
        if (adminCount === 0) {
          const adminPassword = process.env.ADMIN_PASSWORD;
          if (!adminPassword) {
            console.warn(
              'WARNING: Admin table is empty, but ADMIN_PASSWORD environment variable is not set. Skipping admin account auto-seeding.'
            );
          } else {
            const defaultHashedPassword = await bcrypt.hash(adminPassword, 10);
            await prisma.admin.create({
              data: {
                username: 'admin',
                password: defaultHashedPassword,
              },
            });
            console.log('Successfully auto-seeded admin user in live database using ADMIN_PASSWORD.');
          }
        }
      } catch (seedErr) {
        console.error('Auto-seeding check error:', seedErr);
      }
    }

    // Lookup user in DB/mock database using parameters
    const adminUser = await prisma.admin.findUnique({
      where: { username },
    });

    if (!adminUser) {
      // Avoid verbose errors: generic failure message to prevent username harvesting
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Verify hash with bcrypt
    const match = await bcrypt.compare(password, adminUser.password);
    if (!match) {
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
