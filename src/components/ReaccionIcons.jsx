// Iconos de reacción dibujados a mano, estilo cosy — nada de emojis estándar.

export function IconCorazon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M16 27C9 22.5 4 18.3 4 12.8 4 8.9 7 6 10.6 6c2 0 3.9 1 5.4 2.9C17.5 7 19.4 6 21.4 6 25 6 28 8.9 28 12.8 28 18.3 23 22.5 16 27Z"
        fill="#E8879F"
        stroke="#8A4A61"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M9.5 12c.5-1.5 1.8-2.3 3-2.2" stroke="#FDF1F5" strokeWidth="1.3" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

export function IconEstrella({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M16 4l2.6 7.4L26 14l-7.4 2.6L16 24l-2.6-7.4L6 14l7.4-2.6L16 4z"
        fill="#F3AFC7"
        stroke="#8A4A61"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="8" r="1.4" fill="#D98B6B" />
      <circle cx="7" cy="22" r="1" fill="#D98B6B" />
    </svg>
  );
}

export function IconCafecito({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M12 6c-.3-1.2-.1-2 .6-2.6M17 6c-.3-1.4-.1-2.3.7-3" stroke="#D98B6B" strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />
      <path
        d="M7 13h15.5v5.5A5.5 5.5 0 0 1 17 24h-4.5A5.5 5.5 0 0 1 7 18.5V13Z"
        fill="#FDF1F5"
        stroke="#8A4A61"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M22.5 14.5H25a2.5 2.5 0 0 1 0 5h-2.5"
        fill="none"
        stroke="#8A4A61"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path d="M7 24h15.5" stroke="#8A4A61" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function IconOjosLlorosos({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="15" r="11" fill="#FDF1F5" stroke="#A79CA0" strokeWidth="1.3" />
      <path d="M9 5c-6 8-5 8.5-1 12" fill="#BFE0F0" stroke="#8AACC0" strokeWidth="1" opacity="0.85" />
      <path d="M23 5c6 8 5 8.5 1 12" fill="#BFE0F0" stroke="#8AACC0" strokeWidth="1" opacity="0.85" />
      <path d="M11 13.5c1-1 2.5-1 3.5 0M17.5 13.5c1-1 2.5-1 3.5 0" stroke="#8A4A61" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13 20q3 2 6 0" stroke="#8A4A61" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const REACCIONES = [
  { tipo: 'corazon', Icon: IconCorazon, etiqueta: 'Me encanta' },
  { tipo: 'estrella', Icon: IconEstrella, etiqueta: 'Brilla' },
  { tipo: 'cafe', Icon: IconCafecito, etiqueta: 'Cosy' },
  { tipo: 'llorando', Icon: IconOjosLlorosos, etiqueta: 'Me emociona' },
];
