import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Amarza ERP',
  description: 'Sistema de gestión Amarza Artisan Bakery',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
