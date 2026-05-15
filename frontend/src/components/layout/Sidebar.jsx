import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar({ open, onClose }) {
  const closeRef = useRef();

  useEffect(() => {
    if (open) { 
      closeRef.current?.focus(); 
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape' && open) onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <div className={`sidebar-overlay${open ? ' open' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside className={`sidebar${open ? ' open' : ''}`} role="complementary" aria-label="Бічна панель" aria-hidden={!open}>
        <div className="bg-primary px-6 py-5 flex items-center justify-between flex-shrink-0 z-10 relative">
          <div className="flex items-center gap-2 text-on-primary">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
            <span className="font-extrabold text-headline-md">HelpUA</span>
          </div>
          <button ref={closeRef} onClick={onClose} aria-label="Закрити" className="text-on-primary/80 hover:text-on-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-6 p-5 overflow-y-auto relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-[34.5%] opacity-5 pointer-events-none z-0">
            <span className="material-symbols-outlined text-[120px] text-outline select-none" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}>
              shield_person
            </span>
          </div>

          <div className="z-10 relative">
            <p className="text-xs font-bold tracking-widest text-outline uppercase mb-3">Швидка навігація</p>
            <nav className="flex flex-col gap-2">
              {[
                { to: '/services', icon: 'grid_view', label: 'Каталог послуг' },
                { to: '/apply', icon: 'description', label: 'Подати заявку' },
                { to: '/process', icon: 'checklist', label: 'Процес розгляду' },
                { to: '/contact', icon: 'phone', label: 'Контакти' },
              ].map(item => (
                <Link key={item.to} to={item.to} onClick={onClose} className="flex items-center gap-3 p-4 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container hover:text-primary transition-colors text-body-md font-medium">
                  <span className="material-symbols-outlined text-xl text-primary">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-auto z-10 relative">
            <p className="text-xs font-bold tracking-widest text-outline uppercase mb-3">Статистика порталу</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { num: '47к+', label: 'Заявок оброблено' },
                { num: '12', label: 'Видів послуг' },
                { num: '98%', label: 'Задоволених' },
                { num: '10 дн.', label: 'Середній розгляд' },
              ].map(s => (
                <div key={s.label} className="bg-surface-container-low border border-outline-variant rounded-xl p-3 text-center">
                  <div className="text-xl font-extrabold text-primary">{s.num}</div>
                  <div className="text-xs text-on-surface-variant mt-0.5 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="z-10 relative">
            <p className="text-xs font-bold tracking-widest text-outline uppercase mb-3">Підтримка</p>
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-4 flex flex-col gap-3">
              {[
                { icon: 'phone_in_talk', text: '0800 123 456', href: 'tel:+380800123456' },
                { icon: 'mail', text: 'support@helpua.gov.ua', href: 'mailto:support@helpua.gov.ua' },
                { icon: 'schedule', text: 'Пн–Пт: 08:00–20:00', href: null },
              ].map(c => (
                <div key={c.text} className="flex items-center gap-2 text-body-md text-on-surface">
                  <span className="material-symbols-outlined text-lg text-primary flex-shrink-0">{c.icon}</span>
                  {c.href ? <a href={c.href} className="text-primary font-medium hover:underline">{c.text}</a> : <span>{c.text}</span>}
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-2 z-10 relative">
            <Link to="/apply" onClick={onClose} className="flex items-center justify-center bg-primary text-on-primary font-bold text-label-bold py-3 rounded-xl hover:opacity-90 transition-opacity">
              Подати заявку онлайн
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
