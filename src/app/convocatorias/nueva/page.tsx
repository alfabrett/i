'use client';

import { useState } from 'react';

async function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function NuevaConvocatoriaPage() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [bases, setBases] = useState<File | null>(null);

  const submit = async () => {
    const basesPDFBase64 = bases ? await toBase64(bases) : null;
    const res = await fetch('/api/convocatorias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, descripcion, basesPDFBase64 })
    });

    const data = await res.json();
    alert(`Convocatoria creada: ${data.convocatoria?.id ?? 'error'}`);
  };

  return (
    <div className="card max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold">Crear convocatoria</h1>
      <input className="input" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
      <textarea className="input" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
      <input type="file" accept="application/pdf" onChange={(e) => setBases(e.target.files?.[0] ?? null)} />
      <button className="btn" onClick={submit}>Guardar convocatoria</button>
    </div>
  );
}
