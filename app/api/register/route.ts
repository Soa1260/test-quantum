import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAllowed } from '@/lib/rateLimit';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Regex for phone numbers: Allows optional leading +, digits, spaces, parentheses, hyphens
const phoneRegex = /^\+?[0-9\s\-\(\)]+$/;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

    // In-memory IP rate-limiting: Max 10 registrations per hour
    if (!isAllowed(ip, 'register')) {
      return NextResponse.json(
        { error: 'Too many registration requests from this IP. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 1. Destructure & validation
    let { name, email, phone, institution, role } = body;

    if (!name || !email || !phone || !institution || !role) {
      return NextResponse.json(
        { error: 'All fields (Name, Email, Phone, Institution, Role) are strictly required.' },
        { status: 400 }
      );
    }

    // Trim inputs (store raw values to prevent double-escaping; React escapes on render)
    name = name.trim();
    email = email.trim().toLowerCase();
    phone = phone.trim();
    institution = institution.trim();
    role = role.trim().toLowerCase();

    // 2. Strict Input validation
    if (name.length < 2 || name.length > 80) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 80 characters.' },
        { status: 400 }
      );
    }

    if (!emailRegex.test(email) || email.length > 100) {
      return NextResponse.json(
        { error: 'Please provide a valid, secure email address.' },
        { status: 400 }
      );
    }

    if (!phoneRegex.test(phone) || phone.length < 5 || phone.length > 20) {
      return NextResponse.json(
        { error: 'Please provide a valid phone number (between 5 and 20 digits).' },
        { status: 400 }
      );
    }

    if (institution.length < 2 || institution.length > 120) {
      return NextResponse.json(
        { error: 'Institution/University/School name must be between 2 and 120 characters.' },
        { status: 400 }
      );
    }

    const validRoles = ['student', 'professor', 'interested'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid selection. Choose either Student, Professor, or Interested in Quantum Tech.' },
        { status: 400 }
      );
    }

    // 3. Database operation with SQL Injection prevention using Prisma ORM parameterized queries
    const existing = await prisma.registration.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'This email address is already registered for the event.' },
        { status: 400 }
      );
    }

    const newRegistration = await prisma.registration.create({
      data: {
        name,
        email,
        phone,
        institution,
        role,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully registered for the Quantum Tech Event!',
        registration: {
          id: newRegistration.id,
          name: newRegistration.name,
          email: newRegistration.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration processing error:', error);
    // Secure safe production headers error message
    return NextResponse.json(
      { error: 'An error occurred while finalizing your registration. Please try again.' },
      { status: 500 }
    );
  }
}
