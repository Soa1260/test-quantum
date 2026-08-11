import { NextRequest, NextResponse } from 'next/server';
import { prisma, isMock } from '@/lib/db';
import bcrypt from 'bcrypt';
import { createSessionToken } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Auto-seed admin user for live databases if they are empty
    if (!isMock) {
      try {
        const adminCount = await prisma.admin.count();
        if (adminCount === 0) {
          const defaultPassword = process.env.ADMIN_PASSWORD || 'quantum2025';
          const defaultHashedPassword = await bcrypt.hash(defaultPassword, 10);
          await prisma.admin.create({
            data: {
              username: 'admin',
              password: defaultHashedPassword,
            },
          });
          console.log('Successfully auto-seeded default admin user in live database.');
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
