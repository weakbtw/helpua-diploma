import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationsApi } from '../api/applicationsApi.js';
import { showToast } from '../components/ui/toastEvent';

const STATUS_CONFIG = {
  pending:   { label: 'На розгляді', color: 'bg-secondary-container text-on-secondary-container', icon: 'schedule' },
  reviewing: { label: 'Розглядається', color: 'bg-primary-container text-on-primary-container', icon: 'manage_search' },
  approved:  { label: 'Схвалено', color: 'bg-green-100 text-green-800', icon: 'check_circle' },
  rejected:  { label: 'Відхилено', color: 'bg-error-container text-on-error-container', icon: 'cancel' },
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    applicationsApi.getMy()
      .then(data => {
        setDebugInfo(data);
        
        let validApps = [];
        if (Array.isArray(data)) {
          validApps = data;
        } else if (data && Array.isArray(data.rows)) {
          validApps = data.rows;
        } else if (data && Array.isArray(data.applications)) {
          validApps = data.applications;
        } else if (data && Array.isArray(data.data)) {
          validApps = data.data;
        }
        
        setApplications(validApps);
      })
      .catch(err => {
        setDebugInfo({ ERROR: err.message });
        showToast(`⚠ ${err.message}`);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    showToast('До побачення!');
    navigate('/');
  };

  return (
    <div className="max-w-container-max mx-auto px-5 md:px-16 py-12 min-h-screen">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-primary mb-1">Особистий кабінет</p>
          <h1 className="font-bold text-headline-lg text-on-surface">
            Вітаємо, {user?.firstName}!
          </h1>
          <p className="text-body-md text-on-surface-variant mt-1">{user?.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/apply"
            className="inline-flex items-center gap-2 bg-primary text-on-primary font-bold text-label-bold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-lg">add</span>
            Нова заявка
          </Link>
          <button onClick={handleLogout}
            className="inline-flex items-center gap-2 border border-outline-variant text-on-surface-variant font-medium text-body-md px-4 py-2.5 rounded-lg hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined text-lg">logout</span>
            Вийти
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Всього заявок', value: applications.length, icon: 'description', color: 'text-primary' },
          { label: 'На розгляді', value: applications.filter(a => a.status === 'pending').length, icon: 'schedule', color: 'text-secondary' },
          { label: 'Схвалено', value: applications.filter(a => a.status === 'approved').length, icon: 'check_circle', color: 'text-green-600' },
          { label: 'Відхилено', value: applications.filter(a => a.status === 'rejected').length, icon: 'cancel', color: 'text-error' },
        ].map(s => (
          <div key={s.label} className="bg-surface border border-outline-variant rounded-xl p-4 flex flex-col gap-2">
            <span className={`material-symbols-outlined text-2xl ${s.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
            <div className="text-2xl font-extrabold text-on-surface">{s.value}</div>
            <div className="text-xs text-on-surface-variant">{s.label}</div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-bold text-headline-md text-on-surface mb-4">Мої заявки</h2>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 bg-surface border border-outline-variant rounded-xl">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>inbox</span>
            <h3 className="font-bold text-headline-md text-on-surface mb-2">Заявок ще немає</h3>
            <p className="text-body-md text-on-surface-variant mb-6">Подайте першу заявку на соціальну допомогу</p>
            <Link to="/apply" className="inline-flex items-center gap-2 bg-primary text-on-primary font-bold text-label-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-lg">add</span>
              Подати заявку
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {applications.map(app => {
              const status = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
              return (
                <div key={app.id}
                  className="bg-surface border border-outline-variant rounded-xl p-5 flex flex-col md:flex-row justify-between gap-4 hover:border-primary/30 hover:shadow-sm transition-all">
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-label-bold text-on-surface">{app.service_type || app.service_name || 'Невідома послуга'}</h3>
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${status.color}`}>
                          <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1", fontSize: '14px' }}>{status.icon}</span>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-on-surface-variant mt-0.5">
                        Номер: <strong className="text-primary">{app.ticket_number || app.ticket_id || app.ticketId || '#...'}</strong>
                      </p>
                      <p className="text-sm text-on-surface-variant">
                        Регіон: {app.region} · Подано: {new Date(app.created_at).toLocaleDateString('uk-UA')}
                      </p>
                    </div>
                  </div>

                  {app.admin_comment && (
                    <div className="md:max-w-xs w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 text-sm flex flex-col justify-center">
                      <p className="text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">chat</span>
                        Повідомлення
                      </p>
                      <p className="text-on-surface italic">«{app.admin_comment}»</p>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
