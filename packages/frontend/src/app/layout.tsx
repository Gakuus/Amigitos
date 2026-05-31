import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Amigitos - Mascotas Virtuales en Pareja',
  description: 'Adopta y cuida mascotas virtuales con tu pareja o amigos',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-900 text-slate-100">
        {children}
      </body>
    </html>
  );
}
