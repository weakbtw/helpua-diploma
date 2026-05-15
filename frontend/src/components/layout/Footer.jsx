import { useState } from 'react';
import { Link } from 'react-router-dom';

function AccessibilityModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-surface rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-outline-variant">
        
        <div className="bg-primary text-on-primary p-8 rounded-t-2xl flex items-start justify-between gap-6 sticky top-0 z-10">
          <div>
            <h2 id="modal-title" className="font-bold text-3xl tracking-tight">Заява про доступність</h2>
            <p className="text-base opacity-85 mt-2">HelpUA — Портал соціальних послуг</p>
          </div>
          <button onClick={onClose} aria-label="Закрити" className="text-on-primary/70 hover:text-on-primary transition-colors">
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="flex items-center gap-4 bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="w-3.5 h-3.5 rounded-full bg-green-500 flex-shrink-0 animate-pulse" />
            <span className="text-base font-bold text-green-900">Частково відповідає WCAG 2.1 рівню AA</span>
          </div>

          <section>
            <h3 className="text-sm font-black tracking-widest uppercase text-primary mb-4 border-b border-outline-variant pb-2">Що реалізовано</h3>
            <ul className="text-base text-on-surface-variant space-y-3">
              {[
                'Повна навігація за допомогою клавіатури',
                'Видимий та чіткий індикатор фокусу',
                'Спеціальні посилання для пропуску навігації',
                'ARIA-атрибути для екранних читців',
                'Контрастність тексту згідно з вимогами 4.5:1',
                'Логічна семантична структура HTML-розмітки'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-black tracking-widest uppercase text-primary mb-4 border-b border-outline-variant pb-2">Зворотній зв'язок</h3>
            <p className="text-base text-on-surface-variant leading-relaxed">
              Ми постійно працюємо над покращенням доступності нашого сервісу. Якщо у вас виникли труднощі або є пропозиції, будь ласка, зв'яжіться з нами:
            </p>
            <div className="mt-4 p-4 bg-surface-container rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">mail</span>
              <span className="text-base font-medium text-on-surface">Email:</span>
              <a href="mailto:a11y@helpua.gov.ua" className="text-base text-primary font-bold underline hover:no-underline transition-all">
                a11y@helpua.gov.ua
              </a>
            </div>
          </section>
        </div>

        <div className="border-t border-outline-variant p-6 bg-surface-variant/30 flex justify-between items-center rounded-b-2xl">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-outline uppercase tracking-tight">Стандарт безпеки</span>
            <span className="text-sm text-on-surface-variant">Директива ЄС 2016/2102</span>
          </div>
          <button 
            onClick={onClose} 
            className="text-base font-bold text-on-primary bg-primary rounded-xl px-8 py-3 hover:opacity-90 shadow-md transition-all active:scale-95"
          >
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const [modalOpen, setModalOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-surface-dim border-t border-outline-variant mt-auto" role="contentinfo">
        <div className="max-w-container-max mx-auto px-5 md:px-16 py-16">
          <div className="flex flex-col md:flex-row justify-between gap-12">
            
            <div className="flex flex-col gap-4 max-w-xs">
              <Link to="/" className="flex items-center gap-2 font-extrabold text-headline-md text-on-surface">
                <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
                HelpUA
              </Link>
              <p className="text-sm text-on-surface-variant leading-relaxed">Дипломний проєкт зі спеціальності 121 «ІПЗ». Адаптивна вебсистема соціальних послуг з підтримкою WCAG 2.1.</p>
              <div className="flex gap-2 flex-wrap mt-2">
                {['WCAG 2.1 AA', 'Адаптивний', 'GDPR'].map(b => (
                  <span key={b} className="text-xs font-bold border border-outline-variant bg-surface rounded-full px-3 py-1 text-on-surface-variant">{b}</span>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col sm:flex-row justify-between gap-8 md:gap-12 lg:ml-12">
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold tracking-widest uppercase text-primary mb-1">Послуги</h4>
                {['Пенсійне забезпечення', 'Субсидія на житло', 'Підтримка сімей', 'Медичні пільги'].map(s => (
                  <Link key={s} to="/services" className="text-sm text-on-surface-variant hover:text-primary transition-colors">{s}</Link>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold tracking-widest uppercase text-primary mb-1">Навігація</h4>
                <Link to="/apply" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Подати заявку</Link>
                <Link to="/process" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Процес розгляду</Link>
                <Link to="/contact" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Контакти</Link>
                <Link to="/login" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Особистий кабінет</Link>
              </div>
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold tracking-widest uppercase text-primary mb-1">Юридичне</h4>
                <button onClick={() => setModalOpen(true)} className="text-sm text-on-surface-variant hover:text-primary transition-colors text-left underline">Заява про доступність</button>
                <a href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors underline">Політика конфіденційності</a>
                <a href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors underline">Умови використання</a>
              </div>
            </div>
            
          </div>

          <div className="border-t border-outline-variant mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant">
            <span>© 2026 HelpUA — Дипломний проєкт. Спеціальність 121 «ІПЗ»</span>
            
            <div className="flex items-center gap-4 md:gap-8">
              <span>Розроблено з дотриманням WCAG 2.1 рівня AA</span>
              
              <button 
                onClick={scrollToTop}
                aria-label="Повернутися на початок сторінки"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-surface border border-outline-variant hover:bg-surface-variant hover:text-primary transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-2xl">arrow_upward</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
      {modalOpen && <AccessibilityModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
