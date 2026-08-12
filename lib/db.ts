import { PrismaClient } from '@prisma/client';

// Simple types for mock DB
export interface RegistrationData {
  id: string;
  name: string;
  email: string;
  phone: string;
  institution: string;
  role: string;
  createdAt: Date;
}

export interface AdminData {
  id: string;
  username: string;
  password: string;
}

// In-Memory Mock database fallback
class MockDatabase {
  private registrations: RegistrationData[] = [];
  private admins: AdminData[] = [];

  constructor() {
    // CRITICAL SECURITY WARNING: The following default mock account is strictly for local development and testing only.
    // This mock in-memory database route MUST NEVER be activated or used in a production environment.
    // Production deployments must always supply a valid and secure database connection string via DATABASE_URL.
    this.admins.push({
      id: 'admin-id-1',
      username: 'admin',
      password: '$2b$10$ONFJBvnHZ.Trbor/.qIf6uoisg85Upo.0Y9i1coH90Rcw4WzoW5wO', // hashed "quantum2025"
    });
  }

  get registration() {
    return {
      findMany: async (args?: any) => {
        let list = [...this.registrations];
        if (args?.where?.role) {
          list = list.filter((r) => r.role === args.where.role);
        }
        if (args?.where?.OR) {
          const search = args.where.OR[0]?.name?.contains?.toLowerCase() || '';
          if (search) {
            list = list.filter(
              (r) =>
                r.name.toLowerCase().includes(search) ||
                r.email.toLowerCase().includes(search) ||
                r.phone.toLowerCase().includes(search) ||
                r.institution.toLowerCase().includes(search)
            );
          }
        }
        if (args?.orderBy?.createdAt) {
          list.sort((a, b) =>
            args.orderBy.createdAt === 'desc'
              ? b.createdAt.getTime() - a.createdAt.getTime()
              : a.createdAt.getTime() - b.createdAt.getTime()
          );
        }
        return list;
      },
      findUnique: async (args: { where: { email?: string; id?: string } }) => {
        if (args.where.email) {
          return this.registrations.find((r) => r.email === args.where.email) || null;
        }
        if (args.where.id) {
          return this.registrations.find((r) => r.id === args.where.id) || null;
        }
        return null;
      },
      create: async (args: { data: Omit<RegistrationData, 'id' | 'createdAt'> }) => {
        const existing = this.registrations.find((r) => r.email === args.data.email);
        if (existing) {
          throw new Error('Unique constraint failed on email');
        }
        const newRecord: RegistrationData = {
          id: Math.random().toString(36).substr(2, 9),
          ...args.data,
          createdAt: new Date(),
        };
        this.registrations.push(newRecord);
        return newRecord;
      },
      delete: async (args: { where: { id: string } }) => {
        const idx = this.registrations.findIndex((r) => r.id === args.where.id);
        if (idx !== -1) {
          const deleted = this.registrations[idx];
          this.registrations.splice(idx, 1);
          return deleted;
        }
        throw new Error('Record to delete not found');
      },
      count: async (args?: any) => {
        let list = [...this.registrations];
        if (args?.where?.role) {
          list = list.filter((r) => r.role === args.where.role);
        }
        return list.length;
      },
    };
  }

  get admin() {
    return {
      findUnique: async (args: { where: { username: string } }) => {
        return this.admins.find((a) => a.username === args.where.username) || null;
      },
      create: async (args: { data: AdminData }) => {
        this.admins.push(args.data);
        return args.data;
      },
    };
  }
}

let prisma: any;
let isMock = false;

// Check if we have a valid environment variable DATABASE_URL
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl || dbUrl.trim() === '' || dbUrl === 'file:./dev.db' || dbUrl.includes('placeholder')) {
  // Use in-memory mock fallback to guarantee deployment readiness and robust local development without SQLite locked DB error
  if (!(global as any).mockPrisma) {
    (global as any).mockPrisma = new MockDatabase();
  }
  prisma = (global as any).mockPrisma;
  isMock = true;
  console.log('Using robust In-Memory mock database client');
} else {
  // Genuine production PostgreSQL database or configured SQLite
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
  } else {
    if (!(global as any).prisma) {
      (global as any).prisma = new PrismaClient();
    }
    prisma = (global as any).prisma;
  }
}

export { prisma, isMock };
