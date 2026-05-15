import { Link } from 'react-router-dom';

const services = [
  { icon: 'home_work', title: 'Допомога ВПО', desc: 'Реєстрація статусу, оформлення виплат та житлові програми для внутрішньо переміщених осіб.', accent: true },
  { icon: 'account_balance_wallet', title: 'Пенсійне забезпечення', desc: 'Призначення, перерахунок пенсій та отримання довідок онлайн без візиту до фонду.', accent: true },
  { icon: 'family_restroom', title: 'Підтримка сімей', desc: 'Допомога при народженні дитини, підтримка багатодітних сімей та аліменти.', accent: true },
  { icon: 'medical_services', title: 'Медичні пільги', desc: 'Забезпечення ліками, реабілітація та санаторно-курортне лікування для пільгових категорій.', accent: true },
  { icon: 'accessible', title: 'Допомога особам з інвалідністю', desc: 'Оформлення пільг, засобів реабілітації та соціального супроводу.', accent: true },
  { icon: 'search', title: 'Не знайшли потрібне?', desc: 'Скористайтеся повним алфавітним каталогом або пошуком за життєвими ситуаціями.', accent: false, special: true },
];

const steps = [
  { num: 1, icon: 'person_add', title: 'Зареєструйтесь', desc: 'Авторизуйтесь через BankID або Дія.Підпис для безпечного доступу до кабінету.', active: true },
  { num: 2, icon: 'checklist', title: 'Оберіть послугу', desc: 'Знайдіть потрібну послугу в каталозі та заповніть електронну заяву.', active: false },
  { num: 3, icon: 'task_alt', title: 'Отримайте допомогу', desc: 'Відстежуйте статус заяви в реальному часі та отримайте результат.', active: false },
];

export default function Home() {
  return (
    <>
      <section className="w-full bg-surface-container-low border-b border-outline-variant py-16">
        <div className="max-w-container-max mx-auto px-5 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col gap-4">
            <span className="inline-block bg-secondary-container text-on-secondary-container font-bold text-label-bold px-3 py-1 rounded-full w-max">
              Офіційний портал
            </span>
            <h1 className="text-headline-xl text-primary font-extrabold md:text-[48px] md:leading-[1.1]">
              Державна допомога для кожного українця
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-lg">
              Знайдіть необхідні соціальні послуги, подайте заяву онлайн та відстежуйте статус у зручному кабінеті. Прозоро, швидко, доступно.
            </p>
            <div className="mt-4 w-full max-w-xl">
              <form className="relative flex items-center w-full" role="search">
                <span className="material-symbols-outlined absolute left-4 text-on-surface-variant">search</span>
                <input
                  type="search" name="q"
                  placeholder="Яку послугу ви шукаєте? (напр., Допомога ВПО)"
                  aria-label="Пошук послуг"
                  className="w-full h-14 pl-12 pr-32 bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface placeholder:text-on-surface-variant transition-all shadow-sm"
                />
                <button type="submit" className="absolute right-2 bg-primary text-on-primary h-10 px-5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                  Знайти
                </button>
              </form>
            </div>
          </div>

          <div className="hidden md:grid grid-cols-2 gap-4 h-[400px]">
            <div className="col-span-1 row-span-2 rounded-xl bg-surface-container-high overflow-hidden group shadow-sm">
              <img 
                src="/workers.png" 
                alt="Підтримка громадян" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            </div>
            
            <div className="col-span-1 rounded-xl bg-primary p-6 flex flex-col justify-center items-start shadow-sm overflow-hidden">
              <div className="flex flex-col items-start">
                <span className="material-symbols-outlined text-on-primary text-4xl mb-3 -ml-[3px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  description
                </span>
                <h3 className="font-bold text-[21px] text-on-primary mb-1 whitespace-nowrap leading-tight">
                  Спрощена подача
                </h3>
                <p className="text-body-md text-on-primary/80">
                  Більше жодних черг
                </p>
              </div>
            </div>
            
            <div className="col-span-1 rounded-xl bg-surface-container-high overflow-hidden group shadow-sm">
              <img 
                src="/laptop.png" 
                alt="Цифрові послуги" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background w-full" aria-labelledby="services-title">
        <div className="max-w-container-max mx-auto px-5 md:px-16">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
            <div>
              <h2 id="services-title" className="text-headline-lg text-primary font-bold">Каталог послуг</h2>
              <p className="text-body-md text-on-surface-variant mt-1">Найбільш затребувані соціальні сервіси, доступні онлайн.</p>
            </div>
            <Link to="/services" className="inline-flex items-center gap-1 text-primary font-bold text-label-bold hover:opacity-80 transition-opacity group">
              Всі послуги
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {services.map(s => (
              <Link key={s.title} to="/apply" role="listitem"
                className={`group flex flex-col rounded-xl p-6 border transition-all duration-300 relative overflow-hidden hover:shadow-lg
                  ${s.special ? 'bg-surface-container-low border-dashed border-2 border-outline-variant' : 'bg-surface border-outline-variant hover:border-primary/30'}`}>
                {s.accent && <div className="absolute top-0 left-0 w-full h-1 bg-secondary-fixed" />}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 text-primary ${s.special ? 'bg-surface-variant' : 'bg-primary-fixed'}`}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: s.special ? "'FILL' 0" : "'FILL' 1" }}>{s.icon}</span>
                </div>
                <h3 className="font-bold text-headline-md text-on-surface mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
                <p className="text-body-md text-on-surface-variant flex-grow">{s.desc}</p>
                <div className="mt-4 flex items-center text-primary font-bold text-label-bold">
                  {s.special ? 'Відкрити каталог' : 'Детальніше'}
                  <span className="material-symbols-outlined ml-1 text-sm">chevron_right</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface-container-low border-y border-outline-variant" aria-labelledby="process-title">
        <div className="max-w-container-max mx-auto px-5 md:px-16">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2 id="process-title" className="text-headline-lg text-primary font-bold">Як отримати допомогу онлайн</h2>
            <p className="text-body-md text-on-surface-variant mt-3">Простий та прозорий процес, розроблений для економії вашого часу.</p>
          </div>
          <div className="relative flex flex-col md:flex-row gap-8 items-start justify-center">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-outline-variant z-0" />
            {steps.map(s => (
              <div key={s.num} className="relative z-10 flex-1 flex flex-col items-center text-center group">
                <div className={`w-24 h-24 rounded-full border-4 shadow-sm flex items-center justify-center mb-6 transition-transform group-hover:scale-105
                  ${s.active ? 'bg-surface border-primary-container text-primary' : 'bg-surface border-outline-variant text-on-surface'}`}>
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center absolute top-[-10px] right-1/4 shadow-sm border-2 border-surface font-bold text-label-bold
                  ${s.active ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant'}`}>
                  {s.num}
                </div>
                <h3 className={`font-bold text-headline-md mb-2 ${s.active ? 'text-primary' : 'text-on-surface'}`}>{s.title}</h3>
                <p className="text-body-md text-on-surface-variant px-4">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Link to="/apply" className="inline-flex items-center justify-center bg-primary text-on-primary font-bold text-label-bold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity shadow-sm">
              Розпочати зараз
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
