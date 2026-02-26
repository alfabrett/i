'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = async () => {
    await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role: 'EVALUADOR' })
    });
    alert('Usuario creado');
  };

  return (
    <div className="card mx-auto max-w-md space-y-4">
      <h1 className="text-xl font-semibold">Registro</h1>
      <input className="input" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="btn w-full" onClick={register}>Crear cuenta</button>
    </div>
  );
}
