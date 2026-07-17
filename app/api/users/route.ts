import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        emailVerified: true
      }
    });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, password } = body;

    if (session.user.role !== 'admin' && session.user.id !== id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates: any = {};
    if (name) updates.name = name;
    if (password) {
        updates.password = await bcrypt.hash(password, 10);
    }

    try {
      const data = await prisma.users.update({
        where: { id },
        data: updates
      });
      
      return NextResponse.json([data]);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
