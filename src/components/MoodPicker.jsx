import Em from './Em';

// Mood SVG icons — estilo kawaii cosy, diseñados a mano
const MOODS = [
  {
    id: 'encantada',
    label: 'Encantada',
    svg: (
      <svg viewBox="0 0 40 40" width="32" height="32">
        <circle cx="20" cy="20" r="18" fill="#FDF1F5" stroke="#F3AFC7" strokeWidth="1.5" />
        <circle cx="14" cy="17" r="2" fill="#8A4A61" />
        <circle cx="26" cy="17" r="2" fill="#8A4A61" />
        <path d="M13 25 Q20 31 27 25" stroke="#8A4A61" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M12 13 Q14 11 16 13" stroke="#F3AFC7" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M24 13 Q26 11 28 13" stroke="#F3AFC7" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <circle cx="28" cy="14" r="3" fill="#F3AFC7" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: 'con-sueno',
    label: 'Con sueño',
    svg: (
      <svg viewBox="0 0 40 40" width="32" height="32">
        <circle cx="20" cy="20" r="18" fill="#FDF1F5" stroke="#A79CA0" strokeWidth="1.5" />
        <path d="M12 17 Q14 19 16 17" stroke="#8A4A61" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M24 17 Q26 19 28 17" stroke="#8A4A61" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M15 25 Q20 27 25 25" stroke="#8A4A61" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <text x="30" y="12" fontSize="8" fill="#A79CA0" opacity="0.7">z</text>
        <text x="33" y="8" fontSize="6" fill="#A79CA0" opacity="0.5">z</text>
      </svg>
    ),
  },
  {
    id: 'sorprendida',
    label: 'Sorprendida',
    svg: (
      <svg viewBox="0 0 40 40" width="32" height="32">
        <circle cx="20" cy="20" r="18" fill="#FDF1F5" stroke="#D98B6B" strokeWidth="1.5" />
        <circle cx="14" cy="17" r="2.5" fill="#8A4A61" />
        <circle cx="26" cy="17" r="2.5" fill="#8A4A61" />
        <circle cx="15" cy="16" r="0.8" fill="white" />
        <circle cx="27" cy="16" r="0.8" fill="white" />
        <ellipse cx="20" cy="27" rx="4" ry="3" fill="#8A4A61" opacity="0.8" />
        <path d="M10 12 Q12 9 14 12" stroke="#D98B6B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M26 12 Q28 9 30 12" stroke="#D98B6B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'cosy',
    label: 'Cosy',
    labelSuffix: <Em size={14}>🍵</Em>,
    svg: (
      <svg viewBox="0 0 40 40" width="32" height="32">
        <circle cx="20" cy="20" r="18" fill="#FDF1F5" stroke="#D98B6B" strokeWidth="1.5" />
        <path d="M12 17 Q14 19 16 17" stroke="#8A4A61" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M24 17 Q26 19 28 17" stroke="#8A4A61" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M14 24 Q20 29 26 24" stroke="#8A4A61" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M28 9 Q30 6 32 9 Q30 12 28 9Z" fill="#D98B6B" opacity="0.5" />
        <circle cx="13" cy="26" r="2.5" fill="#F3AFC7" opacity="0.4" />
        <circle cx="27" cy="26" r="2.5" fill="#F3AFC7" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: 'con-hambre',
    label: 'Con hambre',
    svg: (
      <svg viewBox="0 0 40 40" width="32" height="32">
        <circle cx="20" cy="20" r="18" fill="#FDF1F5" stroke="#D98B6B" strokeWidth="1.5" />
        <circle cx="14" cy="17" r="2" fill="#8A4A61" />
        <circle cx="26" cy="17" r="2" fill="#8A4A61" />
        <path d="M14 24 Q20 22 26 24" stroke="#8A4A61" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M19 28 Q20 31 21 28" stroke="#D98B6B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <circle cx="29" cy="12" r="4" fill="#D98B6B" opacity="0.25" />
        {/* Tenedor y cuchillo como path SVG */}
        <path d="M27 11 L27 16" stroke="#D98B6B" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M25 11 L29 11" stroke="#D98B6B" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'enamorada',
    label: 'Enamorada del paisaje',
    svg: (
      <svg viewBox="0 0 40 40" width="32" height="32">
        <circle cx="20" cy="20" r="18" fill="#FDF1F5" stroke="#F3AFC7" strokeWidth="1.5" />
        {/* Ojos de corazón */}
        <path d="M11 15 Q12 12 14 14 Q16 12 17 15 Q16 18 14 19 Q12 18 11 15Z" fill="#E8879F" />
        <path d="M23 15 Q24 12 26 14 Q28 12 29 15 Q28 18 26 19 Q24 18 23 15Z" fill="#E8879F" />
        <path d="M13 25 Q20 31 27 25" stroke="#8A4A61" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        {/* Destellos como paths SVG */}
        <path d="M32 8 L33 5 L34 8 L37 9 L34 10 L33 13 L32 10 L29 9Z" fill="#F3AFC7" opacity="0.7" />
        <path d="M5 8 L6 5 L7 8 L10 9 L7 10 L6 13 L5 10 L2 9Z" fill="#F3AFC7" opacity="0.7" />
      </svg>
    ),
  },
];

export { MOODS };

export default function MoodPicker({ selected, onSelect }) {
  return (
    <div>
      <p className="font-sans text-xs text-gris-calido mb-2 font-semibold uppercase tracking-wide">
        ¿Cómo te sientes?
      </p>
      <div className="grid grid-cols-3 gap-2">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            id={`mood-${mood.id}`}
            onClick={() => onSelect(selected === mood.id ? null : mood.id)}
            className={`mood-btn ${selected === mood.id ? 'selected' : ''}`}
          >
            {mood.svg}
            <span className="text-center leading-tight">
              {mood.label}{mood.labelSuffix && <> {mood.labelSuffix}</>}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
