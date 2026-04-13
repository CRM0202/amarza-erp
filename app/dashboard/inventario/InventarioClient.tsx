'use client'

import { useState } from 'react'

function Pill({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; color: string; label: string }> = {
    crit: { bg: 'rgba(139,32,32,0.1)', color: '#8B2020', label: 'Crítico' },
    agotado: { bg: 'rgba(139,32,32,0.15)', color: '#8B2020', label: 'Agotado' },
    low: { bg: 'rgba(160,120,64,0.12)', color: '#7A5820', label: 'Bajo' },
    ok: { bg: 'rgba(59,92,26,0.1)', color: '#3B5C1A', label: 'OK' },
  }
  const c = cfg[status] ?? cfg.ok
  return <span style={{ fontSize: '11px', padding: '3px 9px', borderRadius: '20px', background: c.bg, color: c.color, fontWeight: '500' }}>{c.label}</span>
}

function getStatus(stock: number, min: number) {
  if (stock === 0) return 'agotado'
  if (stock <= min) return 'crit'
  if (stock <= min * 1.5) return 'low'
  return 'ok'
}

export default function InventarioClient({ insumos, proveedores, stats }: any) {
  const [filtro, setFiltro] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ insumo_id: '', cantidad: '', precio: '', proveedor_id: '', fecha_vencimiento: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const filtros = [
    { key: 'todos', label: 'Todos' },
    { key: 'agotado', label: 'Agotados' },
    { key: 'crit', label: 'Críticos' },
    { key: 'panaderia', label: 'Panadería' },
    { key: 'cafe', label: 'Café' },
    { key: 'empaque', label: 'Empaque' },
  ]

  const filtered = insumos.filter((i: any) => {
    const st = getStatus(Number(i.stock_actual), Number(i.stock_minimo))
    const matchFiltro = filtro === 'todos' ? true : filtro === 'agotado' ? st === 'agotado' : filtro === 'crit' ? st === 'crit' : i.categoria === filtro
    const matchBusqueda = i.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return matchFiltro && matchBusqueda
  })

  async function handleSave() {
    if (!form.insumo_id || !form.cantidad || !form.precio) { setMsg('Completa todos los campos requeridos'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/compras', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) { setMsg('Compra registrada'); setModal(false); setForm({ insumo_id: '', cantidad: '', precio: '', proveedor_id: '', fecha_vencimiento: '' }); setTimeout(() => window.location.reload(), 800) }
      else setMsg('Error al guardar')
    } catch { setMsg('Error de conexión') }
    setSaving(false)
  }

  const brown = 'var(--amz-brown)'
  const surface = 'var(--amz-surface)'
  const border = '0.5px solid rgba(61,43,0,0.1)'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--amz-bg)' }}>
      <div style={{ padding: '20px 28px', background: surface, borderBottom: border, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '17px', fontWeight: '500', color: brown }}>Inventario de insumos</div>
          <div style={{ fontSize: '12px', color: 'rgba(61,43,0,0.5)', marginTop: '2px' }}>{stats.total} insumos registrados</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: surface, border, borderRadius: '8px', padding: '7px 12px' }}>
            <input style={{ border: 'none', background: 'transparent', fontSize: '12px', color: brown, outline: 'none', width: '160px' }} placeholder="Buscar insumo..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
          </div>
          <button onClick={() => setModal(true)} style={{ background: brown, color: '#E8D5B5', border: 'none', fontSize: '12px', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>+ Registrar compra</button>
        </div>
      </div>

      <div style={{ padding: '24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: '12px', marginBottom: '22px' }}>
          {[
            { label: 'Total', val: stats.total, note: 'insumos activos', color: brown },
            { label: 'Agotados', val: stats.agotados, note: 'sin stock', color: stats.agotados > 0 ? '#8B2020' : brown },
            { label: 'Críticos', val: stats.criticos, note: 'bajo el mínimo', color: stats.criticos > 0 ? '#A07840' : brown },
            { label: 'En orden', val: stats.ok, note: 'stock suficiente', color: '#3B5C1A' },
          ].map(k => (
            <div key={k.label} style={{ background: surface, border, borderRadius: '10px', padding: '14px 16px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.7px', textTransform: 'uppercase', color: 'rgba(61,43,0,0.5)', marginBottom: '6px' }}>{k.label}</div>
              <div style={{ fontSize: '22px', fontWeight: '500', color: k.color, lineHeight: 1 }}>{k.val}</div>
              <div style={{ fontSize: '11px', color: 'rgba(61,43,0,0.45)', marginTop: '4px' }}>{k.note}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {filtros.map(f => (
            <button key={f.key} onClick={() => setFiltro(f.key)} style={{ fontSize: '12px', padding: '5px 13px', borderRadius: '20px', cursor: 'pointer', border, color: filtro === f.key ? '#E8D5B5' : 'rgba(61,43,0,0.5)', background: filtro === f.key ? brown : 'transparent' }}>
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ background: surface, border, borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 60px', padding: '10px 18px', borderBottom: border, background: 'rgba(61,43,0,0.03)' }}>
            {['Insumo','Stock actual','Mínimo','Estado',''].map(h => (
              <div key={h} style={{ fontSize: '10px', letterSpacing: '0.7px', textTransform: 'uppercase', color: 'rgba(61,43,0,0.45)', fontWeight: '500' }}>{h}</div>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', fontSize: '13px', color: 'rgba(61,43,0,0.4)' }}>No hay insumos</div>
          ) : filtered.map((i: any) => {
            const st = getStatus(Number(i.stock_actual), Number(i.stock_minimo))
            return (
              <div key={i.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 60px', padding: '12px 18px', borderBottom: border, alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', color: brown, fontWeight: '500' }}>{i.nombre}</div>
                  <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '5px', background: 'rgba(61,43,0,0.07)', color: 'rgba(61,43,0,0.6)' }}>{i.categoria}</span>
                </div>
                <div style={{ fontSize: '13px', color: brown }}>{Number(i.stock_actual)} <span style={{ fontSize: '11px', color: 'rgba(61,43,0,0.4)' }}>{i.unidad}</span></div>
                <div style={{ fontSize: '12px', color: 'rgba(61,43,0,0.5)' }}>{Number(i.stock_minimo)} {i.unidad}</div>
                <div><Pill status={st} /></div>
                <div style={{ textAlign: 'right' }}>
                  <button onClick={() => { setForm(f => ({ ...f, insumo_id: i.id })); setModal(true) }} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '6px', border, background: 'transparent', cursor: 'pointer', color: 'rgba(61,43,0,0.5)' }}>+stock</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {modal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(61,43,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={e => { if (e.target === e.currentTarget) setModal(false) }}>
          <div style={{ background: surface, borderRadius: '14px', border, padding: '28px', width: '380px', maxWidth: '90vw' }}>
            <div style={{ fontSize: '15px', fontWeight: '500', color: brown, marginBottom: '4px' }}>Registrar compra</div>
            <div style={{ fontSize: '12px', color: 'rgba(61,43,0,0.5)', marginBottom: '20px' }}>Actualiza el stock de un insumo</div>
            {msg && <div style={{ fontSize: '12px', color: '#3B5C1A', marginBottom: '12px' }}>{msg}</div>}
            {[
              { label: 'Insumo *', el: <select style={{ width: '100%', background: 'rgba(61,43,0,0.04)', border, borderRadius: '8px', padding: '9px 12px', fontSize: '13px', color: brown, outline: 'none' }} value={form.insumo_id} onChange={e => setForm(f => ({ ...f, insumo_id: e.target.value }))}><option value="">Selecciona un insumo</option>{insumos.map((i: any) => <option key={i.id} value={i.id}>{i.nombre}</option>)}</select> },
              { label: 'Proveedor', el: <select style={{ width: '100%', background: 'rgba(61,43,0,0.04)', border, borderRadius: '8px', padding: '9px 12px', fontSize: '13px', color: brown, outline: 'none' }} value={form.proveedor_id} onChange={e => setForm(f => ({ ...f, proveedor_id: e.target.value }))}><option value="">Selecciona proveedor</option>{proveedores.map((p: any) => <option key={p.id} value={p.id}>{p.nombre}</option>)}</select> },
            ].map(({ label, el }) => (
              <div key={label} style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase', color: 'rgba(61,43,0,0.5)', marginBottom: '5px', display: 'block' }}>{label}</label>
                {el}
              </div>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'rgba(61,43,0,0.5)', marginBottom: '5px', display: 'block' }}>Cantidad *</label>
                <input style={{ width: '100%', background: 'rgba(61,43,0,0.04)', border, borderRadius: '8px', padding: '9px 12px', fontSize: '13px', color: brown, outline: 'none' }} type="number" placeholder="0" value={form.cantidad} onChange={e => setForm(f => ({ ...f, cantidad: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'rgba(61,43,0,0.5)', marginBottom: '5px', display: 'block' }}>Costo ($) *</label>
                <input style={{ width: '100%', background: 'rgba(61,43,0,0.04)', border, borderRadius: '8px', padding: '9px 12px', fontSize: '13px', color: brown, outline: 'none' }} type="number" placeholder="0.00" value={form.precio} onChange={e => setForm(f => ({ ...f, precio: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => { setModal(false); setMsg('') }} style={{ flex: 1, background: 'transparent', border, color: 'rgba(61,43,0,0.5)', fontSize: '13px', padding: '9px', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: brown, color: '#E8D5B5', border: 'none', fontSize: '13px', padding: '9px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>{saving ? 'Guardando...' : 'Guardar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
