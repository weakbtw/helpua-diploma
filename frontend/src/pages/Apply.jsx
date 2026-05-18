import { applicationsApi } from '../api/applicationsApi.js';
import { useState } from 'react';
import { showToast } from '../components/ui/toastEvent';

const REGIONS = [
  'Вінницька', 'Волинська', 'Дніпропетровська', 'Житомирська',
  'Закарпатська', 'Івано-Франківська', 'Київська', 'Кіровоградська',
  'Львівська', 'Миколаївська', 'Одеська', 'Полтавська', 'Рівненська',
  'Сумська', 'Тернопільська', 'Харківська', 'Хмельницька',
  'Черкаська', 'Чернівецька', 'Чернігівська', 'м. Київ',
];

const SERVICES = [
  { value: 'vpo', label: 'Допомога внутрішньо переміщеним особам (ВПО)' },
  { value: 'financial', label: 'Одноразова фінансова підтримка' },
  { value: 'housing', label: 'Субсидія на оплату житлово-комунальних послуг' },
  { value: 'disability', label: 'Допомога особам з інвалідністю' },
  { value: 'pension', label: 'Пенсійне забезпечення' },
  { value: 'family', label: 'Підтримка сімей з дітьми' },
  { value: 'medical', label: 'Медичні пільги' },
];

const init = {
  fullName: '', idCode: '', phone: '', address: '',
  serviceType: '', region: '', description: '',
  consent: false, accuracy: false,
};

const inputCls = err =>
  `w-full border rounded-lg p-3 bg-surface-container-lowest text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow ${err ? 'border-error' : 'border-outline-variant'}`;

export default function Apply() {
  const [form, setForm] = useState(init);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const validate = () => {
    const er = {};
    if (form.fullName.trim().length < 3) er.fullName = 'Введіть прізвище, ім\'я та по батькові';
    if (!/^\d{10}$/.test(form.idCode.trim())) er.idCode = 'ІПН має містити рівно 10 цифр';
    if (form.phone.trim().length < 7) er.phone = 'Введіть коректний номер телефону';
    if (form.address.trim().length < 5) er.address = 'Введіть адресу проживання';
    if (!form.serviceType) er.serviceType = 'Оберіть вид соціальної послуги';
    if (!form.region) er.region = 'Оберіть регіон';
    if (!form.consent) er.consent = 'Необхідно надати згоду';
    if (!form.accuracy) er.accuracy = 'Необхідно підтвердити достовірність';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) { showToast('⚠ Будь ласка, виправте помилки у формі'); return; }

    setLoading(true);
    try {
      const data = await applicationsApi.create({
        fullName: form.fullName,
        idCode: form.idCode,
        phone: form.phone,
        address: form.address,
        serviceType: form.serviceType,
        region: form.region,
        description: form.description,
      });
      setTicketId(
        data.ticketId || 
        data.ticket_number || 
        data.ticket_id || 
        data.rows?.[0]?.ticket_number || 
        data.rows?.[0]?.ticket_id || 
        'Номер згенеровано'
      );
      setSubmitted(true);
      showToast('✅ Заявку успішно подано!');
    } catch (err) {
      showToast(`⚠ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16 px-5">
        <div className="text-center max-w-md" role="status" aria-live="polite">
          <span className="material-symbols-outlined text-6xl text-primary mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <h2 className="font-bold text-headline-lg text-primary mb-3">Заявку успішно подано!</h2>
          <p className="text-body-lg text-on-surface-variant mb-4">Ваша заявка прийнята та буде розглянута протягом 10 робочих днів.</p>
          <p className="text-body-md text-on-surface-variant mb-6">Номер заявки: <strong className="text-primary">{ticketId}</strong></p>
          <button onClick={() => { setForm(init); setSubmitted(false); }} className="bg-primary text-on-primary font-bold text-label-bold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">
            Подати ще одну заявку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-5 md:px-16 py-12">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8 text-center md:text-left">
          <h1 className="font-bold text-headline-lg text-on-surface mb-2">Заява на отримання соціальної допомоги</h1>
          <p className="text-body-lg text-on-surface-variant">Будь ласка, заповніть форму нижче для подання запиту на допомогу.</p>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-4 w-full h-0.5 bg-surface-variant rounded-full -z-10" />
            <div className="absolute left-0 top-4 w-1/3 h-0.5 bg-primary rounded-full -z-10" />
            {[{ n: 1, label: 'Особисті дані', active: true }, { n: 2, label: 'Вибір послуги' }, { n: 3, label: 'Документи' }].map(s => (
              <div key={s.n} className="flex flex-col items-center gap-2 bg-background px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-label-bold border-2 ${s.active ? 'bg-primary text-on-primary border-primary' : 'bg-surface text-on-surface-variant border-outline-variant'}`}>{s.n}</div>
                <span className={`text-label-bold font-bold hidden md:block ${s.active ? 'text-primary' : 'text-on-surface-variant'}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-3 bg-secondary-container/30 border border-secondary-fixed-dim rounded-lg p-4 mb-6">
          <span className="material-symbols-outlined text-base text-secondary flex-shrink-0 mt-0.5">info</span>
          <span className="text-sm text-on-surface">Усі поля, позначені <strong>*</strong>, є обов'язковими. Дані передаються захищеним каналом згідно із Законом України «Про захист персональних даних».</span>
        </div>

        <div className="bg-surface border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

            <fieldset className="flex flex-col gap-4 border-b border-outline-variant pb-6">
              <legend className="font-bold text-headline-md text-on-surface mb-2">1. Особисті дані</legend>

              <div className="flex flex-col gap-1">
                <label htmlFor="fullName" className="font-bold text-label-bold text-on-surface">Прізвище, ім'я, по батькові <span className="text-error">*</span></label>
                <input id="fullName" name="fullName" type="text" value={form.fullName} onChange={handleChange} required aria-required="true" aria-invalid={!!errors.fullName} placeholder="Шевченко Тарас Григорович" className={inputCls(errors.fullName)} />
                {errors.fullName && <span role="alert" className="text-xs text-error flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.fullName}</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="idCode" className="font-bold text-label-bold text-on-surface">РНОКПП (ІПН) <span className="text-error">*</span></label>
                  <input id="idCode" name="idCode" type="text" inputMode="numeric" maxLength={10} value={form.idCode} onChange={handleChange} required aria-required="true" aria-invalid={!!errors.idCode} placeholder="1234567890" className={inputCls(errors.idCode)} />
                  {errors.idCode && <span role="alert" className="text-xs text-error flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.idCode}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="phone" className="font-bold text-label-bold text-on-surface">Контактний телефон <span className="text-error">*</span></label>
                  <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required aria-required="true" aria-invalid={!!errors.phone} placeholder="+38 (000) 000-00-00" className={inputCls(errors.phone)} />
                  {errors.phone && <span role="alert" className="text-xs text-error flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.phone}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="address" className="font-bold text-label-bold text-on-surface">Адреса фактичного проживання <span className="text-error">*</span></label>
                <input id="address" name="address" type="text" value={form.address} onChange={handleChange} required aria-required="true" aria-invalid={!!errors.address} placeholder="Місто, вулиця, будинок, квартира" className={inputCls(errors.address)} />
                {errors.address && <span role="alert" className="text-xs text-error flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.address}</span>}
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-4 border-b border-outline-variant pb-6">
              <legend className="font-bold text-headline-md text-on-surface mb-2">2. Вибір соціальної послуги</legend>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="serviceType" className="font-bold text-label-bold text-on-surface">Категорія допомоги <span className="text-error">*</span></label>
                  <div className="relative">
                    <select id="serviceType" name="serviceType" value={form.serviceType} onChange={handleChange} required aria-required="true" aria-invalid={!!errors.serviceType} className={`${inputCls(errors.serviceType)} appearance-none pr-10 cursor-pointer`}>
                      <option value="" disabled>Оберіть послугу зі списку...</option>
                      {SERVICES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                  {errors.serviceType && <span role="alert" className="text-xs text-error flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.serviceType}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="region" className="font-bold text-label-bold text-on-surface">Регіон проживання <span className="text-error">*</span></label>
                  <div className="relative">
                    <select id="region" name="region" value={form.region} onChange={handleChange} required aria-required="true" aria-invalid={!!errors.region} className={`${inputCls(errors.region)} appearance-none pr-10 cursor-pointer`}>
                      <option value="" disabled>Оберіть регіон...</option>
                      {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                  {errors.region && <span role="alert" className="text-xs text-error flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.region}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="description" className="font-bold text-label-bold text-on-surface">Опис ситуації</label>
                <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Коротко опишіть вашу ситуацію..." aria-describedby="desc-hint" className="w-full border border-outline-variant rounded-lg p-3 bg-surface-container-lowest text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow resize-none" />
                <span id="desc-hint" className="text-xs text-on-surface-variant">До 500 символів.</span>
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-4 border-b border-outline-variant pb-6">
              <legend className="font-bold text-headline-md text-on-surface mb-2">3. Завантаження документів</legend>
              <p className="text-body-md text-on-surface-variant">Завантажте скановані копії необхідних документів (Паспорт, ІПН).</p>
              <label htmlFor="file-upload" className="w-full border-2 border-dashed border-outline-variant rounded-xl bg-surface-container-low p-8 flex flex-col items-center justify-center text-center hover:bg-surface-variant transition-colors cursor-pointer group">
                <span className="material-symbols-outlined text-4xl text-primary mb-2 group-hover:scale-110 transition-transform">cloud_upload</span>
                <span className="font-bold text-label-bold text-on-surface mb-1">Натисніть для вибору файлів</span>
                <span className="text-sm text-on-surface-variant">або перетягніть файли сюди (PDF, JPG, PNG, макс. 10MB)</span>
                <input id="file-upload" type="file" multiple className="hidden" />
              </label>
            </fieldset>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="consent" name="consent" checked={form.consent} onChange={handleChange} required aria-required="true" aria-invalid={!!errors.consent} className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary mt-0.5 flex-shrink-0" />
                  <label htmlFor="consent" className="text-body-md text-on-surface cursor-pointer">
                    Я надаю згоду на обробку моїх персональних даних відповідно до Закону України «Про захист персональних даних» <span className="text-error">*</span>
                  </label>
                </div>
                {errors.consent && <span role="alert" className="text-xs text-error flex items-center gap-1 ml-8"><span className="material-symbols-outlined text-sm">error</span>{errors.consent}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="accuracy" name="accuracy" checked={form.accuracy} onChange={handleChange} required aria-required="true" aria-invalid={!!errors.accuracy} className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary mt-0.5 flex-shrink-0" />
                  <label htmlFor="accuracy" className="text-body-md text-on-surface cursor-pointer">
                    Підтверджую достовірність наданих відомостей <span className="text-error">*</span>
                  </label>
                </div>
                {errors.accuracy && <span role="alert" className="text-xs text-error flex items-center gap-1 ml-8"><span className="material-symbols-outlined text-sm">error</span>{errors.accuracy}</span>}
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm text-on-surface-variant bg-surface-container-low rounded-lg p-3">
              <span className="material-symbols-outlined text-base flex-shrink-0 mt-0.5">lock</span>
              <p>Усі ваші дані надійно захищені та обробляються згідно із законодавством України про захист персональних даних.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
              <button type="button" className="w-full sm:w-auto px-6 py-3 border-2 border-outline-variant text-on-surface font-bold text-label-bold rounded-lg hover:bg-surface-variant transition-colors">
                Зберегти як чернетку
              </button>
              
              <button type="submit" disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-primary text-on-primary font-bold text-label-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>}
                {loading ? 'Надсилання...' : 'Подати заявку'}
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
