import { extractBases } from '@/lib/ai';
import { prisma } from '@/lib/prisma';
import { extractTextFromPDF } from '@/lib/pdfExtractor';
import { saveBase64File } from '@/lib/storage';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const convocatorias = await prisma.convocatoria.findMany({
    include: { solicitudes: true, criterios: true },
    orderBy: { fechaCreacion: 'desc' }
  });
  return NextResponse.json(convocatorias);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const body = await request.json();
  let basesPath: string | undefined;
  let basesEstructuradas: unknown = null;

  if (body.basesPDFBase64) {
    basesPath = await saveBase64File(body.basesPDFBase64, 'bases.pdf');
    const text = await extractTextFromPDF(basesPath);
    basesEstructuradas = await extractBases(text);
  }

  const created = await prisma.convocatoria.create({
    data: {
      titulo: body.titulo,
      descripcion: body.descripcion,
      basesPDF: basesPath,
      creadaPorId: (session?.user as any)?.id
    }
  });

  return NextResponse.json({ convocatoria: created, basesEstructuradas });
}
