import { supabase } from '@/lib/supabase'

async function getDashboardData() {
  const today = new Date().toISOString().split('T')[0]
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const [ventasHoy, ventasSemana, insumosStock, produccionHoy] = await Promise.all([
    supabase.from('ventas').select('total').eq('fecha', today),
    supabase.from('ventas').select('total, fecha').gte('fecha', weekAgo),
    supabase.from('insumos').select('id, nombre, stock_actual, stock_minimo').eq('activo', true),
    supabase.from('produccion').select('*, productos(nombre)').eq('fecha', today),
  ])

  const totalHoy = ventasHoy.data?.reduce((s, v) => s + Number(v.total), 0) ?? 0
  const totalSemana = ventasSemana.data?.reduce((s, v) => s + Number(v.total), 0) ?? 0
  const criticos = insumosStock.data?.filter(i => Number(i.stock_actual) <= Number(i.stock_minimo)) ?? []

  return { totalHoy, totalSemana, criticos, produccionHoy: produccionHoy.data ?? [] }
}

function getDia() {
  const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
  const d = new Date()
  return `${dias[d.getDay()]}, ${d.getDate()} de ${meses[d.getMonth()]} ${d.getFullYear()}`
}

export default async function DashboardPage() {
  const { totalHoy, totalSemana, criticos, produccionHoy } = await getDashboardData()

  const kpis = [
    { label: 'Ventas hoy', value: `$${totalHoy.toFixed(2)}`, note: 'Registradas hoy', color: '#A07840' },
    { label: 'Ventas semana', value: `$${totalSemana.toFixed(2)}`, note: 'Últimos 7 días', color: '#3D2B00' },
    { label: 'Alertas inventario', value: `${criticos.length}`, note: criticos.length > 0 ? 'Requieren atención' : 'Todo en orden', color: criticos.length > 0 ? '#8B2020' : '#3B5C1A' },
    { label: 'Producción hoy', value: `${produccionHoy.length}`, note: 'Productos registrados', color: '#3B5C1A' },
  ]

  const border = '0.5px solid rgba(61,43,0,0.07)'
  const surface = '#FAFAFA'

  return (
    <div>
      <div style={{ padding: '20px 28px', background: '#fff', borderBottom: border, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '17px', fontWeight: '500', color: '#3D2B00' }}>Buenos días, José</div>
          <div style={{ fontSize: '12px', color: 'rgba(61,43,0,0.4)', marginTop: '2px' }}>{getDia()}</div>
        </div>
        {criticos.length > 0 && (
          <div style={{ background: '#8B2020', color: '#fff', fontSize: '12px', padding: '6px 14px', borderRadius: '20px', fontWeight: '500' }}>
            {criticos.length} alerta{criticos.length > 1 ? 's' : ''} de inventario
          </div>
        )}
      </div>

      <div style={{ padding: '24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {kpis.map((k) => (
            <div key={k.label} style={{ background: surface, border, borderRadius: '12px', padding: '18px 20px', borderTop: `3px solid ${k.color}` }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.7px', textTransform: 'uppercase', color: 'rgba(61,43,0,0.4)', marginBottom: '8px' }}>{k.label}</div>
              <div style={{ fontSize: '26px', fontWeight: '500', color: '#3D2B00', lineHeight: 1 }}>{k.value}</div>
              <div style={{ fontSize: '11px', color: 'rgba(61,43,0,0.4)', marginTop: '6px' }}>{k.note}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ background: '#fff', border, borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: '500', color: '#3D2B00', marginBottom: '4px' }}>Alertas de inventario</div>
            <div style={{ fontSize: '11px', color: 'rgba(61,43,0,0.4)', marginBottom: '16px' }}>Insumos por debajo del mínimo</div>
            {criticos.length === 0 ? (
              <div style={{ fontSize: '13px', color: '#3B5C1A', padding: '12px 0' }}>✓ Todos los insumos están en orden</div>
            ) : (
              criticos.slice(0, 6).map((ins: any) => (
                <div key={ins.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: border }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: Number(ins.stock_actual) === 0 ? '#8B2020' : '#A07840', flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', color: '#3D2B00' }}>{ins.nombre}</span>
                  </div>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: Number(ins.stock_actual) === 0 ? 'rgba(139,32,32,0.08)' : 'rgba(160,120,64,0.1)', color: Number(ins.stock_actual) === 0 ? '#8B2020' : '#7A5820' }}>
                    {Number(ins.stock_actual) === 0 ? 'Agotado' : 'Bajo'}
                  </span>
                </div>
              ))
            )}
          </div>

          <div style={{ background: '#fff', border, borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: '500', color: '#3D2B00', marginBottom: '4px' }}>Producción de hoy</div>
            <div style={{ fontSize: '11px', color: 'rgba(61,43,0,0.4)', marginBottom: '16px' }}>Productos registrados hoy</div>
            {produccionHoy.length === 0 ? (
              <div style={{ fontSize: '13px', color: 'rgba(61,43,0,0.4)', padding: '12px 0' }}>Sin producción registrada hoy</div>
            ) : (
              produccionHoy.slice(0, 6).map((p: any) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: border }}>
                  <span style={{ fontSize: '13px', color: '#3D2B00' }}>{p.productos?.nombre}</span>
                  <span style={{ fontSize: '12px', color: 'rgba(61,43,0,0.4)' }}>{p.cantidad_producida} uds</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
