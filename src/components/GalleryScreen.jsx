import { useState, useEffect } from 'react';
import { obtenerFotos, obtenerFotosPendientes, suscribirFotos } from '../lib/fotos';
import { itinerario } from '../data/itinerary';
import PolaroidCard from './PolaroidCard';
import Em from './Em';

export default function GalleryScreen() {
  const [fotos, setFotos] = useState([]);
  const [filtro, setFiltro] = useState(null); // null = todos los días
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarFotos();
    window.addEventListener('mlc:cola-actualizada', cargarFotos);
    const desuscribir = suscribirFotos(cargarFotos);
    return () => {
      window.removeEventListener('mlc:cola-actualizada', cargarFotos);
      desuscribir();
    };
  }, []);

  async function cargarFotos() {
    setLoading(true);
    const [remotas, pendientes] = await Promise.all([obtenerFotos(), obtenerFotosPendientes()]);
    setFotos([...remotas, ...pendientes]);
    setLoading(false);
  }

  const fotosFiltradas = filtro ? fotos.filter((f) => f.dia === filtro) : fotos;

  // Agrupar por día
  const porDia = itinerario.reduce((acc, dia) => {
    const fotasDia = fotosFiltradas.filter((f) => f.dia === dia.dia);
    if (fotasDia.length > 0) acc.push({ ...dia, fotos: fotasDia });
    return acc;
  }, []);

  return (
    <div className="min-h-dvh bg-crema">
      {/* Header */}
      <div className="px-5 pt-8 pb-3 bg-gradient-to-b from-rosa-suave to-crema sticky top-0 z-10">
        <h1 className="font-serif-elegante text-3xl font-semibold text-rosa-oscuro mb-3">
          Tu galería <span className="text-rosa-principal/50 text-xl align-middle">✦</span>
        </h1>

        {/* Chips de filtro */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          <button
            id="chip-todos"
            onClick={() => setFiltro(null)}
            className={`chip-dia flex-shrink-0 ${filtro === null ? 'active' : ''}`}
          >
            Todos
          </button>
          {itinerario.map((dia) => (
            <button
              key={dia.dia}
              id={`chip-dia-${dia.dia}`}
              onClick={() => setFiltro(filtro === dia.dia ? null : dia.dia)}
              className={`chip-dia flex-shrink-0 ${filtro === dia.dia ? 'active' : ''}`}
            >
              Día {dia.dia} — {dia.titulo}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div className="px-5 py-4">
        {loading ? (
          // Skeletons
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton aspect-square rounded-lg" />
            ))}
          </div>
        ) : fotosFiltradas.length === 0 ? (
          // Estado vacío
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="animate-flotar mb-4">
              <img
                src="/mascota/pet_happy.png"
                alt="Esperando fotos"
                className="w-28 h-28 object-contain opacity-70"
              />
            </div>
            <p className="font-serif-elegante text-2xl text-rosa-oscuro mb-2">
              {filtro ? `Nada del Día ${filtro} aún` : 'Aún no hay fotos'}
            </p>
            <p className="font-manuscrita text-lg text-gris-calido max-w-xs">
              Las fotos que vayas tomando aparecerán aquí, agrupadas por día <Em>🌸</Em>
            </p>
          </div>
        ) : (
          // Fotos agrupadas por día
          <div className="space-y-8 animate-fade-in">
            {porDia.map((dia) => (
              <section key={dia.dia}>
                {/* Título del día */}
                <div className="flex items-center gap-3 mb-4">
                  <div>
                    <p className="font-sans text-xs text-terracota font-semibold uppercase tracking-wider">
                      Día {dia.dia}
                    </p>
                    <h2 className="font-serif-elegante text-xl text-rosa-oscuro">
                      {dia.titulo}
                    </h2>
                  </div>
                  <hr className="flex-1 separador-hairline my-0" />
                </div>

                {/* Grid de fotos tipo masonry: cada foto conserva su formato sin dejar huecos */}
                <div className="masonry-cols">
                  {dia.fotos.map((foto, i) => (
                    <div key={foto.id} className="masonry-item">
                      <PolaroidCard foto={foto} index={i} />
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* Total */}
            <div className="text-center py-4">
              <span className="etiqueta">
                {fotosFiltradas.length} {fotosFiltradas.length === 1 ? 'foto guardada' : 'fotos guardadas'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
