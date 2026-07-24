import localforage from 'localforage';

// Cola de fotos pendientes de subir (cuando no hay señal o falló la subida a Supabase)
const offlineStore = localforage.createInstance({
  name: 'mi-lente-cusco',
  storeName: 'offline_queue',
});

function notificarCambioCola() {
  window.dispatchEvent(new CustomEvent('mlc:cola-actualizada'));
}

// Agregar una foto a la cola offline
export async function encolarFoto(fotoData) {
  const id = `foto_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const item = {
    id,
    ...fotoData,
    timestamp: Date.now(),
    intentos: 0,
  };
  await offlineStore.setItem(id, item);
  notificarCambioCola();
  return id;
}

// Obtener todas las fotos en cola, más antiguas primero
export async function obtenerCola() {
  const items = [];
  await offlineStore.iterate((value) => {
    items.push(value);
  });
  return items.sort((a, b) => a.timestamp - b.timestamp);
}

// Eliminar un item de la cola (cuando se subió con éxito)
export async function eliminarDeCola(id) {
  await offlineStore.removeItem(id);
  notificarCambioCola();
}

// Incrementar el contador de intentos fallidos de un item
export async function marcarIntentoFallido(id) {
  const item = await offlineStore.getItem(id);
  if (item) {
    item.intentos = (item.intentos || 0) + 1;
    await offlineStore.setItem(id, item);
  }
}

// Contar cuántos items hay en cola
export async function contarCola() {
  return await offlineStore.length();
}

export { offlineStore };
