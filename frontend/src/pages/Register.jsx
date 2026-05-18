import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/ui/toastEvent';

export default function Register() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    password: '', confirmPassword: '', consent: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const er = {};
    if (form.firstName.trim().length < 2) er.firstName = 'Введіть ім\'я';
    if (form.lastName.trim().length < 2) er.lastName = 'Введіть прізвище';
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) er.email = 'Введіть коректний email';
    if (form.password.length < 6) er.password = 'Пароль має містити щонайменше 6 символів';
    if (form.password !== form.confirmPassword) er.confirmPassword = 'Паролі не збігаються';
    if (!form.consent) er.consent = 'Необхідна згода на обробку даних';
    setErrors(er);
    if (Object.keys(er).length) return;

    setLoading(true);
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      showToast('✅ Акаунт успішно створено!');
      navigate('/dashboard');
    } catch (err) {
      showToast(`⚠ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (err) =>
    `w-full border rounded-lg px-4 py-3 bg-surface-container-lowest text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow ${err ? 'border-error' : 'border-outline-variant'}`;

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-16 px-5">
      <div className="w-full max-w-lg bg-surface-container-lowest border border-outline-variant rounded-xl p-8 flex flex-col gap-6 shadow-sm">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-primary mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
          <h1 className="font-extrabold text-headline-md text-primary">Створення акаунту</h1>
          <p className="text-body-md text-on-surface-variant mt-1">Зареєструйтесь для доступу до послуг</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button type="button" className="w-full py-3 px-4 bg-primary text-on-primary font-bold text-label-bold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>fingerprint</span>
            Дія.Підпис
          </button>
          <button type="button" className="w-full py-3 px-4 border-2 border-primary text-primary font-bold text-label-bold rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined">account_balance</span>
            BankID
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-outline-variant" />
          <span className="text-body-md text-on-surface-variant text-sm">або</span>
          <div className="flex-1 h-px bg-outline-variant" />
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="firstName" className="font-bold text-label-bold text-on-surface">Ім'я</label>
              <input id="firstName" name="firstName" type="text" value={form.firstName} onChange={handleChange}
                placeholder="Іван" className={inputCls(errors.firstName)} />
              {errors.firstName && <span role="alert" className="text-xs text-error flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.firstName}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="lastName" className="font-bold text-label-bold text-on-surface">Прізвище</label>
              <input id="lastName" name="lastName" type="text" value={form.lastName} onChange={handleChange}
                placeholder="Шевченко" className={inputCls(errors.lastName)} />
              {errors.lastName && <span role="alert" className="text-xs text-error flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.lastName}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="reg-email" className="font-bold text-label-bold text-on-surface">Електронна пошта</label>
            <input id="reg-email" name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="mail@example.com" className={inputCls(errors.email)} />
            {errors.email && <span role="alert" className="text-xs text-error flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.email}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="reg-password" className="font-bold text-label-bold text-on-surface">Пароль</label>
              <input id="reg-password" name="password" type="password" value={form.password} onChange={handleChange}
                placeholder="••••••••" className={inputCls(errors.password)} />
              {errors.password && <span role="alert" className="text-xs text-error flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.password}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="confirmPassword" className="font-bold text-label-bold text-on-surface">Повторіть пароль</label>
              <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange}
                placeholder="••••••••" className={inputCls(errors.confirmPassword)} />
              {errors.confirmPassword && <span role="alert" className="text-xs text-error flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.confirmPassword}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange}
                className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary mt-0.5 flex-shrink-0" />
              <span className="text-body-md text-on-surface-variant text-sm">
                Я погоджуюсь з умовами використання та даю згоду на обробку персональних даних <span className="text-error">*</span>
              </span>
            </label>
            {errors.consent && <span role="alert" className="text-xs text-error flex items-center gap-1 ml-8"><span className="material-symbols-outlined text-sm">error</span>{errors.consent}</span>}
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 mt-2 bg-primary text-on-primary font-bold text-label-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {loading && <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>}
            {loading ? 'Реєстрація...' : 'Зареєструватися'}
          </button>
        </form>

        <div className="text-center border-t border-outline-variant pt-4">
          <p className="text-body-md text-on-surface-variant text-sm">
            Вже є акаунт? <Link to="/login" className="font-bold text-label-bold text-primary hover:underline">Увійти</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
