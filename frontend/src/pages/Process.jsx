import { Link } from 'react-router-dom';

const steps = [
  { num: 1, done: true, title: 'Реєстрація на порталі', desc: 'Створіть особистий кабінет за допомогою КЕП або через BankID. Верифікація займає до 5 хвилин.', time: '5 хвилин', icon: 'how_to_reg' },
  { num: 2, active: true, title: 'Вибір соціальної послуги', desc: 'Оберіть потрібну програму з каталогу. Ознайомтеся з умовами отримання та переліком документів.', time: '10 хвилин', icon: 'checklist' },
  { num: 3, title: 'Подача документів', desc: 'Завантажте скан-копії документів у форматі PDF або JPEG. Максимальний розмір файлу — 10 МБ.', time: '15 хвилин', icon: 'upload_file' },
  { num: 4, title: 'Розгляд заявки', desc: 'Фахівець розгляне вашу заявку. Ви можете відстежувати статус в особистому кабінеті.', time: '10 робочих днів', icon: 'manage_search' },
  { num: 5, title: 'Отримання рішення', desc: 'Ви отримаєте повідомлення на email або SMS. У разі відмови — обґрунтування та можливість оскарження.', time: 'Одразу після рішення', icon: 'notifications_active' },
];

export default function Process() {
  return (
    <div className="max-w-container-max mx-auto px-5 md:px-16 py-12">
      <section aria-labelledby="process-title" className="max-w-2xl mx-auto">
        <div className="mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-primary mb-2">◎ Кроки</p>
          <h1 id="process-title" className="font-bold text-headline-lg text-on-surface mb-3">Як подати заявку</h1>
          <p className="text-body-lg text-on-surface-variant max-w-xl">Детальний покроковий процес отримання соціальної допомоги через портал HelpUA.</p>
        </div>
        <div className="flex flex-col gap-4">
          {steps.map(s => (
            <div key={s.num} className={`rounded-xl p-5 flex gap-4 items-start transition-all ${s.active ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'bg-surface border border-outline-variant'}`}>
              <div className={`w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center font-extrabold text-label-bold border-2 ${s.active ? 'bg-white/15 border-white/30 text-on-primary' : s.done ? 'bg-green-50 border-green-400 text-green-700' : 'bg-surface-container-low border-outline-variant text-on-surface-variant'}`}>
                {s.done ? '✓' : s.num}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
                  <h3 className={`font-bold text-headline-md ${s.active ? 'text-on-primary' : 'text-on-surface'}`}>{s.title}</h3>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap border ${s.active ? 'bg-white/15 border-white/20 text-on-primary' : 'bg-surface-container-low border-outline-variant text-on-surface-variant'}`}>{s.time}</span>
                </div>
                <p className={`text-body-md leading-relaxed ${s.active ? 'text-on-primary/80' : 'text-on-surface-variant'}`}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-start">
          <Link to="/apply" className="inline-flex items-center justify-center bg-primary text-on-primary font-bold text-label-bold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity shadow-sm">
            Розпочати подачу заявки
            <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
