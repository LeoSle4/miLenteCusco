import { supabase } from './supabaseClient';

export async function obtenerComentarios(fotoId) {
  const { data, error } = await supabase
    .from('comentarios')
    .select('*')
    .eq('foto_id', fotoId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function agregarComentario({ fotoId, autor, texto }) {
  const { data, error } = await supabase
    .from('comentarios')
    .insert({ foto_id: fotoId, autor, texto })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Se dispara con cualquier comentario nuevo (de cualquier foto); el caller filtra por foto_id.
export function suscribirComentarios(fotoId, onNuevoComentario) {
  const canal = supabase
    .channel(`comentarios-${fotoId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'comentarios', filter: `foto_id=eq.${fotoId}` },
      (payload) => onNuevoComentario(payload.new)
    )
    .subscribe();

  return () => supabase.removeChannel(canal);
}

// Trae solo el foto_id de todos los comentarios, para contar cuántos tiene cada miniatura.
export async function obtenerTodosFotoIdsConComentario() {
  const { data, error } = await supabase.from('comentarios').select('foto_id');
  if (error) throw error;
  return data.map((c) => c.foto_id);
}

// Para refrescar los conteos en las miniaturas cuando llega cualquier comentario nuevo.
export function suscribirTodosComentarios(onNuevo) {
  const canal = supabase
    .channel('comentarios-todos')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comentarios' }, onNuevo)
    .subscribe();
  return () => supabase.removeChannel(canal);
}
