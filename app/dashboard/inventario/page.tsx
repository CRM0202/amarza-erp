import { supabase } from '@/lib/supabase'
import InventarioClient from './InventarioClient'

export default async function InventarioPage() {
  const { data: insumos } = await supabase
    .from('insumos')
    .select('*, proveedores(nombre)')
    .eq('activo', true)
    .order('nombre')

  const { data: proveedores } = await supabase
    .from('proveedores')
    .select('id, nombre')
    .eq('activo', true)
    .order('nombre')

  const total = insumos?.length ?? 0
  const criticos = insumos?.filter(i => Number(i.stock_actual) <= Number(i.stock_minimo) && Number(i.stock_actual) > 0).length ?? 0
  const agotados = insumos?.filter(i => Number(i.stock_actual) === 0).length ?? 0
  const ok = insumos?.filter(i => Number(i.stock_actual) > Number(i.stock_minimo)).length ?? 0

  return (
    <InventarioClient
      insumos={insumos ?? []}
      proveedores={proveedores ?? []}
      stats={{ total, criticos, agotados, ok }}
    />
  )
}
