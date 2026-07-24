import { useState, useRef, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import Cropper from 'react-easy-crop';
import MoodPicker from './MoodPicker';
import { guardarFoto } from '../lib/fotos';
import { extraerRecorte, RATIOS } from '../lib/imageUtils';
import Em from './Em';

// Formatos disponibles
const FORMATOS = [
  {
    id: 'vertical',
    label: 'Vertical',
    ratio: '9:16',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="2" width="12" height="20" rx="2" />
      </svg>
    ),
    aspectClass: 'aspect-[9/16]',
    previewStyle: { aspectRatio: '9/16', maxHeight: '280px' },
    hint: 'Para retratos y momentos verticales',
  },
  {
    id: 'cuadrado',
    label: 'Cuadrado',
    ratio: '1:1',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    ),
    aspectClass: 'aspect-square',
    previewStyle: { aspectRatio: '1/1', maxHeight: '240px' },
    hint: 'Clásico, perfecto para detalles',
  },
  {
    id: 'horizontal',
    label: 'Horizontal',
    ratio: '16:9',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
      </svg>
    ),
    aspectClass: 'aspect-video',
    previewStyle: { aspectRatio: '16/9', maxHeight: '200px' },
    hint: 'Para paisajes y panorámicas',
  },
];

export default function UploadModal({ onClose, onSaved, diaActual, retos, retoPreseleccionado }) {
  const [step, setStep] = useState('formato'); // 'formato' | 'foto'
  const [formato, setFormato] = useState(null);
  const [rawPreview, setRawPreview] = useState(null); // foto comprimida, sin recortar aún
  const [croppedFile, setCroppedFile] = useState(null); // resultado final ya recortado
  const [croppedPreview, setCroppedPreview] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [nota, setNota] = useState('');
  const [mood, setMood] = useState(null);
  const [retoId, setRetoId] = useState(retoPreseleccionado || '__libre__');
  const [compressing, setCompressing] = useState(false);
  const [cropping, setCropping] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef();

  function handleFormatoSelect(fmt) {
    setFormato(fmt);
    setStep('foto');
  }

  async function handleFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;

    setCompressing(true);
    setError('');

    try {
      // Comprime primero conservando buena resolución (además corrige la orientación EXIF
      // de las fotos del iPhone). El recorte lo hace ella misma en el paso siguiente.
      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 2000,
        initialQuality: 0.9,
        useWebWorker: true,
      };
      const compressed = await imageCompression(f, options);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setCroppedFile(null);
      setCroppedPreview(null);
      setRawPreview(URL.createObjectURL(compressed));
    } catch (err) {
      setError('No se pudo procesar la imagen. Intenta de nuevo.');
    } finally {
      setCompressing(false);
    }
  }

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  async function confirmarRecorte() {
    if (!rawPreview || !croppedAreaPixels) return;
    setCropping(true);
    setError('');
    try {
      const blob = await extraerRecorte(rawPreview, croppedAreaPixels);
      setCroppedFile(blob);
      setCroppedPreview(URL.createObjectURL(blob));
    } catch (err) {
      setError('No se pudo recortar la imagen. Intenta de nuevo.');
    } finally {
      setCropping(false);
    }
  }

  function retomarFoto() {
    setRawPreview(null);
    setCroppedFile(null);
    setCroppedPreview(null);
  }

  async function handleSave() {
    if (!croppedFile) {
      setError('Selecciona y ajusta una foto primero.');
      return;
    }

    setSaving(true);
    try {
      await guardarFoto({
        file: croppedFile,
        dia: diaActual,
        retoId: retoId === '__libre__' ? null : retoId,
        nota: nota.trim(),
        mood,
        formato: formato?.id || 'cuadrado',
      });
      onSaved();
      onClose();
    } catch (err) {
      setError('Hubo un problema al guardar. Inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  const formatoActual = formato || FORMATOS[1];
  const ratioActual = RATIOS[formatoActual.id] || RATIOS.cuadrado;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        {/* Handle drag */}
        <div className="w-10 h-1 rounded-full bg-gris-calido/30 mx-auto mb-4" />

        {/* ── PASO 1: Selector de formato ─────────────────────────── */}
        {step === 'formato' && (
          <div className="step-animate">
            {/* Cabecera */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-serif-elegante text-2xl text-rosa-oscuro">
                ¿Qué formato?
              </h2>
              <button
                onClick={onClose}
                id="btn-cerrar-modal-formato"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-rosa-suave text-gris-calido hover:bg-rosa-principal/20 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="font-manuscrita text-base text-gris-calido mb-6">
              Elige cómo quieres capturar este momento <Em>✨</Em>
            </p>

            {/* Cards de formato */}
            <div className="flex gap-3 mb-6">
              {FORMATOS.map((fmt) => (
                <button
                  key={fmt.id}
                  id={`fmt-btn-${fmt.id}`}
                  onClick={() => handleFormatoSelect(fmt)}
                  className="flex-1 flex flex-col items-center gap-2.5 py-5 px-2 rounded-2xl border-2 border-rosa-principal/30 bg-white hover:border-rosa-principal hover:bg-rosa-suave active:scale-95 transition-all duration-200 group"
                >
                  {/* Ícono de forma */}
                  <div className="text-rosa-oscuro/50 group-hover:text-rosa-principal transition-colors">
                    {fmt.icon}
                  </div>

                  {/* Preview mini del ratio */}
                  <div
                    className="bg-gradient-to-br from-rosa-suave to-crema border border-rosa-principal/20 rounded-lg overflow-hidden flex-shrink-0"
                    style={{
                      width: fmt.id === 'vertical' ? '28px' : fmt.id === 'cuadrado' ? '40px' : '56px',
                      height: fmt.id === 'vertical' ? '50px' : fmt.id === 'cuadrado' ? '40px' : '32px',
                    }}
                  />

                  {/* Labels */}
                  <div className="text-center">
                    <p className="font-sans text-sm font-semibold text-rosa-oscuro">{fmt.label}</p>
                    <p className="font-sans text-xs text-gris-calido">{fmt.ratio}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Hint */}
            <p className="font-manuscrita text-sm text-gris-calido/70 text-center italic">
              Puedes cambiar el recorte después de tomar la foto
            </p>
          </div>
        )}

        {/* ── PASO 2: Foto + detalles ─────────────────────────────── */}
        {step === 'foto' && (
          <div className="step-animate">
            {/* Título con botón atrás */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setStep('formato'); retomarFoto(); }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-rosa-suave text-gris-calido hover:bg-rosa-principal/20 transition-colors"
                  id="btn-volver-formato"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M19 12H5M12 5l-7 7 7 7" />
                  </svg>
                </button>
                <div>
                  <h2 className="font-serif-elegante text-2xl text-rosa-oscuro leading-none">
                    Subir foto
                  </h2>
                  <span className="inline-flex items-center gap-1 text-xs text-gris-calido font-sans">
                    <span className="w-2 h-2 rounded-sm bg-rosa-principal/40 inline-block" />
                    {formatoActual.label} · {formatoActual.ratio}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                id="btn-cerrar-modal"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-rosa-suave text-gris-calido hover:bg-rosa-principal/20 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Zona de foto */}
            <div className="mb-4">
              {croppedPreview ? (
                // Recorte ya confirmado
                <div className="relative w-full overflow-hidden rounded-2xl border border-rosa-principal/20" style={formatoActual.previewStyle}>
                  <img
                    src={croppedPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={retomarFoto}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-rosa-oscuro shadow"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : rawPreview ? (
                // Ella ajusta el recorte: arrastra para mover, desliza para hacer zoom
                <div>
                  <div
                    className="relative w-full overflow-hidden rounded-2xl border border-rosa-principal/20 bg-black"
                    style={formatoActual.previewStyle}
                  >
                    <Cropper
                      image={rawPreview}
                      crop={crop}
                      zoom={zoom}
                      aspect={ratioActual}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                      objectFit="contain"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-gris-calido flex-shrink-0">
                      <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                    </svg>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.01}
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="flex-1 accent-rosa-principal"
                      id="input-zoom"
                    />
                  </div>
                  <p className="font-manuscrita text-sm text-gris-calido/70 text-center italic mt-1">
                    Arrastra para acomodar, desliza para hacer zoom
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={retomarFoto}
                      className="flex-1 py-3 rounded-xl border border-rosa-principal/30 text-gris-calido font-sans text-sm font-semibold hover:bg-rosa-suave/50 transition-colors"
                    >
                      Cambiar foto
                    </button>
                    <button
                      onClick={confirmarRecorte}
                      disabled={cropping || !croppedAreaPixels}
                      id="btn-confirmar-recorte"
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rosa-principal to-rosa-medio text-white font-sans text-sm font-semibold disabled:opacity-50 transition-all"
                    >
                      {cropping ? 'Ajustando…' : 'Usar este recorte'}
                    </button>
                  </div>
                </div>
              ) : (
                // Todavía no eligió foto
                <button
                  onClick={() => inputRef.current?.click()}
                  id="btn-seleccionar-foto"
                  className="w-full rounded-2xl border-2 border-dashed border-rosa-principal/50 bg-rosa-suave flex flex-col items-center justify-center gap-2 text-rosa-oscuro/60 hover:bg-rosa-suave/80 hover:border-rosa-principal transition-all"
                  style={{ ...formatoActual.previewStyle, minHeight: '160px' }}
                  disabled={compressing}
                >
                  {compressing ? (
                    <>
                      <div className="w-6 h-6 rounded-full border-2 border-rosa-principal border-t-transparent animate-spin" />
                      <span className="font-sans text-sm">Comprimiendo…</span>
                    </>
                  ) : (
                    <>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <circle cx="12" cy="12" r="3.5" />
                        <circle cx="17.5" cy="8" r="1" fill="currentColor" stroke="none" />
                      </svg>
                      <span className="font-sans text-sm font-semibold">Toca para elegir foto</span>
                      <span className="font-sans text-xs opacity-60">desde cámara o galería</span>
                    </>
                  )}
                </button>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
                id="input-foto"
              />
            </div>

            {/* Con qué se relaciona la foto */}
            <div className="mb-4">
              <p className="font-sans text-xs text-gris-calido mb-2 font-semibold uppercase tracking-wide">
                ¿Se cruzó con alguno de estos?
              </p>
              <div className="flex flex-col gap-1.5">
                {retos.map((reto) => (
                  <button
                    key={reto.id}
                    id={`reto-btn-${reto.id}`}
                    onClick={() => setRetoId(reto.id)}
                    className={`text-left px-3 py-2.5 rounded-xl border text-sm font-sans transition-all ${
                      retoId === reto.id
                        ? 'border-rosa-principal bg-rosa-suave text-rosa-oscuro font-semibold'
                        : 'border-rosa-principal/20 bg-white text-gris-calido hover:bg-rosa-suave/50'
                    }`}
                  >
                    {reto.texto}
                  </button>
                ))}
                <button
                  id="reto-btn-libre"
                  onClick={() => setRetoId('__libre__')}
                  className={`text-left px-3 py-2.5 rounded-xl border text-sm font-sans transition-all ${
                    retoId === '__libre__'
                      ? 'border-rosa-principal bg-rosa-suave text-rosa-oscuro font-semibold'
                      : 'border-dashed border-rosa-principal/30 bg-transparent text-gris-calido hover:bg-rosa-suave/30'
                  }`}
                >
                  <Em size={20}>💫</Em> Espacio libre
                </button>
              </div>
            </div>

            {/* Nota */}
            <div className="mb-4">
              <p className="font-sans text-xs text-gris-calido mb-2 font-semibold uppercase tracking-wide">
                Una nota (opcional)
              </p>
              <textarea
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                placeholder="Lo que sentiste en ese momento…"
                maxLength={200}
                rows={3}
                id="input-nota"
                className="w-full px-4 py-3 rounded-xl border border-rosa-principal/30 bg-white font-manuscrita text-lg text-rosa-oscuro placeholder-gris-calido/50 outline-none focus:border-rosa-principal focus:ring-2 focus:ring-rosa-principal/20 resize-none transition-all"
              />
              <p className="text-right text-xs text-gris-calido/50 mt-1">{nota.length}/200</p>
            </div>

            {/* Mood */}
            <div className="mb-5">
              <MoodPicker selected={mood} onSelect={setMood} />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-rosa-medio font-sans mb-3 text-center animate-fade-in">
                {error}
              </p>
            )}

            {/* Botón guardar */}
            <button
              onClick={handleSave}
              disabled={saving || compressing || !croppedFile}
              id="btn-guardar-foto"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rosa-principal to-rosa-medio text-white font-sans font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-fab active:scale-95 transition-all duration-200"
            >
              {saving ? 'Guardando…' : <>Guardar foto <Em>✨</Em></>}
            </button>

            {/* Indicador offline */}
            <div className="mt-3 flex justify-center">
              <div className="offline-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 2v6M12 16v6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M16 12h6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24" />
                </svg>
                Si no hay señal, se guardará y subirá sola al volver la conexión
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
