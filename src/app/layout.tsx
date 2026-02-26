import './globals.css';
import { Navbar } from '@/components/Navbar';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Criteru',
  description: 'Plataforma SaaS de evaluación de convocatorias'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main className="mx-auto max-w-6xl p-6">{children}</main>
      </body>
    </html>
  );
}
