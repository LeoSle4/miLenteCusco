// Fecha de inicio del viaje
export const FECHA_INICIO = new Date('2026-07-24T00:00:00');

// Retorna el día actual del viaje (1-based), o null si aún no ha comenzado / ya terminó
export function getDiaActual() {
  const hoy = new Date();
  const diff = Math.floor((hoy - FECHA_INICIO) / (1000 * 60 * 60 * 24));
  if (diff < 0) return null; // aún no comienza
  if (diff >= itinerario.length) return itinerario.length; // último día (para mostrar álbum)
  return diff + 1; // 1-based
}

// Sugerencias fotográficas por día del viaje a Cusco
export const itinerario = [
  {
    dia: 1,
    titulo: 'Llegada a Cusco',
    lugares: 'Plaza de Armas, Qorikancha, San Blas',
    descripcion: 'Primer día, sin prisa. Deja que Cusco te encuentre a ti.',
    retos: [
      {
        id: 'r1-1',
        texto: 'La Plaza de Armas, justo cuando la luz decide hacer algo bonito.',
        icono: 'sun',
      },
      {
        id: 'r1-2',
        texto: 'Una piedra inca que parece guardar más siglos de los que debería.',
        icono: 'mountain',
      },
      {
        id: 'r1-3',
        texto: 'Una calle de San Blas que se siente robada de otro tiempo.',
        icono: 'map-pin',
      },
    ],
  },
  {
    dia: 2,
    titulo: 'Valle Sagrado',
    lugares: 'Chinchero, Moray, Salineras, Ollantaytambo, Pisac',
    descripcion: 'Día largo, mucho paisaje. Nada es obligatorio, solo lo que se cruce en tu camino.',
    retos: [
      {
        id: 'r2-1',
        texto: 'Moray desde arriba, como un caracol gigante de tierra.',
        icono: 'circle-dashed',
      },
      {
        id: 'r2-2',
        texto: 'El blanco y el rosa de las Salineras, como si alguien hubiera derramado algo mágico.',
        icono: 'droplet',
      },
      {
        id: 'r2-3',
        texto: 'Algo en Pisac con un olor que se te va a quedar pegado a la memoria.',
        icono: 'shopping-bag',
      },
    ],
  },
  {
    dia: 3,
    titulo: 'La Montaña',
    lugares: 'Laguna Humantay o Vinicunca',
    descripcion: 'El día más físico del viaje. Aquí importa más el esfuerzo que la foto perfecta.',
    retos: [
      {
        id: 'r3-1',
        texto: 'Los colores de la montaña, apareciendo justo cuando llegas.',
        icono: 'photo',
      },
      {
        id: 'r3-2',
        texto: 'Tus propias huellas en el camino, la prueba de que sí se pudo.',
        icono: 'footprint',
      },
      {
        id: 'r3-3',
        texto: 'Ese segundo exacto en que por fin ves todo desde arriba.',
        icono: 'telescope',
      },
    ],
  },
  {
    dia: 4,
    titulo: 'La ciudad, piedra por piedra',
    lugares: "Sacsayhuamán, Q'enqo, Puca Pucara, Tambomachay, Cristo Blanco",
    descripcion: 'La ciudad entera te espera.',
    retos: [
      {
        id: 'r4-1',
        texto: 'Una piedra de Sacsayhuamán tan grande que da un poco de risa nerviosa.',
        icono: 'building',
      },
      {
        id: 'r4-2',
        texto: 'Cusco entero, chiquito, a tus pies desde el Cristo Blanco.',
        icono: 'panorama-horizontal',
      },
      {
        id: 'r4-3',
        texto: "Un rincón de Q'enqo, Puca Pucara o Tambomachay que nadie más va a notar.",
        icono: 'sparkles',
      },
    ],
  },
  {
    dia: 5,
    titulo: 'El último día',
    lugares: 'Mercado San Pedro, Piedra de los 12 Ángulos, Acueducto de Sapantiana',
    descripcion: 'Último día — guardas lo que quieras llevarte.',
    retos: [
      {
        id: 'r5-1',
        texto: 'Los colores del Mercado San Pedro, un caos hermoso.',
        icono: 'palette',
      },
      {
        id: 'r5-2',
        texto: 'La Piedra de los 12 Ángulos, de cerca, como se merece.',
        icono: 'hexagon',
      },
      {
        id: 'r5-3',
        texto: 'Algo pequeño que decidiste llevarte de recuerdo.',
        icono: 'heart',
      },
    ],
  },
];

export default itinerario;
