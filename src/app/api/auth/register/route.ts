import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const existing = await prisma.user.findUnique({ where: { email: body.email } });
  if (existing) return NextResponse.json({ error: 'Email ya registrado' }, { status: 400 });

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      passwordHash: await hash(body.password, 10),
      role: body.role === 'ADMIN' ? 'ADMIN' : 'EVALUADOR'
    }
  });

  return NextResponse.json({ id: user.id, email: user.email });
}
