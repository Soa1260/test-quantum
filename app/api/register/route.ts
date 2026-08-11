import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Lightweight, robust HTML-escaping utility to prevent XSS (Cross-Site Scripting)
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Destructure & validation
    let { name, email, institution, role } = body;

    if (!name || !email || !institution || !role) {
      return NextResponse.json(
        { error: 'All fields (Name, Email, Institution, Role) are strictly required.' },
        { status: 400 }
      );
    }

    // Trim inputs
    name = name.trim();
    email = email.trim().toLowerCase();
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

    // Sanitize user-rendered inputs to protect against XSS (no complex parsing overhead needed)
    name = escapeHtml(name);
    email = escapeHtml(email);
    institution = escapeHtml(institution);

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
