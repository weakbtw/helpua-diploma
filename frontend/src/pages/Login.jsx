import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/ui/toastEvent';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const er = {};
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) er.email = 'Введіть коректний email';
    if (form.password.length < 6) er.password = 'Пароль має містити щонайменше 6 символів';
    setErrors(er);
    if (Object.keys(er).length) return;

    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      showToast('✅ Вхід виконано успішно!');
      navigate('/dashboard');
    } catch (err) {
      showToast(`⚠ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-16 px-5">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl p-8 flex flex-col gap-6 shadow-sm">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-primary mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
          <h1 className="font-extrabold text-headline-md text-primary">HelpUA</h1>
          <p className="text-body-md text-on-surface-variant mt-1">Увійдіть до свого облікового запису</p>
        </div>

        <div className="flex flex-col gap-3">
          <button type="button" className="w-full py-3 px-4 bg-primary text-on-primary font-bold text-label-bold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>fingerprint</span>
            Увійти через Дія.Підпис
          </button>
          <button type="button" className="w-full py-3 px-4 border-2 border-primary text-primary font-bold text-label-bold rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined">account_balance</span>
            Увійти через BankID
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-outline-variant" />
          <span className="text-body-md text-on-surface-variant text-sm">або</span>
          <div className="flex-1 h-px bg-outline-variant" />
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-bold text-label-bold text-on-surface">Електронна пошта</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange}
              required aria-required="true" aria-invalid={!!errors.email}
              placeholder="mail@example.com"
              className={`w-full border rounded-lg px-4 py-3 bg-surface-container-lowest text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow ${errors.email ? 'border-error' : 'border-outline-variant'}`} />
            {errors.email && <span role="alert" className="text-xs text-error flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.email}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-bold text-label-bold text-on-surface">Пароль</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange}
              required aria-required="true" aria-invalid={!!errors.password}
              placeholder="••••••••"
              className={`w-full border rounded-lg px-4 py-3 bg-surface-container-lowest text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow ${errors.password ? 'border-error' : 'border-outline-variant'}`} />
            {errors.password && <span role="alert" className="text-xs text-error flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.password}</span>}
          </div>

          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" />
              <span className="text-body-md text-on-surface-variant text-sm">Запам'ятати мене</span>
            </label>
            <a href="#" className="font-bold text-label-bold text-primary hover:underline text-sm">Забули пароль?</a>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-primary text-on-primary font-bold text-label-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {loading && <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>}
            {loading ? 'Вхід...' : 'Увійти'}
          </button>
        </form>

        <div className="text-center border-t border-outline-variant pt-4">
          <p className="text-body-md text-on-surface-variant text-sm">
            Немає акаунту? <Link to="/register" className="font-bold text-label-bold text-primary hover:underline">Зареєструватися</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
