// Fecha de inicio del viaje
export const FECHA_INICIO = new Date('2026-07-24T00:00:00');

// Retorna el día actual del viaje (1-based), o null si aún no ha comenzado / ya terminó
export function getDiaActual() {
  const hoy = new Date();
  const diff = Math.floor((hoy - FECHA_INICIO) / (1000 * 60 * 60 * 24));
  if (diff < 0) return null; // aún no comienza
  if (diff >= itinerario.length) return itinerario.length + 1; // viaje terminado (activa el álbum)
  return diff + 1; // 1-based
}

// Sugerencias fotográficas por día del viaje a Cusco
export const itinerario = [
  {
    dia: 1,
    titulo: 'Bienvenida a Cusco!',
    lugares: 'Hoy verás la Plaza de Armas, Qorikancha, San Blas',
    descripcion: 'Es el primer día no tengas prisa. Deja que Cusco te encuentre a ti.',
    retos: [
      {
        id: 'r1-1',
        texto: 'Si el día esta soleado busca un lugar donde la luz de un planazo a algo que encuentres en la plaza.',
        icono: 'sun',
      },
      {
        id: 'r1-2',
        texto: 'Lo mas llamativo que veas de Qorikancha o sus alrededores.',
        icono: 'mountain',
      },
      {
        id: 'r1-3',
        texto: 'Una calle de San Blas que te haga sentir que estas viajando en el tiempo.',
        icono: 'map-pin',
      },
    ],
  },
  {
    dia: 2,
    titulo: 'Valle Sagrado',
    lugares: 'Hoy verás, Chinchero, Moray, Salineras, Ollantaytambo, Pisac',
    descripcion: 'Día largo, mucho paisaje, tomalo con calma, y déjate llevar por lo que encuentres.',
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
        texto: 'Algo en Pisac con un olor que se te va a quedar pegado a la memoria, como el perfume de tu miss de kinder.',
        icono: 'shopping-bag',
      },
    ],
  },
  {
    dia: 3,
    titulo: 'Misterio',
    lugares: 'Por descubrir...',
    descripcion: 'Día para solo fluir.',
    retos: [],
  },
  {
    dia: 4,
    titulo: 'Día de ciudadana cusqueño',
    lugares: "Explorarás Sacsayhuamán, Q'enqo, Puca Pucara, Tambomachay, Cristo Blanco",
    descripcion: '',
    retos: [
      {
        id: 'r4-1',
        texto: 'La piedra que mas te llame la atención de Sacsayhuamán.',
        icono: 'building',
      },
      {
        id: 'r4-2',
        texto: 'Cusco entero, chiquito, desde el Cristo Blanco.',
        icono: 'panorama-horizontal',
      },
      {
        id: 'r4-3',
        texto: "Algo que no veria normalmente una fresita en su día.",
        icono: 'sparkles',
      },
    ],
  },
  {
    dia: 5,
    titulo: 'Last day',
    lugares: 'Mercado San Pedro, Piedra de los 12 Ángulos, Acueducto de Sapantiana',
    descripcion: 'Último día — guardas lo que quieras llevarte.',
    retos: [
      {
        id: 'r5-1',
        texto: 'Como despertó Cusco para despedirse de ti.',
        icono: 'palette',
      },
      {
        id: 'r5-2',
        texto: 'La Piedra de los 12 Ángulos.',
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

// Texto de la sugerencia que una foto cumplió, o null si fue del espacio libre.
export function obtenerTextoReto(dia, retoId) {
  if (!retoId) return null;
  const diaData = itinerario.find((d) => d.dia === dia);
  const reto = diaData?.retos.find((r) => r.id === retoId);
  return reto?.texto || null;
}

export default itinerario;
