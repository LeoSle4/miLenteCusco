import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { itinerario, getDiaActual, obtenerTextoReto } from '../data/itinerary';
import { obtenerFotosPorDia, obtenerFotosPendientes, suscribirFotos } from '../lib/fotos';
import { useAuth } from '../AuthContext';
import UploadModal from './UploadModal';
import PolaroidCard from './PolaroidCard';
import FotoDetalle from './FotoDetalle';
import Em from './Em';

// Iconos SVG inline por tipo
const IconMap = {
  sun: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  ),
  mountain: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 20l7-12 4 6 2-3 5 9H3z" />
    </svg>
  ),
  'map-pin': () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z" /><circle cx="12" cy="10" r="2" />
    </svg>
  ),
  'circle-dashed': () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" strokeDasharray="4 2" />
    </svg>
  ),
  droplet: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l7 10a7 7 0 1 1-14 0L12 2z" />
    </svg>
  ),
  'shopping-bag': () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  photo: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="12" cy="12" r="3.5" />
    </svg>
  ),
  footprint: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="9" cy="7" rx="3" ry="4" /><ellipse cx="15" cy="14" rx="3" ry="4" />
    </svg>
  ),
  telescope: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 18l-2 4M14 18l2 4M12 18v-6" /><path d="M3 9l4-5 12 3-4 5z" /><circle cx="12" cy="12" r="2" />
    </svg>
  ),
  building: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
    </svg>
  ),
  'panorama-horizontal': () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0" /><path d="M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    </svg>
  ),
  sparkles: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" /><path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75z" /><path d="M5 14l.75 2.25L8 17l-2.25.75L5 20l-.75-2.25L2 17l2.25-.75z" />
    </svg>
  ),
  palette: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><circle cx="9" cy="9" r="1.5" fill="currentColor" /><circle cx="15" cy="9" r="1.5" fill="currentColor" /><circle cx="9" cy="15" r="1.5" fill="currentColor" /><circle cx="15" cy="15" r="1.5" fill="currentColor" />
    </svg>
  ),
  hexagon: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 21.5 7 21.5 17 12 22 2.5 17 2.5 7" />
    </svg>
  ),
  heart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
};

const NOMBRES_DIA = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export default function DayScreen() {
  const navigate = useNavigate();
  const { rol } = useAuth();
  const diaActual = getDiaActual();
  const [fotos, setFotos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [retoPresel, setRetoPresel] = useState(null);
  const [fotoSeleccionada, setFotoSeleccionada] = useState(null);

  // Si el viaje terminó, ir al álbum
  useEffect(() => {
    if (diaActual > 5) {
      navigate('/album');
    }
  }, [diaActual, navigate]);

  const diaData = itinerario[Math.min((diaActual || 1) - 1, 4)];

  const cargarFotos = useCallback(async () => {
    if (!diaActual) return;
    const [remotas, pendientes] = await Promise.all([
      obtenerFotosPorDia(diaActual),
      obtenerFotosPendientes(),
    ]);
    const pendientesDia = pendientes.filter((p) => p.dia === diaActual);
    setFotos([...remotas, ...pendientesDia]);
  }, [diaActual]);

  useEffect(() => {
    cargarFotos();
    window.addEventListener('mlc:cola-actualizada', cargarFotos);
    const desuscribir = suscribirFotos((foto) => {
      if (foto.dia === diaActual) cargarFotos();
    });
    return () => {
      window.removeEventListener('mlc:cola-actualizada', cargarFotos);
      desuscribir();
    };
  }, [diaActual, cargarFotos]);

  function abrirModal(retoId = null) {
    setRetoPresel(retoId);
    setModalOpen(true);
  }

  const retosCumplidos = new Set(fotos.filter((f) => f.reto_id).map((f) => f.reto_id));

  // Fecha actual formateada
  const ahora = new Date();
  const fechaStr = `${NOMBRES_DIA[ahora.getDay() === 0 ? 6 : ahora.getDay() - 1]}, ${ahora.getDate()} de ${MESES[ahora.getMonth()]}`;

  if (!diaData) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-crema px-6">
        <div className="text-center">
          <img src="/mascota/pet_sleep.png" alt="Esperando el viaje" className="w-32 h-32 mascota-img mx-auto mb-4 animate-flotar" />
          <p className="font-serif-elegante text-2xl text-rosa-oscuro">El viaje comienza pronto</p>
          <p className="font-sans text-gris-calido mt-2">24 de julio del 2026 <Em>🌸</Em></p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-crema relative">
      {/* Header del día */}
      <div className="relative px-5 pt-8 pb-4 bg-gradient-to-b from-rosa-suave to-crema overflow-hidden">
        <span className="absolute top-3 right-5 text-rosa-principal/25 text-2xl select-none">✦</span>
        <span className="absolute top-10 right-12 text-terracota/20 text-sm select-none">✦</span>
        <p className="font-manuscrita text-lg text-terracota capitalize mb-0.5">{fechaStr}</p>
        <h1 className="font-serif-elegante text-3xl font-semibold text-rosa-oscuro leading-tight">
          Día {diaActual}
          <span className="text-lg font-normal text-gris-calido ml-2">de 5</span>
        </h1>
        <p className="font-sans text-base font-semibold text-rosa-oscuro mt-0.5">{diaData.titulo}</p>
        <p className="font-manuscrita text-base text-gris-calido/80 italic mt-1">{diaData.lugares}</p>

        {diaData.descripcion && (
          <p className="font-manuscrita text-sm text-gris-calido mt-1.5 italic">{diaData.descripcion}</p>
        )}
      </div>

      <hr className="separador-hairline mx-5" />

      {/* Retos del día */}
      <div className="px-5 pb-4">
        <p className="font-sans text-xs font-semibold text-gris-calido uppercase tracking-wider mb-3">
          CAPTURA LO QUE VES<Em>✨</Em>
        </p>

        <div className="flex flex-col gap-3">
          {diaData.retos.map((reto) => {
            const Icon = IconMap[reto.icono] || IconMap.sparkles;
            const cumplido = retosCumplidos.has(reto.id);
            return (
              <div
                key={reto.id}
                className={`reto-card group ${cumplido ? 'opacity-60' : ''}`}
                onClick={() => abrirModal(reto.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-terracota flex-shrink-0">
                    <Icon />
                  </div>
                  <p className={`font-sans text-sm text-rosa-oscuro leading-relaxed flex-1 ${cumplido ? 'line-through decoration-terracota/60' : ''}`}>
                    {reto.texto}
                  </p>
                  <div className="flex-shrink-0 mt-0.5">
                    {cumplido ? (
                      <span className="text-terracota">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </span>
                    ) : (
                      <div className="text-rosa-principal/40 group-hover:text-rosa-principal transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="12" cy="12" r="3" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Espacio libre */}
          <div
            className="reto-card reto-libre group cursor-pointer"
            onClick={() => abrirModal(null)}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0"><Em size={24}>💫</Em></div>
              <div className="flex-1">
                <p className="font-sans text-sm font-semibold text-rosa-oscuro">Espacio libre</p>
                <p className="font-manuscrita text-base text-gris-calido italic mt-0.5">
                  algo que te haga feliz
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fotos del día */}
      {fotos.length > 0 && (
        <>
          <hr className="separador-hairline mx-5" />
          <div className="px-5 pb-6">
            <p className="font-sans text-xs font-semibold text-gris-calido uppercase tracking-wider mb-3">
              Tus fotos de hoy ({fotos.length})
            </p>
            <div className="masonry-cols">
              {fotos.map((foto, i) => (
                <div key={foto.id} className="masonry-item">
                  <PolaroidCard foto={foto} index={i} onClick={() => setFotoSeleccionada(foto)} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Estado vacío */}
      {fotos.length === 0 && (
        <div className="px-5 pb-8 text-center">
          <div className="animate-flotar inline-block mb-3">
            <img src="/mascota/pet_camera.png" alt="Sin fotos aún" className="w-24 h-24 mascota-img opacity-70" />
          </div>
          <p className="font-manuscrita text-xl text-gris-calido">
            Todavía no hay fotos hoy...
          </p>
        </div>
      )}

      {/* FAB — subir foto */}
      <button
        className="fab-btn"
        onClick={() => abrirModal()}
        id="fab-subir-foto"
        aria-label="Subir foto"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="17.5" cy="8" r="1" fill="white" stroke="none" />
        </svg>
      </button>

      {/* Modal */}
      {modalOpen && (
        <UploadModal
          onClose={() => setModalOpen(false)}
          onSaved={cargarFotos}
          diaActual={diaActual}
          retos={diaData.retos}
          retoPreseleccionado={retoPresel}
        />
      )}

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
