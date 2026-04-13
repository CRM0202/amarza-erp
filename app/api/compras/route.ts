import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const { insumo_id, cantidad, precio, proveedor_id, fecha_vencimiento } = await req.json()

    const { data: compra, error: compraError } = await supabase
      .from('compras')
      .insert({ proveedor_id: proveedor_id || null, total: Number(precio) })
      .select()
      .single()

    if (compraError) return NextResponse.json({ error: compraError.message }, { status: 500 })

    const { error: itemError } = await supabase
      .from('compra_items')
      .insert({ compra_id: compra.id, insumo_id, cantidad: Number(cantidad), precio_unitario: Number(precio) / Number(cantidad) })

    if (itemError) return NextResponse.json({ error: itemError.message }, { status: 500 })

    if (fecha_vencimiento) {
      await supabase.from('insumos').update({ fecha_vencimiento }).eq('id', insumo_id)
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
