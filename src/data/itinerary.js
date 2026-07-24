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

// Retos por día del viaje a Cusco
export const itinerario = [
  {
    dia: 1,
    titulo: 'Llegada a Cusco',
    lugares: 'Plaza de Armas · Qorikancha · San Blas',
    descripcion: 'Primer día, sin prisa. Deja que Cusco te encuentre a ti.',
    retos: [
      {
        id: 'r1-1',
        texto: 'La plaza cuando la luz hace algo que no esperabas.',
        icono: 'sun',
      },
      {
        id: 'r1-2',
        texto: 'Una piedra que se siente más vieja que el tiempo.',
        icono: 'mountain',
      },
      {
        id: 'r1-3',
        texto: 'Una calle que parece de otra época.',
        icono: 'map-pin',
      },
    ],
  },
  {
    dia: 2,
    titulo: 'Valle Sagrado',
    lugares: 'Chinchero · Moray · Salineras · Ollantaytambo · Pisac',
    descripcion: 'Día largo, mucho paisaje. Nada es obligatorio, solo lo que se cruce en tu camino.',
    retos: [
      {
        id: 'r2-1',
        texto: 'Moray visto desde arriba.',
        icono: 'circle-dashed',
      },
      {
        id: 'r2-2',
        texto: 'El blanco y el rosa de las Salineras.',
        icono: 'droplet',
      },
      {
        id: 'r2-3',
        texto: 'Algo en Pisac que quieras recordar.',
        icono: 'shopping-bag',
      },
    ],
  },
  {
    dia: 3,
    titulo: 'La Montaña',
    lugares: 'Laguna Humantay o Vinicunca',
    descripcion: 'El día más físico del viaje. Los retos celebran el esfuerzo, no la foto perfecta.',
    retos: [
      {
        id: 'r3-1',
        texto: 'Los colores que te esperaron al llegar.',
        icono: 'photo',
      },
      {
        id: 'r3-2',
        texto: 'El camino que ya quedó atrás.',
        icono: 'footprint',
      },
      {
        id: 'r3-3',
        texto: 'El momento en que por fin lo ves todo.',
        icono: 'telescope',
      },
    ],
  },
  {
    dia: 4,
    titulo: 'City Tour',
    lugares: "Sacsayhuamán · Q'enqo · Puca Pucara · Tambomachay · Cristo Blanco",
    descripcion: 'La ciudad entera te espera.',
    retos: [
      {
        id: 'r4-1',
        texto: 'Una piedra de Sacsayhuamán que no cabe en el plano.',
        icono: 'building',
      },
      {
        id: 'r4-2',
        texto: 'Cusco desde arriba, todo junto.',
        icono: 'panorama-horizontal',
      },
      {
        id: 'r4-3',
        texto: 'Un rincón que solo tú notaste.',
        icono: 'sparkles',
      },
    ],
  },
  {
    dia: 5,
    titulo: 'El último día',
    lugares: 'Mercado San Pedro · Piedra de los 12 Ángulos · Acueducto de Sapantiana',
    descripcion: 'Último día — guardas lo que quieras llevarte.',
    retos: [
      {
        id: 'r5-1',
        texto: 'Un color del mercado que no existe en otro lado.',
        icono: 'palette',
      },
      {
        id: 'r5-2',
        texto: 'La Piedra de los 12 Ángulos, de cerca.',
        icono: 'hexagon',
      },
      {
        id: 'r5-3',
        texto: 'Lo último que decidiste guardar.',
        icono: 'heart',
      },
    ],
  },
];

export default itinerario;
