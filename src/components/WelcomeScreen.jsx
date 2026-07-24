import { useNavigate } from 'react-router-dom';
import { getDiaActual } from '../data/itinerary';
import Em from './Em';

export default function WelcomeScreen({ onContinue }) {
  const navigate = useNavigate();
  const diaActual = getDiaActual();

  function handleContinue() {
    onContinue();
    navigate('/hoy');
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-between bg-gradient-to-b from-rosa-suave via-crema to-rosa-suave px-6 py-12 text-center">
      {/* Parte superior */}
      <div />

      {/* Contenido central */}
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        {/* Mascota grande flotando */}
        <div className="animate-flotar-lento">
          <img
            src="/mascota/pet_camera.png"
            alt="Mascota con cámara"
            className="w-52 h-52 mascota-img"
          />
        </div>

        {/* Títulos */}
        <div>
          <p className="font-manuscrita text-2xl text-terracota mb-1">bienvenida a tu</p>
          <h1 className="font-serif-elegante text-4xl font-semibold text-rosa-oscuro mb-3">
            Mi Lente en Cusco
          </h1>

          {/* Separador hairline */}
          <hr className="separador-hairline mx-auto w-32 mb-4" />

          <p className="font-manuscrita text-xl text-gris-calido leading-relaxed max-w-xs mx-auto">
            Cada foto que tomes aquí es un momento que elegiste guardar.
            Sin reglas, sin lista de tareas.
            Solo tú y lo que te hace feliz hoy. <Em>🌸</Em>
          </p>
        </div>

        {/* Info del viaje */}
        {diaActual !== null && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-rosa-principal/30">
            <Em size={20}>🗓️</Em>
            <span className="font-sans text-sm text-rosa-oscuro">
              {diaActual === null
                ? 'El viaje comienza pronto'
                : `Día ${diaActual} de 5`}
            </span>
          </div>
        )}

        {/* Botón */}
        <button
          onClick={handleContinue}
          id="btn-empezar-viaje"
          className="mt-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-rosa-principal to-rosa-medio text-white font-sans font-semibold text-base shadow-fab hover:shadow-polaroid-hover hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Empezar a capturar <Em>✨</Em>
        </button>
      </div>

      {/* Footer decorativo */}
      <p className="font-manuscrita text-gris-calido text-lg opacity-60">
        Cusco 2026 <Em>🏔️</Em>
      </p>
    </div>
  );
}
