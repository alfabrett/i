'use client';

import { useEffect, useMemo, useState } from 'react';

export default function ConvocatoriaDetailPage({ params }: { params: { id: string } }) {
  const [convocatoria, setConvocatoria] = useState<any>(null);
  const [solicitudId, setSolicitudId] = useState('');

  useEffect(() => {
    fetch('/api/convocatorias').then((r) => r.json()).then((rows) => {
      const c = rows.find((item: any) => item.id === params.id);
      setConvocatoria(c);
      if (c?.solicitudes?.[0]) setSolicitudId(c.solicitudes[0].id);
    });
  }, [params.id]);

  const criterios = useMemo(() => convocatoria?.criterios ?? [], [convocatoria]);

  const puntuar = async (criterioId: string, puntuacion: number) => {
    if (!solicitudId) return;
    await fetch('/api/evaluaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ solicitudId, criterioId, puntuacion, comentario: 'Evaluación MVP' })
    });
    alert('Puntuación guardada');
  };

  const generarInforme = async () => {
    if (!solicitudId) return;
    const res = await fetch('/api/informes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ solicitudId })
    });
    const data = await res.json();
    alert(data.contenidoGenerado?.slice(0, 200) ?? 'Generado');
  };

  if (!convocatoria) return <p>Cargando...</p>;

  return (
    <section className="space-y-4">
      <div className="card">
        <h1 className="text-xl font-semibold">{convocatoria.titulo}</h1>
        <p className="text-slate-600">{convocatoria.descripcion}</p>
      </div>

      <div className="card">
        <h2 className="mb-3 font-semibold">Evaluación</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th>Criterio</th><th>Máxima</th><th>Asignar</th>
            </tr>
          </thead>
          <tbody>
            {criterios.map((c: any) => (
              <tr key={c.id} className="border-t">
                <td className="py-2">{c.nombre}</td>
                <td>{c.puntuacionMaxima}</td>
                <td>
                  <input className="input max-w-24" type="number" min="0" max={c.puntuacionMaxima}
                    onBlur={(e) => puntuar(c.id, Number(e.target.value))} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn mt-4" onClick={generarInforme}>Generar informe</button>
      </div>
    </section>
  );
}
