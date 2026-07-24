import { useEffect, useState } from 'react';

export default function PetalRain() {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    // Generar 8 pétalos con posiciones y tiempos aleatorios
    const generated = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 90 + 5}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${8 + Math.random() * 6}s`,
      size: 8 + Math.random() * 10,
    }));
    setPetals(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((p) => (
        <svg
          key={p.id}
          viewBox="0 0 24 24"
          width={p.size}
          height={p.size}
          style={{
            position: 'absolute',
            left: p.left,
            top: '-20px',
            animation: `petalCaer ${p.duration} ${p.delay} linear infinite`,
          }}
        >
          <ellipse cx="12" cy="12" rx="6" ry="10" fill="#F3AFC7" opacity="0.35" transform={`rotate(${Math.random() * 60} 12 12)`} />
        </svg>
      ))}
    </div>
  );
}
