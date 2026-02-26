import { extractCriterios } from '@/lib/ai';
import { prisma } from '@/lib/prisma';
import { extractTextFromPDF } from '@/lib/pdfExtractor';
import { saveBase64File } from '@/lib/storage';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const pdfPath = await saveBase64File(body.criteriosPDFBase64, 'criterios.pdf');
  const text = await extractTextFromPDF(pdfPath);
  const criterios = await extractCriterios(text);

  await prisma.$transaction([
    prisma.convocatoria.update({ where: { id: params.id }, data: { criteriosPDF: pdfPath } }),
    prisma.criterio.deleteMany({ where: { convocatoriaId: params.id } }),
    prisma.criterio.createMany({
      data: criterios.map((c) => ({
        convocatoriaId: params.id,
        nombre: c.nombre,
        descripcion: c.descripcion,
        puntuacionMaxima: c.puntuacionMaxima
      }))
    })
  ]);

  return NextResponse.json({ criterios });
}
