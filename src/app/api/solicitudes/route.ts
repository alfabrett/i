import { prisma } from '@/lib/prisma';
import { saveBase64File } from '@/lib/storage';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const memoriaPath = body.memoriaPDFBase64 ? await saveBase64File(body.memoriaPDFBase64, 'memoria.pdf') : null;

  const solicitud = await prisma.solicitud.create({
    data: {
      convocatoriaId: body.convocatoriaId,
      nombreEntidad: body.nombreEntidad,
      memoriaPDF: memoriaPath
    }
  });

  return NextResponse.json(solicitud);
}
