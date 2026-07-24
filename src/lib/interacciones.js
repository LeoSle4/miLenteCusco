import { obtenerTodosFotoIdsConComentario, suscribirTodosComentarios } from './comentarios';
import { obtenerTodasReacciones, suscribirTodasReacciones } from './reacciones';

// Mapa fotoId -> cantidad de comentarios + reacciones, para el badge de las miniaturas.
export async function obtenerConteosInteracciones() {
  const [fotoIdsComentarios, reacciones] = await Promise.all([
    obtenerTodosFotoIdsConComentario(),
    obtenerTodasReacciones(),
  ]);
  const conteos = new Map();
  for (const fotoId of fotoIdsComentarios) {
    conteos.set(fotoId, (conteos.get(fotoId) || 0) + 1);
  }
  for (const r of reacciones) {
    conteos.set(r.foto_id, (conteos.get(r.foto_id) || 0) + 1);
  }
  return conteos;
}

export function suscribirInteracciones(onCambio) {
  const desuscribirComentarios = suscribirTodosComentarios(onCambio);
  const desuscribirReacciones = suscribirTodasReacciones(onCambio);
  return () => {
    desuscribirComentarios();
    desuscribirReacciones();
  };
}
