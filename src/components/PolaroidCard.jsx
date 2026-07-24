import { MOODS } from './MoodPicker';

// Rotaciones predefinidas sutiles (máximo 1°)
const ROTATIONS = [-1, 0.5, -0.5, 1, 0, -0.8, 0.3, -0.3];

// Cintas washi alternadas: color + ángulo, para que no todas las fotos se vean idénticas
const TAPES = [
  { color: 'rgba(243, 175, 199, 0.75)', rotate: '-4deg' },
  { color: 'rgba(217, 139, 107, 0.7)', rotate: '3deg' },
  { color: 'rgba(232, 135, 159, 0.7)', rotate: '-2deg' },
];

const ASPECT_POR_FORMATO = {
  vertical: '9 / 16',
  cuadrado: '1 / 1',
  horizontal: '16 / 9',
};

export default function PolaroidCard({ foto, index = 0 }) {
  const rotation = ROTATIONS[index % ROTATIONS.length];
  const mood = foto.mood ? MOODS.find((m) => m.id === foto.mood) : null;
  const aspectRatio = ASPECT_POR_FORMATO[foto.formato] || '1 / 1';
  const tape = TAPES[index % TAPES.length];

  return (
    <div
      className="polaroid-wrap cursor-pointer"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Cinta washi decorativa */}
      <div
        className="washi-tape"
        style={{ background: tape.color, transform: `translateX(-50%) rotate(${tape.rotate})` }}
      />

      {/* Imagen */}
      <div className="relative overflow-hidden rounded-sm bg-rosa-suave" style={{ aspectRatio }}>
        {foto.pendiente && (
          <span className="absolute top-1.5 right-1.5 z-10 px-1.5 py-0.5 rounded-full bg-white/85 text-[10px] font-sans text-terracota shadow-sm">
            subiendo…
          </span>
        )}
        {foto.imageUrl || foto.imageData ? (
          <img
            src={foto.imageUrl || foto.imageData}
            alt={foto.nota || 'Foto del viaje'}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-rosa-suave">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F3AFC7" strokeWidth="1.5">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="12" cy="12" r="3.5" />
              <circle cx="17" cy="8" r="1" fill="#F3AFC7" stroke="none" />
            </svg>
          </div>
        )}
      </div>

      {/* Área de nota (estilo scrapbook) */}
      <div className="pt-1.5 px-0.5">
        {foto.nota ? (
          <p className="font-manuscrita text-base text-rosa-oscuro leading-snug line-clamp-2">
            {foto.nota}
          </p>
        ) : (
          <p className="font-manuscrita text-sm text-gris-calido italic">
            sin nota
          </p>
        )}

        {mood && (
          <div className="mt-1 flex items-center gap-1">
            <span className="scale-75 inline-block">{mood.svg}</span>
            <span className="text-xs text-gris-calido font-sans">{mood.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
