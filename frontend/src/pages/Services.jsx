import { Link } from 'react-router-dom';

const services = [
  { icon: 'home_work', accent: true, title: 'Допомога ВПО', desc: 'Реєстрація статусу, оформлення виплат та житлові програми для внутрішньо переміщених осіб.', who: 'Внутрішньо переміщені особи', term: '10 робочих днів' },
  { icon: 'account_balance_wallet', accent: true, title: 'Пенсійне забезпечення', desc: 'Призначення, перерахунок пенсій та отримання довідок онлайн без візиту до фонду.', who: 'Особи пенсійного віку, ветерани', term: '30 робочих днів' },
  { icon: 'family_restroom', accent: true, title: 'Підтримка сімей', desc: 'Допомога при народженні дитини, підтримка багатодітних сімей та аліменти.', who: 'Сім\'ї з дітьми', term: '10 робочих днів' },
  { icon: 'medical_services', accent: true, title: 'Медичні пільги', desc: 'Забезпечення ліками, реабілітація та санаторно-курортне лікування для пільгових категорій.', who: 'Ветерани, пенсіонери, особи з інвалідністю', term: '15 робочих днів' },
  { icon: 'accessible', accent: true, title: 'Допомога особам з інвалідністю', desc: 'Оформлення пільг, засобів реабілітації та соціального супроводу.', who: 'Особи з інвалідністю I–III групи', term: '15 робочих днів' },
  { icon: 'school', accent: true, title: 'Освітні стипендії', desc: 'Стипендії та гранти для дітей із малозабезпечених сімей, сиріт та дітей з інвалідністю.', who: 'Учні та студенти пільгових категорій', term: '20 робочих днів' },
];

export default function Services() {
  return (
    <div className="max-w-container-max mx-auto px-5 md:px-16 py-12">
      <section aria-labelledby="services-title">
        <div className="mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-primary mb-2">⬡ Каталог</p>
          <h1 id="services-title" className="font-bold text-headline-lg text-on-surface mb-3">Усі соціальні послуги</h1>
          <p className="text-body-lg text-on-surface-variant max-w-3xl">Повний перелік державних програм підтримки, доступних для онлайн-подачі заявок.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {services.map(s => (
            <article key={s.title} role="listitem" tabIndex={0} className="group flex flex-col h-full bg-surface border border-outline-variant rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300 relative overflow-hidden">
              {s.accent && <div className="absolute top-0 left-0 w-full h-1 bg-secondary-fixed" />}
              
              <div className="flex flex-col flex-grow">
                <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center mb-4 text-primary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                </div>
                <h3 className="font-bold text-headline-md text-on-surface mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
                <p className="text-body-md text-on-surface-variant mb-5">{s.desc}</p>
              </div>
              
              <div className="flex flex-col mt-auto pt-5 border-t border-outline-variant">
                <div className="flex flex-col gap-4 mb-5 min-h-[7.5rem]">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary/80 mt-0.5" style={{ fontSize: '20px' }}>person</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Хто може</span>
                      <span className="text-sm text-on-surface leading-snug">{s.who}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary/80 mt-0.5" style={{ fontSize: '20px' }}>schedule</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Термін розгляду</span>
                      <span className="text-sm text-on-surface leading-snug">{s.term}</span>
                    </div>
                  </div>
                </div>
                
                <Link to="/apply" className="inline-flex items-center text-primary font-bold text-label-bold hover:gap-1.5 transition-all mt-auto" aria-label={`Подати заявку на ${s.title}`}>
                  Подати заявку <span className="material-symbols-outlined ml-1 text-sm">chevron_right</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
