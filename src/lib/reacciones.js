import { supabase } from './supabaseClient';

export async function obtenerReacciones(fotoId) {
  const { data, error } = await supabase.from('reacciones').select('*').eq('foto_id', fotoId);
  if (error) throw error;
  return data;
}

// Trae todas las reacciones del viaje, para armar los conteos de las miniaturas.
export async function obtenerTodasReacciones() {
  const { data, error } = await supabase.from('reacciones').select('foto_id, autor, tipo');
  if (error) throw error;
  return data;
}

// Alterna la reacción: si ya existe esa combinación foto+autor+tipo la quita, si no la agrega.
export async function alternarReaccion({ fotoId, autor, tipo }) {
  const { data: existentes, error: buscarError } = await supabase
    .from('reacciones')
    .select('id')
    .eq('foto_id', fotoId)
    .eq('autor', autor)
    .eq('tipo', tipo);
  if (buscarError) throw buscarError;

  if (existentes.length > 0) {
    const { error } = await supabase.from('reacciones').delete().eq('id', existentes[0].id);
    if (error) throw error;
    return { activa: false };
  }

  const { error } = await supabase.from('reacciones').insert({ foto_id: fotoId, autor, tipo });
  if (error) throw error;
  return { activa: true };
}

export function suscribirReacciones(fotoId, onCambio) {
  const canal = supabase
    .channel(`reacciones-${fotoId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'reacciones', filter: `foto_id=eq.${fotoId}` },
      onCambio
    )
    .subscribe();
  return () => supabase.removeChannel(canal);
}

// Para refrescar los conteos en las miniaturas cuando cambia cualquier reacción del viaje.
export function suscribirTodasReacciones(onCambio) {
  const canal = supabase
    .channel('reacciones-todas')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reacciones' }, onCambio)
    .subscribe();
  return () => supabase.removeChannel(canal);
}
