import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const convocatorias = await prisma.convocatoria.findMany({
    include: {
      solicitudes: true
    }
  });

  const data = convocatorias.map((c) => {
    const total = c.solicitudes.reduce((acc, s) => acc + s.puntuacionTotal, 0);
    const media = c.solicitudes.length ? total / c.solicitudes.length : 0;
    return {
      id: c.id,
      titulo: c.titulo,
      estado: c.solicitudes.some((s) => s.estado === 'EVALUADA') ? 'En evaluación' : 'Abierta',
      solicitudes: c.solicitudes.length,
      media
    };
  });

  return NextResponse.json(data);
}
