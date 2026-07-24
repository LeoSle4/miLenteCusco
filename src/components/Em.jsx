/**
 * <Em> — Renderiza emojis con OpenMoji: estilo dibujado a mano,
 * líneas suaves, minimalista y cosy. Mucho más acorde al tono de la app
 * que los emojis planos de sistema o Twemoji.
 *
 * CDN: https://cdn.jsdelivr.net/npm/openmoji@15.1.0/color/svg/{CODEPOINT}.svg
 *
 * Uso:
 *   <Em>🌸</Em>           → tamaño relativo al texto (1.15em)
 *   <Em size={24}>✨</Em>  → 24px fijo
 *   <Em outline>✨</Em>    → versión outline/monocromo (minimal extremo)
 */

// Cache para no recomputar codepoints en cada render
const urlCache = new Map();

/**
 * Convierte un emoji Unicode a la URL de OpenMoji SVG.
 * OpenMoji usa: uppercase hex, sin variation selector (FE0F), con guión.
 * Ej: 🌸 → 1F338.svg  |  🗓️ → 1F5D3.svg  |  ✨ → 2728.svg
 */
function getOpenMojiUrl(emoji, outline = false) {
  const key = `${emoji}:${outline}`;
  if (urlCache.has(key)) return urlCache.get(key);

  const codepoints = [...emoji]
    .map(c => c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0'))
    .filter(cp => cp !== 'FE0F'); // quitar variation selector - OpenMoji no lo usa

  const style = outline ? 'black' : 'color';
  const url = `https://cdn.jsdelivr.net/npm/openmoji@15.1.0/${style}/svg/${codepoints.join('-')}.svg`;

  urlCache.set(key, url);
  return url;
}

export default function Em({ children, size, className = '', alt, outline = false }) {
  const emoji = String(children);
  const url = getOpenMojiUrl(emoji, outline);

  const sizeStyle = size
    ? typeof size === 'number'
      ? { width: `${size}px`, height: `${size}px` }
      : { width: size, height: size }
    : { width: '1.15em', height: '1.15em' };

  return (
    <img
      src={url}
      alt={alt ?? emoji}
      draggable={false}
      loading="lazy"
      className={`twemoji-img${className ? ` ${className}` : ''}`}
      style={{
        ...sizeStyle,
        display: 'inline-block',
        verticalAlign: '-0.2em',
        flexShrink: 0,
      }}
      // Fallback al emoji nativo si OpenMoji no lo tiene
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        const span = document.createElement('span');
        span.textContent = emoji;
        e.currentTarget.parentNode?.insertBefore(span, e.currentTarget);
      }}
    />
  );
}
