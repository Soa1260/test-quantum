import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifySessionToken } from '@/lib/session';

export async function GET(req: NextRequest) {
  try {
    // 1. Dynamic Cryptographically secure Auth check
    const sessionCookie = req.cookies.get('admin_session');
    const session = verifySessionToken(sessionCookie?.value);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access. Authentication required.' }, { status: 401 });
    }

    // 2. Fetch registrations securely
    const registrations = await prisma.registration.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error('Fetch registrations error:', error);
    return NextResponse.json({ error: 'An error occurred while fetching registrations.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // 1. Dynamic Cryptographically secure Auth check
    const sessionCookie = req.cookies.get('admin_session');
    const session = verifySessionToken(sessionCookie?.value);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Registration ID required' }, { status: 400 });
    }

    await prisma.registration.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Registration successfully deleted.' });
  } catch (error) {
    console.error('Delete registration error:', error);
    return NextResponse.json({ error: 'An error occurred while deleting the registration.' }, { status: 500 });
  }
}
