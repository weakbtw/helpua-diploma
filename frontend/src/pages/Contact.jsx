import { feedbackApi } from '../api/feedbackApi.js';
import { useState } from 'react';
import { showToast } from '../components/ui/toastEvent';

const contacts = [
  { icon: 'support_agent', title: 'Гаряча лінія', desc: 'Цілодобова підтримка для термінових питань.', value: '0 800 123 456', href: 'tel:+380800123456', dark: false },
  { icon: 'mail', title: 'Електронна пошта', desc: 'Надішліть запитання або документи для розгляду.', value: 'support@helpua.gov.ua', href: 'mailto:support@helpua.gov.ua', dark: false },
  { icon: 'live_help', title: 'Часті питання', desc: 'Багато відповідей вже є в нашому розділі допомоги.', value: 'Перейти до FAQ →', href: '#', dark: true },
];

const offices = [
  { city: 'Центральний офіс (Київ)', address: 'вул. Хрещатик, 22, Київ, 01001', hours: 'Пн-Пт: 09:00–18:00' },
  { city: 'Західний регіональний центр (Львів)', address: 'пл. Ринок, 1, Львів, 79000', hours: 'Пн-Пт: 09:00–17:00' },
  { city: 'Центр підтримки (Дніпро)', address: 'пр. Яворницького, 75, Дніпро, 49000', hours: 'Пн-Пт: 09:00–18:00, Сб: 10:00–14:00' },
];

export default function Contact() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', category: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.message) { 
      showToast('⚠ Заповніть обов\'язкові поля'); 
      return; 
    }

    setLoading(true);
    try {
      await feedbackApi.send({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        category: form.category,
        message: form.message,
      });
      setSent(true);
      showToast('✅ Повідомлення надіслано!');
    } catch (err) {
      showToast(`⚠ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-container-max mx-auto px-5 md:px-16 py-12 space-y-12">
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="font-extrabold text-headline-xl text-primary mb-4">Зв'язок з нами</h1>
        <p className="text-body-lg text-on-surface-variant">Ми тут, щоб допомогти. Знайдіть необхідну інформацію або заповніть форму нижче.</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contacts.map(c => (
          <div key={c.title} className={`rounded-xl p-6 border flex flex-col items-center text-center gap-4 hover:shadow-sm transition-shadow ${c.dark ? 'bg-primary text-on-primary border-transparent' : 'bg-surface border-outline-variant'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${c.dark ? 'bg-white/15' : 'bg-primary-container'}`}>
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1", color: c.dark ? '#fff' : '#7796d1' }}>{c.icon}</span>
            </div>
            <h3 className={`font-bold text-headline-md ${c.dark ? 'text-on-primary' : 'text-primary'}`}>{c.title}</h3>
            <p className={`text-body-md ${c.dark ? 'text-on-primary/80' : 'text-on-surface-variant'}`}>{c.desc}</p>
            <a href={c.href} className={`font-bold mt-auto pt-2 hover:underline ${c.dark ? 'text-on-primary text-headline-md' : 'text-primary text-label-bold'}`}>{c.value}</a>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-surface border border-outline-variant rounded-xl p-6 md:p-8">
          <h2 className="font-bold text-headline-lg text-primary mb-2">Форма зворотного зв'язку</h2>
          <p className="text-body-md text-on-surface-variant mb-6">Заповніть форму, і наші спеціалісти зв'яжуться з вами якнайшвидше.</p>
          {sent ? (
            <div className="text-center py-8" role="status" aria-live="polite">
              <span className="material-symbols-outlined text-5xl text-primary mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <h3 className="font-bold text-headline-md text-primary mb-2">Повідомлення надіслано!</h3>
              <p className="text-body-md text-on-surface-variant">Ми відповімо протягом 1 робочого дня.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="firstName" className="font-bold text-label-bold text-on-surface">Ім'я</label>
                  <input id="firstName" type="text" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="Ваше ім'я" className="w-full border border-outline-variant rounded-lg px-4 py-3 bg-surface-bright text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow" />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="lastName" className="font-bold text-label-bold text-on-surface">Прізвище</label>
                  <input id="lastName" type="text" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Ваше прізвище" className="w-full border border-outline-variant rounded-lg px-4 py-3 bg-surface-bright text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="c-email" className="font-bold text-label-bold text-on-surface">Email <span className="text-error">*</span></label>
                <input id="c-email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="example@email.com" className="w-full border border-outline-variant rounded-lg px-4 py-3 bg-surface-bright text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow" />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="category" className="font-bold text-label-bold text-on-surface">Тема звернення</label>
                <div className="relative">
                  <select id="category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full border border-outline-variant rounded-lg px-4 py-3 bg-surface-bright text-body-md text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer">
                    <option value="">Оберіть тему...</option>
                    <option>Соціальна допомога</option>
                    <option>Житлові питання</option>
                    <option>Медичне забезпечення</option>
                    <option>Інше</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="c-msg" className="font-bold text-label-bold text-on-surface">Повідомлення <span className="text-error">*</span></label>
                <textarea id="c-msg" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required rows={5} placeholder="Опишіть ваше питання детально..." className="w-full border border-outline-variant rounded-lg px-4 py-3 bg-surface-bright text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow resize-none" />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-on-primary font-bold text-label-bold px-6 py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Надсилання...' : 'Надіслати звернення'}
              </button>
            </form>
          )}
        </section>

        <section className="flex flex-col gap-6">
          <div>
            <h2 className="font-bold text-headline-lg text-primary mb-2">Регіональні відділення</h2>
            <p className="text-body-md text-on-surface-variant">Знайдіть найближчий до вас центр надання допомоги.</p>
          </div>
          <div className="w-full h-64 bg-surface-variant rounded-xl border border-outline-variant relative overflow-hidden group shadow-sm">
            <img src="/map.png" alt="Карта регіональних відділень" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute bottom-3 right-3 flex flex-col gap-2 z-10">
              <button aria-label="Збільшити" className="w-9 h-9 bg-surface/90 backdrop-blur-sm border border-outline-variant rounded-lg flex items-center justify-center hover:bg-surface shadow-sm transition-colors">
                <span className="material-symbols-outlined text-sm text-primary">add</span>
              </button>
              <button aria-label="Зменшити" className="w-9 h-9 bg-surface/90 backdrop-blur-sm border border-outline-variant rounded-lg flex items-center justify-center hover:bg-surface shadow-sm transition-colors">
                <span className="material-symbols-outlined text-sm text-primary">remove</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {offices.map(o => (
              <div key={o.city} className="bg-surface border border-outline-variant p-4 rounded-lg flex items-start gap-3 hover:border-primary transition-colors cursor-pointer group shadow-sm">
                <span className="material-symbols-outlined text-primary mt-0.5 flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                <div>
                  <h4 className="font-bold text-label-bold text-primary group-hover:underline">{o.city}</h4>
                  <p className="text-body-md text-on-surface-variant mt-0.5">{o.address}</p>
                  <p className="text-sm text-on-surface-variant mt-0.5">{o.hours}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
