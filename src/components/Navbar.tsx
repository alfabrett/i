import Link from 'next/link';

export function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="text-lg font-semibold">Criteru</Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/convocatorias/nueva">Nueva convocatoria</Link>
          <Link href="/solicitudes/nueva">Nueva solicitud</Link>
        </nav>
      </div>
    </header>
  );
}
