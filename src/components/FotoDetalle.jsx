import { useState, useEffect, useRef } from 'react';
import { MOODS } from './MoodPicker';
import { obtenerComentarios, agregarComentario, suscribirComentarios } from '../lib/comentarios';
import Em from './Em';

const ASPECT_POR_FORMATO = {
  vertical: '9 / 16',
  cuadrado: '1 / 1',
  horizontal: '16 / 9',
};

const NOMBRE_POR_ROL = {
  pam: 'Pam',
  leo: 'Leo',
};

export default function FotoDetalle({ foto, retoTexto, rol, onClose }) {
  const [comentarios, setComentarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const finRef = useRef(null);

  const mood = foto.mood ? MOODS.find((m) => m.id === foto.mood) : null;
  const aspectRatio = ASPECT_POR_FORMATO[foto.formato] || '1 / 1';
  const autor = NOMBRE_POR_ROL[rol] || 'Alguien';
  const esFotoPendiente = !!foto.pendiente;

  useEffect(() => {
    if (esFotoPendiente) {
      setCargando(false);
      return;
    }
    let activo = true;
    obtenerComentarios(foto.id).then((data) => {
      if (activo) {
        setComentarios(data);
        setCargando(false);
      }
    });
    const desuscribir = suscribirComentarios(foto.id, (nuevo) => {
      setComentarios((prev) => (prev.some((c) => c.id === nuevo.id) ? prev : [...prev, nuevo]));
    });
    return () => {
      activo = false;
      desuscribir();
    };
  }, [foto.id, esFotoPendiente]);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comentarios.length]);

  async function handleEnviar() {
    const limpio = texto.trim();
    if (!limpio || esFotoPendiente) return;
    setEnviando(true);
    try {
      const nuevo = await agregarComentario({ fotoId: foto.id, autor, texto: limpio });
      setComentarios((prev) => (prev.some((c) => c.id === nuevo.id) ? prev : [...prev, nuevo]));
      setTexto('');
    } catch (err) {
      // Si falla, no perdemos lo que escribió: se queda en el input para reintentar.
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="modal-overlay items-center" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet !rounded-3xl !max-w-md flex flex-col" style={{ maxHeight: '92dvh' }}>
        <div className="w-10 h-1 rounded-full bg-gris-calido/30 mx-auto mb-3 flex-shrink-0" />

        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <h2 className="font-serif-elegante text-xl text-rosa-oscuro">Ese momento</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-rosa-suave text-gris-calido hover:bg-rosa-principal/20 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 -mx-1 px-1">
          {/* Foto grande */}
          <div className="rounded-2xl overflow-hidden bg-rosa-suave mb-4" style={{ aspectRatio }}>
            {foto.imageUrl && (
              <img src={foto.imageUrl} alt={foto.nota || 'Foto del viaje'} className="w-full h-full object-cover" />
            )}
          </div>

          {/* Etiqueta de sugerencia cumplida */}
          <div className="mb-3">
            {retoTexto ? (
              <span className="etiqueta">
                <Em size={14}>✨</Em> {retoTexto}
              </span>
            ) : (
              <span className="etiqueta">
                <Em size={14}>💫</Em> Espacio libre
              </span>
            )}
          </div>

          {/* Nota completa */}
          {foto.nota && (
            <p className="font-manuscrita text-2xl text-rosa-oscuro leading-relaxed mb-3">
              &ldquo;{foto.nota}&rdquo;
            </p>
          )}

          {/* Mood */}
          {mood && (
            <div className="flex items-center gap-1.5 mb-4">
              <span className="scale-90 inline-block">{mood.svg}</span>
              <span className="text-sm text-gris-calido font-sans">{mood.label}</span>
            </div>
          )}

          <hr className="separador-hairline my-4" />

          {/* Hilo de comentarios */}
          <p className="font-sans text-xs font-semibold text-gris-calido uppercase tracking-wide mb-3">
            Conversación
          </p>

          {esFotoPendiente ? (
            <p className="font-manuscrita text-lg text-gris-calido/70 italic text-center py-4">
              Cuando esta foto termine de subirse podrán comentarla aquí <Em>☁️</Em>
            </p>
          ) : cargando ? (
            <div className="flex justify-center py-4">
              <div className="w-5 h-5 rounded-full border-2 border-rosa-principal border-t-transparent animate-spin" />
            </div>
          ) : comentarios.length === 0 ? (
            <p className="font-manuscrita text-lg text-gris-calido/70 italic text-center py-4">
              Nadie ha dicho nada todavía <Em>🌸</Em>
            </p>
          ) : (
            <div className="flex flex-col gap-2.5 mb-2">
              {comentarios.map((c) => {
                const esMio = c.autor === autor;
                return (
                  <div key={c.id} className={`flex ${esMio ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                        esMio
                          ? 'bg-gradient-to-r from-rosa-principal to-rosa-medio text-white rounded-br-sm'
                          : 'bg-rosa-suave text-rosa-oscuro rounded-bl-sm'
                      }`}
                    >
                      {!esMio && (
                        <p className="font-sans text-[11px] font-semibold opacity-70 mb-0.5">{c.autor}</p>
                      )}
                      <p className="font-sans text-sm leading-snug">{c.texto}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={finRef} />
            </div>
          )}
        </div>

        {/* Input de comentario */}
        {!esFotoPendiente && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-rosa-principal/15 flex-shrink-0">
            <input
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEnviar()}
              placeholder={`Escribe algo, ${autor}...`}
              maxLength={300}
              className="flex-1 px-4 py-2.5 rounded-full border border-rosa-principal/30 bg-white font-sans text-sm text-rosa-oscuro placeholder-gris-calido/50 outline-none focus:border-rosa-principal transition-all"
            />
            <button
              onClick={handleEnviar}
              disabled={enviando || !texto.trim()}
              className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-r from-rosa-principal to-rosa-medio text-white flex items-center justify-center disabled:opacity-40 transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
