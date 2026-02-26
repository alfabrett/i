import { generateInforme } from '@/lib/ai';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const solicitud = await prisma.solicitud.findUnique({
    where: { id: body.solicitudId },
    include: {
      convocatoria: { include: { criterios: true } },
      evaluaciones: { include: { criterio: true } }
    }
  });

  if (!solicitud) return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });

  const contenido = await generateInforme({
    entidad: solicitud.nombreEntidad,
    convocatoria: solicitud.convocatoria.titulo,
    criterios: solicitud.evaluaciones.map((ev) => ({
      nombre: ev.criterio.nombre,
      max: ev.criterio.puntuacionMaxima,
      puntuacion: ev.puntuacion,
      comentario: ev.comentario
    }))
  });

  const informe = await prisma.informe.upsert({
    where: { solicitudId: solicitud.id },
    create: { solicitudId: solicitud.id, contenidoGenerado: contenido },
    update: { contenidoGenerado: contenido, fecha: new Date() }
  });

  return NextResponse.json(informe);
}
