import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthInit } from '@/components/auth/AuthInit';

export const metadata: Metadata = {
  title: 'Amigitos - Mascotas Virtuales',
  description: 'Adopta y cuida mascotas virtuales con tu pareja o amigos',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, title: 'Amigitos', statusBarStyle: 'black-translucent' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#a78bfa',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-dvh bg-pastel-cream dark:bg-slate-900 text-pastel-foreground dark:text-slate-100 overflow-x-hidden">
        <AuthInit>{children}</AuthInit>
      </body>
    </html>
  );
}
