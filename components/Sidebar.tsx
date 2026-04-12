'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', section: null },
  { label: 'Inventario', href: '/dashboard/inventario', section: 'Operaciones' },
  { label: 'Producción', href: '/dashboard/produccion', section: null },
  { label: 'Punto de Venta', href: '/dashboard/ventas', section: null },
  { label: 'Proveedores', href: '/dashboard/proveedores', section: 'Administración' },
  { label: 'Empleados', href: '/dashboard/empleados', section: null },
  { label: 'Finanzas', href: '/dashboard/finanzas', section: null },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside style={{ width: '210px', flexShrink: 0, background: 'var(--amz-brown)', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', left: 0, top: 0 }}>
      <div style={{ padding: '24px 20px 20px', borderBottom: '0.5px solid rgba(232,213,181,0.12)' }}>
        <div style={{ fontSize: '22px', color: '#E8D5B5', fontWeight: '400', letterSpacing: '-0.3px', fontFamily: 'Georgia, serif' }}>Amarza</div>
        <div style={{ fontSize: '9px', letterSpacing: '1.6px', textTransform: 'uppercase', color: 'rgba(232,213,181,0.35)', marginTop: '3px' }}>Artisan Bakery · ERP</div>
      </div>
      <nav style={{ padding: '16px 10px', flex: 1, overflowY: 'auto' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <div key={item.href}>
              {item.section && (
                <div style={{ fontSize: '9px', letterSpacing: '1.2px', textTransform: 'uppercase', color: 'rgba(232,213,181,0.25)', padding: '12px 8px 5px' }}>{item.section}</div>
              )}
              <Link href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '8px 10px', borderRadius: '8px', fontSize: '13px', color: isActive ? '#E8D5B5' : 'rgba(232,213,181,0.5)', background: isActive ? 'rgba(232,213,181,0.1)' : 'transparent', fontWeight: isActive ? '500' : '400', marginBottom: '1px', cursor: 'pointer' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: isActive ? '#E8D5B5' : 'rgba(232,213,181,0.2)', flexShrink: 0 }} />
                  {item.label}
                </div>
              </Link>
            </div>
          )
        })}
      </nav>
      <div style={{ padding: '14px 10px', borderTop: '0.5px solid rgba(232,213,181,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '7px 10px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(232,213,181,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '500', color: '#E8D5B5', flexShrink: 0 }}>JD</div>
          <div>
            <div style={{ fontSize: '11.5px', color: 'rgba(232,213,181,0.75)', fontWeight: '500' }}>José Ignacio Bernal</div>
            <div style={{ fontSize: '10px', color: 'rgba(232,213,181,0.3)' }}>Propietario</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
