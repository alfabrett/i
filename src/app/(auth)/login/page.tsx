'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="card mx-auto max-w-md space-y-4">
      <h1 className="text-xl font-semibold">Iniciar sesión</h1>
      <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="btn w-full" onClick={() => signIn('credentials', { email, password, callbackUrl: '/dashboard' })}>Entrar</button>
    </div>
  );
}
