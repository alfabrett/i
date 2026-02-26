import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.role) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const body = await request.json();

  await prisma.evaluacion.upsert({
    where: { solicitudId_criterioId: { solicitudId: body.solicitudId, criterioId: body.criterioId } },
    create: {
      solicitudId: body.solicitudId,
      criterioId: body.criterioId,
      puntuacion: body.puntuacion,
      comentario: body.comentario
    },
    update: {
      puntuacion: body.puntuacion,
      comentario: body.comentario
    }
  });

  const evaluaciones = await prisma.evaluacion.findMany({ where: { solicitudId: body.solicitudId } });
  const total = evaluaciones.reduce((acc, item) => acc + item.puntuacion, 0);

  await prisma.solicitud.update({ where: { id: body.solicitudId }, data: { puntuacionTotal: total, estado: 'EVALUADA' } });

  return NextResponse.json({ ok: true, puntuacionTotal: total });
}
