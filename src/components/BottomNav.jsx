import { useLocation, useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    {
      id: 'hoy',
      label: 'Hoy',
      path: '/hoy',
      icon: (active) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ),
    },
    {
      id: 'galeria',
      label: 'Galería',
      path: '/galeria',
      icon: (active) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="bottom-nav">
      <div className="flex justify-around items-center h-16 px-8">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.id}
              id={`nav-${tab.id}`}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 px-6 py-2 rounded-xl transition-all duration-200 ${
                active
                  ? 'text-rosa-principal'
                  : 'text-gris-calido hover:text-rosa-principal/70'
              }`}
            >
              <div className={`transition-transform duration-200 ${active ? 'scale-110' : 'scale-100'}`}>
                {tab.icon(active)}
              </div>
              <span
                className={`text-xs font-sans font-semibold transition-all duration-200 ${
                  active ? 'text-rosa-principal' : 'text-gris-calido'
                }`}
              >
                {tab.label}
              </span>
              {active && (
                <div className="w-1 h-1 rounded-full bg-rosa-principal mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
