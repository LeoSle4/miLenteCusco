import { supabase, FOTOS_BUCKET } from './supabaseClient';
import { encolarFoto, obtenerCola, eliminarDeCola, marcarIntentoFallido } from './offlineQueue';

function rutaArchivo(dia, file) {
  const ext = (file.type && file.type.split('/')[1]) || 'jpg';
  const random = Math.random().toString(36).slice(2, 8);
  return `dia-${dia}/${Date.now()}-${random}.${ext}`;
}

function urlPublica(path) {
  const { data } = supabase.storage.from(FOTOS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// Sube directamente a Supabase (storage + fila en la tabla). Lanza error si falla.
async function subirFotoRemota({ file, dia, retoId, nota, mood, formato }) {
  const path = rutaArchivo(dia, file);

  const { error: uploadError } = await supabase.storage
    .from(FOTOS_BUCKET)
    .upload(path, file, { contentType: file.type || 'image/jpeg' });
  if (uploadError) throw uploadError;

  const { data, error: insertError } = await supabase
    .from('fotos')
    .insert({
      dia,
      reto_id: retoId || null,
      nota: nota || '',
      mood: mood || null,
      formato: formato || 'cuadrado',
      image_path: path,
    })
    .select()
    .single();

  if (insertError) throw insertError;

  return { ...data, imageUrl: urlPublica(data.image_path) };
}

// Punto de entrada al guardar una foto nueva desde la app.
// Si hay conexión y la subida funciona, va directo a Supabase.
// Si no hay señal o la subida falla, se guarda en la cola local y se reintenta sola.
export async function guardarFoto(fotoData) {
  if (!navigator.onLine) {
    await encolarFoto(fotoData);
    return { ok: true, queued: true };
  }

  try {
    const foto = await subirFotoRemota(fotoData);
    return { ok: true, queued: false, foto };
  } catch (err) {
    await encolarFoto(fotoData);
    return { ok: true, queued: true };
  }
}

// Recorre la cola y reintenta subir cada foto pendiente. Se llama sola al volver la señal.
export async function reintentarCola() {
  if (!navigator.onLine) return;
  const pendientes = await obtenerCola();
  for (const item of pendientes) {
    try {
      await subirFotoRemota(item);
      await eliminarDeCola(item.id);
    } catch (err) {
      await marcarIntentoFallido(item.id);
    }
  }
}

// Arranca la sincronización automática: reintenta al cargar la app y cada vez que vuelve la señal.
export function iniciarSincronizacion() {
  reintentarCola();
  window.addEventListener('online', reintentarCola);
  return () => window.removeEventListener('online', reintentarCola);
}

// Trae todas las fotos ya subidas a Supabase, con su URL pública lista para mostrar.
export async function obtenerFotos() {
  const { data, error } = await supabase
    .from('fotos')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data.map((f) => ({ ...f, imageUrl: urlPublica(f.image_path) }));
}

export async function obtenerFotosPorDia(dia) {
  const todas = await obtenerFotos();
  return todas.filter((f) => f.dia === dia);
}

// Fotos aún en la cola local (no subidas todavía), con una preview local para mostrarlas igual.
export async function obtenerFotosPendientes() {
  const pendientes = await obtenerCola();
  return pendientes.map((p) => ({
    id: p.id,
    dia: p.dia,
    reto_id: p.retoId || null,
    nota: p.nota || '',
    mood: p.mood || null,
    imageUrl: URL.createObjectURL(p.file),
    created_at: new Date(p.timestamp).toISOString(),
    pendiente: true,
  }));
}

// Se dispara cada vez que llega una foto nueva por Realtime (subida por cualquier persona con el link).
export function suscribirFotos(onNuevaFoto) {
  const canal = supabase
    .channel('fotos-realtime')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'fotos' },
      (payload) => {
        onNuevaFoto({ ...payload.new, imageUrl: urlPublica(payload.new.image_path) });
      }
    )
    .subscribe();

  return () => supabase.removeChannel(canal);
}
