import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccessibility } from '../../context/AccessibilityContext';
import { showToast } from '../ui/Toast';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { highContrast, setHighContrast } = useAccessibility();
  
  const { user } = useAuth();

  const toggleContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    showToast(next ? 'Темну тему увімкнено' : 'Світлу тему увімкнено');
  };

  const mobileNavItems = [
    { to: '/services', icon: 'grid_view', label: 'Послуги' },
    { to: '/apply', icon: 'description', label: 'Подати заявку' },
    { to: '/process', icon: 'checklist', label: 'Процес' },
    { to: '/contact', icon: 'phone', label: 'Контакти' },
    ...(user?.role === 'admin' ? [{ to: '/admin', icon: 'admin_panel_settings', label: 'Адмін' }] : []),
    user 
      ? { to: '/dashboard', icon: 'account_circle', label: user.firstName || 'Кабінет' } 
      : { to: '/login', icon: 'login', label: 'Увійти' }
  ];

  return (
    <>
      <header className="bg-surface border-b border-outline-variant sticky top-0 z-50" role="banner">
        <div className="flex justify-between items-center w-full px-5 md:px-16 max-w-container-max mx-auto h-16">
          <Link to="/" className="flex items-center gap-2 text-primary font-extrabold text-headline-md" aria-label="HelpUA — перейти на головну">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
            HelpUA
          </Link>

          <nav className="hidden md:flex items-center gap-6" aria-label="Головна навігація">
            <Link to="/services" className="text-on-surface-variant text-body-md hover:text-primary transition-colors">Послуги</Link>
            <Link to="/apply" className="text-on-surface-variant text-body-md hover:text-primary transition-colors">Подати заявку</Link>
            <Link to="/process" className="text-on-surface-variant text-body-md hover:text-primary transition-colors">Процес</Link>
            <Link to="/contact" className="text-on-surface-variant text-body-md hover:text-primary transition-colors">Контакти</Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleContrast}
              aria-label={highContrast ? 'Вимкнути темну тему' : 'Увімкнути темну тему'}
              aria-pressed={highContrast}
              title={highContrast ? 'Світла тема' : 'Темна тема'}
              className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg border border-outline-variant hover:bg-surface-variant transition-colors text-on-surface-variant hover:text-primary"
            >
              <span className="material-symbols-outlined text-xl">
                {highContrast ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            <div className="hidden md:block w-px h-6 bg-outline-variant mx-1" />

            {user?.role === 'admin' && (
              <Link to="/admin"
                className="hidden md:inline-flex items-center justify-center h-9 px-3 text-on-surface-variant text-body-md font-medium hover:text-primary border border-outline-variant rounded-lg transition-colors gap-1.5">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
                <span className="text-sm">Адмін</span>
              </Link>
            )}

            {user ? (
              <Link to="/dashboard"
                className="hidden md:inline-flex items-center justify-center h-9 px-4 text-on-surface-variant text-body-md font-medium hover:text-primary border border-outline-variant rounded-lg transition-colors gap-2">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
                {user.firstName}
              </Link>
            ) : (
              <Link to="/login"
                className="hidden md:inline-flex items-center justify-center h-9 px-4 text-on-surface-variant text-body-md font-medium hover:text-primary border border-outline-variant rounded-lg transition-colors">
                Увійти
              </Link>
            )}

            <Link
              to="/apply"
              className="inline-flex items-center justify-center h-9 px-4 bg-primary text-on-primary font-bold text-label-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              Подати заявку
            </Link>

            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Відкрити бічну панель"
              aria-expanded={sidebarOpen}
              className="hidden md:flex items-center justify-center w-9 h-9 border border-outline-variant rounded-lg hover:bg-surface-variant transition-colors text-on-surface-variant hover:text-primary"
            >
              <span className="material-symbols-outlined text-xl">menu_open</span>
            </button>

            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Відкрити меню"
              aria-expanded={mobileOpen}
              className="md:hidden flex items-center justify-center w-9 h-9 border border-outline-variant rounded-lg text-on-surface-variant"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end"
          role="dialog" aria-label="Мобільне меню" aria-modal="true"
          onClick={e => { if (e.target === e.currentTarget) setMobileOpen(false); }}
        >
          <nav className="bg-surface h-full w-full p-6 flex flex-col gap-2 shadow-xl overflow-y-auto">
            <button
              onClick={() => setMobileOpen(false)}
              className="self-end mb-2 w-9 h-9 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant"
              aria-label="Закрити меню"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            
            {mobileNavItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 p-4 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container hover:text-primary transition-colors text-body-md font-medium"
              >
                <span className="material-symbols-outlined text-xl text-primary">{item.icon}</span>
                {item.label}
              </Link>
            ))}

            <div className="mt-auto pt-4 border-t border-outline-variant flex">
              <button
                onClick={toggleContrast}
                aria-pressed={highContrast}
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-outline-variant rounded-xl text-on-surface-variant hover:bg-surface-variant transition-colors text-sm font-medium"
              >
                <span className="material-symbols-outlined text-lg">{highContrast ? 'light_mode' : 'dark_mode'}</span>
                {highContrast ? 'Світла тема' : 'Темна тема'}
              </button>
            </div>
          </nav>
        </div>
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
