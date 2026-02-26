'use client';

import { useEffect, useState } from 'react';

async function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function NuevaSolicitudPage() {
  const [convocatorias, setConvocatorias] = useState<any[]>([]);
  const [convocatoriaId, setConvocatoriaId] = useState('');
  const [nombreEntidad, setNombreEntidad] = useState('');
  const [memoria, setMemoria] = useState<File | null>(null);

  useEffect(() => {
    fetch('/api/convocatorias').then((r) => r.json()).then(setConvocatorias);
  }, []);

  const submit = async () => {
    const memoriaPDFBase64 = memoria ? await toBase64(memoria) : null;
    const res = await fetch('/api/solicitudes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ convocatoriaId, nombreEntidad, memoriaPDFBase64 })
    });
    const data = await res.json();
    alert(`Solicitud creada: ${data.id}`);
  };

  return (
    <div className="card max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold">Crear solicitud</h1>
      <select className="input" value={convocatoriaId} onChange={(e) => setConvocatoriaId(e.target.value)}>
        <option value="">Selecciona convocatoria</option>
        {convocatorias.map((c) => <option key={c.id} value={c.id}>{c.titulo}</option>)}
      </select>
      <input className="input" placeholder="Entidad" value={nombreEntidad} onChange={(e) => setNombreEntidad(e.target.value)} />
      <input type="file" accept="application/pdf" onChange={(e) => setMemoria(e.target.files?.[0] ?? null)} />
      <button className="btn" onClick={submit}>Guardar solicitud</button>
    </div>
  );
}
