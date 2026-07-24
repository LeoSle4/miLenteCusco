import { useState, useEffect } from 'react';
import { obtenerFotos, obtenerFotosPendientes } from '../lib/fotos';
import { itinerario, FECHA_INICIO, obtenerTextoReto } from '../data/itinerary';
import { useAuth } from '../AuthContext';
import { MOODS } from './MoodPicker';
import FotoDetalle from './FotoDetalle';
import Em from './Em';

const SPOTIFY_EMBED = 'https://open.spotify.com/embed/playlist/39UnqAUi8AS7jfc3GtEda0?utm_source=generator';

const ROTATIONS_ALBUM = [-1.2, 0.8, -0.5, 1.1, 0, -0.9, 0.6, -0.4, 0.9, -0.7];

const ALBUM_FORMATO = {
  vertical: { aspectRatio: '9 / 16', width: '130px' },
  cuadrado: { aspectRatio: '1 / 1', width: '160px' },
  horizontal: { aspectRatio: '16 / 9', width: '190px' },
};

export default function AlbumScreen() {
  const { rol } = useAuth();
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fotoSeleccionada, setFotoSeleccionada] = useState(null);

  useEffect(() => {
    Promise.all([obtenerFotos(), obtenerFotosPendientes()]).then(([remotas, pendientes]) => {
      setFotos([...remotas, ...pendientes]);
      setLoading(false);
    });
  }, []);

  // Agrupar fotos por día
  const fotasPorDia = itinerario.map((dia) => ({
    ...dia,
    fotos: fotos.filter((f) => f.dia === dia.dia),
  }));

  const totalFotos = fotos.length;
  const fechaInicio = FECHA_INICIO;
  const fechaFin = new Date(FECHA_INICIO);
  fechaFin.setDate(fechaFin.getDate() + 4);

  const formatFecha = (d) =>
    d.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-crema">
        <div className="text-center">
          <div className="animate-flotar mb-4">
            <img src="/mascota/pet_happy.png" className="w-24 h-24 mascota-img" alt="" />
          </div>
          <p className="font-manuscrita text-xl text-gris-calido">Preparando tu álbum…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-rosa-suave via-crema to-rosa-suave">
      {/* ── PORTADA ────────────────────────────────────────────────── */}
      <section className="album-portada px-6 py-16 text-center gap-6">
        {/* Decoración de esquinas */}
        <div className="absolute top-4 left-4 text-rosa-principal/20 text-4xl select-none">✦</div>
        <div className="absolute top-4 right-4 text-rosa-principal/20 text-4xl select-none">✦</div>

        {/* Mascota grande */}
        <div className="animate-flotar-lento">
          <img
            src="/mascota/pet_camera.png"
            alt="Mascota del álbum"
            className="w-48 h-48 mascota-img"
          />
        </div>

        {/* Título */}
        <div>
          <p className="font-manuscrita text-2xl text-terracota mb-2">álbum de viaje</p>
          <h1 className="font-serif-elegante text-5xl font-semibold text-rosa-oscuro leading-tight">
            Mi Lente en Cusco
          </h1>
          <hr className="separador-hairline my-4 w-40 mx-auto" />
          <p className="font-sans text-sm text-gris-calido">
            {formatFecha(fechaInicio)} — {formatFecha(fechaFin)}
          </p>
          <p className="font-manuscrita text-lg text-rosa-oscuro mt-2">
            {totalFotos} {totalFotos === 1 ? 'momento guardado' : 'momentos guardados'} <Em>🌸</Em>
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <p className="font-sans text-xs text-gris-calido">Desliza para ver el álbum</p>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A79CA0" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* ── SECCIONES POR DÍA ──────────────────────────────────────── */}
      {fotasPorDia.map((dia, diaIdx) => (
        <section
          key={dia.dia}
          className="px-5 py-10"
          style={{
            background: diaIdx % 2 === 0
              ? 'linear-gradient(180deg, #FFF3E4 0%, #FDF1F5 100%)'
              : 'linear-gradient(180deg, #FDF1F5 0%, #FFF3E4 100%)',
          }}
        >
          {/* Encabezado del día */}
          <div className="flex items-end gap-3 mb-6">
            <div className="flex-1">
              <p className="font-sans text-xs text-terracota font-semibold uppercase tracking-widest mb-0.5">
                Día {dia.dia} de 5
              </p>
              <h2 className="font-serif-elegante text-3xl font-semibold text-rosa-oscuro leading-tight">
                {dia.titulo}
              </h2>
              <p className="font-manuscrita text-base text-gris-calido/80 italic mt-1">{dia.lugares}</p>
            </div>
            {/* Mascota asomándose */}
            <div className="flex-shrink-0 animate-flotar" style={{ animationDelay: `${diaIdx * 0.4}s` }}>
              <img
                src={`/mascota/${['pet_happy', 'pet_camera', 'pet_cofee', 'pet_sing', 'pet_chocolate_cake'][diaIdx % 5]}.png`}
                alt=""
                className="w-14 h-14 mascota-img"
              />
            </div>
          </div>

          <hr className="separador-hairline mb-6" />

          {/* Fotos del día */}
          {dia.fotos.length > 0 ? (
            <div className="space-y-8">
              {dia.fotos.map((foto, fotoIdx) => {
                const rotation = ROTATIONS_ALBUM[fotoIdx % ROTATIONS_ALBUM.length];
                const mood = foto.mood ? MOODS.find((m) => m.id === foto.mood) : null;
                const isLeft = fotoIdx % 2 === 0;
                const { aspectRatio, width } = ALBUM_FORMATO[foto.formato] || ALBUM_FORMATO.cuadrado;

                return (
                  <div
                    key={foto.id}
                    className={`flex gap-4 items-start ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    {/* Foto estilo scrapbook */}
                    <div
                      className="polaroid-wrap flex-shrink-0 cursor-pointer"
                      style={{
                        transform: `rotate(${rotation}deg)`,
                        width,
                        position: 'relative',
                      }}
                      onClick={() => setFotoSeleccionada(foto)}
                    >
                      <div className="overflow-hidden rounded-sm bg-rosa-suave" style={{ aspectRatio }}>
                        {foto.imageUrl || foto.imageData ? (
                          <img
                            src={foto.imageUrl || foto.imageData}
                            alt={foto.nota || 'Foto del viaje'}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-rosa-suave">
                            <Em size={30}>📷</Em>
                          </div>
                        )}
                      </div>

                      {/* Mascota en esquina */}
                      <img
                        src="/mascota/pet_happy.png"
                        alt=""
                        className="mascota-esquina"
                        style={{ opacity: fotoIdx % 3 === 0 ? 0.8 : 0 }}
                      />
                    </div>

                    {/* Nota manuscrita en el margen */}
                    <div className={`flex-1 flex flex-col justify-center gap-2 ${isLeft ? 'pt-4' : 'pt-4'}`}>
                      <span className="etiqueta w-fit">
                        {foto.reto_id ? (
                          <><Em size={12}>✨</Em> Sugerencia #{dia.retos.findIndex((r) => r.id === foto.reto_id) + 1}</>
                        ) : (
                          <><Em size={12}>💫</Em> Espacio libre</>
                        )}
                      </span>
                      {foto.nota && (
                        <p className="font-manuscrita text-xl text-rosa-oscuro leading-relaxed">
                          &ldquo;{foto.nota}&rdquo;
                        </p>
                      )}
                      {mood && (
                        <div className="flex items-center gap-1.5">
                          <span className="inline-block" style={{ transform: 'scale(0.8)' }}>
                            {mood.svg}
                          </span>
                          <span className="font-sans text-xs text-gris-calido italic">{mood.label}</span>
                        </div>
                      )}
                      <p className="font-sans text-xs text-gris-calido/50 mt-1">
                        {new Date(foto.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="font-manuscrita text-xl text-gris-calido/50 italic">
                Sin fotos guardadas de este día
              </p>
            </div>
          )}
        </section>
      ))}

      {/* ── CIERRE ─────────────────────────────────────────────────── */}
      <section className="px-6 py-16 text-center bg-gradient-to-b from-crema to-rosa-suave">
        <hr className="separador-hairline mb-10" />

        <div className="animate-flotar-lento mb-6">
          <img
            src="/mascota/pet_sleep.png"
            alt="Mascota descansando"
            className="w-32 h-32 mascota-img mx-auto"
          />
        </div>

        <h2 className="font-serif-elegante text-3xl text-rosa-oscuro mb-3">
          Fin del viaje
        </h2>
        <p className="font-manuscrita text-xl text-gris-calido max-w-xs mx-auto leading-relaxed mb-8">
          Gracias por capturar estos momentos con tus ojos <Em>🌸</Em>
          Este álbum es tuyo, siempre.
        </p>

        {/* Widget Spotify */}
        <div className="max-w-sm mx-auto">
          <p className="font-sans text-xs text-gris-calido mb-3 uppercase tracking-wide font-semibold">
            La playlist del viaje <Em>🎵</Em>
          </p>
          <div className="rounded-2xl overflow-hidden shadow-card">
            <iframe
              src={SPOTIFY_EMBED}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Playlist del viaje"
              style={{ borderRadius: '1rem' }}
            />
          </div>
          <p className="font-manuscrita text-sm text-gris-calido mt-2">
            toca play para escuchar mientras recuerdas <Em>🎶</Em>
          </p>
        </div>

        <div className="mt-12">
          <p className="font-manuscrita text-2xl text-rosa-oscuro">
            Cusco 2026 <Em>💕</Em>
          </p>
          <div className="flex justify-center gap-2 mt-2">
            {['✶', <Em key="e">🌸</Em>, '✶'].map((s, i) => (
              <span key={i} className="text-rosa-principal/40 text-sm">{s}</span>
            ))}
          </div>
        </div>
      </section>

      {fotoSeleccionada && (
        <FotoDetalle
          foto={fotoSeleccionada}
          retoTexto={obtenerTextoReto(fotoSeleccionada.dia, fotoSeleccionada.reto_id)}
          rol={rol}
          onClose={() => setFotoSeleccionada(null)}
        />
      )}
    </div>
  );
}
