import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import PinScreen from './components/PinScreen';
import WelcomeScreen from './components/WelcomeScreen';
import DayScreen from './components/DayScreen';
import GalleryScreen from './components/GalleryScreen';
import AlbumScreen from './components/AlbumScreen';
import BottomNav from './components/BottomNav';
import PetalRain from './components/PetalRain';
import { iniciarSincronizacion } from './lib/fotos';

// ── Context de autenticación ──────────────────────────────────────────
const AuthContext = createContext(null);

function useAuth() {
  return useContext(AuthContext);
}

const PIN_KEY = 'mlc_pin_verified';
const WELCOME_SEEN_KEY = 'mlc_welcome_seen';

// ── Layout con nav inferior ───────────────────────────────────────────
function AppLayout({ children }) {
  const location = useLocation();
  const showNav = ['/hoy', '/galeria'].includes(location.pathname);

  return (
    <div className="app-container relative min-h-dvh bg-crema">
      <div className={showNav ? 'pb-20' : ''}>
        {children}
      </div>
      {showNav && <BottomNav />}
    </div>
  );
}

// ── Rutas protegidas ──────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { isAuthed } = useAuth();
  return isAuthed ? children : <Navigate to="/" replace />;
}

// ── App principal ─────────────────────────────────────────────────────
export default function App() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const pinOk = localStorage.getItem(PIN_KEY) === 'true';
    const welcomeOk = localStorage.getItem(WELCOME_SEEN_KEY) === 'true';
    setIsAuthed(pinOk);
    setHasSeenWelcome(welcomeOk);
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    return iniciarSincronizacion();
  }, []);

  function handlePinSuccess() {
    localStorage.setItem(PIN_KEY, 'true');
    setIsAuthed(true);
  }

  function handleWelcomeDone() {
    localStorage.setItem(WELCOME_SEEN_KEY, 'true');
    setHasSeenWelcome(true);
  }

  // Evita que una recarga directa en /galeria o /album rebote a /hoy mientras
  // se lee el estado de autenticación guardado en localStorage.
  if (!authChecked) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthed, hasSeenWelcome, handlePinSuccess, handleWelcomeDone }}>
      <BrowserRouter>
        <PetalRain />
        <AppLayout>
          <Routes>
            {/* Entrada: PIN */}
            <Route
              path="/"
              element={
                isAuthed
                  ? <Navigate to={hasSeenWelcome ? '/hoy' : '/bienvenida'} replace />
                  : <PinScreen onSuccess={handlePinSuccess} />
              }
            />

            {/* Bienvenida */}
            <Route
              path="/bienvenida"
              element={
                <ProtectedRoute>
                  <WelcomeScreen onContinue={handleWelcomeDone} />
                </ProtectedRoute>
              }
            />

            {/* Día actual */}
            <Route
              path="/hoy"
              element={
                <ProtectedRoute>
                  <DayScreen />
                </ProtectedRoute>
              }
            />

            {/* Galería */}
            <Route
              path="/galeria"
              element={
                <ProtectedRoute>
                  <GalleryScreen />
                </ProtectedRoute>
              }
            />

            {/* Álbum final */}
            <Route
              path="/album"
              element={
                <ProtectedRoute>
                  <AlbumScreen />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
