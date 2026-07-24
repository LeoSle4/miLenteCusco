import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../App';
import Em from './Em';

const CORRECT_PIN = '0306';

export default function PinScreen({ onSuccess }) {
  const [digits, setDigits] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [checking, setChecking] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    // Auto-focus primer input
    inputRefs[0].current?.focus();
  }, []);

  function handleChange(index, value) {
    // Solo dígitos
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    setError(false);

    if (digit && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Verificar automáticamente cuando se completan 4 dígitos
    if (digit && index === 3) {
      const pin = [...newDigits.slice(0, 3), digit].join('');
      checkPin(pin);
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasted.length === 4) {
      const newDigits = pasted.split('');
      setDigits(newDigits);
      inputRefs[3].current?.focus();
      checkPin(pasted);
    }
  }

  function checkPin(pin) {
    setChecking(true);
    setTimeout(() => {
      if (pin === CORRECT_PIN) {
        onSuccess();
      } else {
        setError(true);
        setShake(true);
        setDigits(['', '', '', '']);
        setChecking(false);
        inputRefs[0].current?.focus();
        setTimeout(() => setShake(false), 600);
      }
    }, 300);
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-crema px-6 py-12">
      {/* Pétalos decorativos de fondo — hechos con CSS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-10"
            style={{
              left: `${15 + i * 14}%`,
              top: `${10 + (i % 3) * 20}%`,
              transform: `rotate(${i * 30}deg)`,
            }}
          >
            <Em size={32}>🌸</Em>
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-xs">
        {/* Mascota */}
        <div className="animate-flotar mb-6">
          <img
            src="/mascota/pet_happy.png"
            alt="Mascota feliz"
            className="w-36 h-36 mascota-img"
          />
        </div>

        {/* Título */}
        <h1 className="font-serif-elegante text-3xl text-rosa-oscuro text-center mb-1">
          Mi Lente en Cusco
        </h1>
        <p className="font-manuscrita text-xl text-terracota text-center mb-8">
          tu álbum de viaje <Em>🌸</Em>
        </p>

        {/* Instrucción */}
        <p className="text-gris-calido text-sm text-center mb-6 font-sans">
          Ingresa tu PIN para continuar
        </p>

        {/* PIN inputs */}
        <div
          className={`flex gap-3 mb-4 ${shake ? 'animate-bounce' : ''}`}
          style={shake ? { animation: 'shake 0.5s ease' } : {}}
        >
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={inputRefs[i]}
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              className={`pin-input ${digit ? 'filled' : ''} ${error ? '!border-red-300' : ''}`}
              disabled={checking}
              aria-label={`Dígito ${i + 1} del PIN`}
              id={`pin-input-${i}`}
            />
          ))}
        </div>

        {/* Mensaje de error */}
        {error && (
          <p className="text-sm text-rosa-medio font-sans animate-fade-in mt-1">
            PIN incorrecto, inténtalo de nuevo
          </p>
        )}

        {/* Loading */}
        {checking && (
          <div className="mt-4 flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-rosa-principal animate-pulse-suave"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="absolute bottom-8 text-xs text-gris-calido text-center font-sans opacity-60">
        un proyecto hecho con <Em>💕</Em>
      </p>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
