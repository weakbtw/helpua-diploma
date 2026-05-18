import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/ui/Toast';
import { getAuthHeaders, API_URL } from '../api/config.js';

const STATUS_CONFIG = {
  pending:   { label: 'На розгляді',   color: 'bg-secondary-container text-on-secondary-container', icon: 'schedule' },
  reviewing: { label: 'Розглядається', color: 'bg-primary-container text-on-primary-container', icon: 'manage_search' },
  approved:  { label: 'Схвалено',      color: 'bg-green-100 text-green-800',                        icon: 'check_circle' },
  rejected:  { label: 'Відхилено',     color: 'bg-error-container text-on-error-container',         icon: 'cancel' },
};

const STATUS_OPTIONS = [
  { value: 'pending',   label: 'На розгляді' },
  { value: 'reviewing', label: 'Розглядається' },
  { value: 'approved',  label: 'Схвалено' },
  { value: 'rejected',  label: 'Відхилено' },
];

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [comment, setComment] = useState('');
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState({});

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (filterRegion) params.append('region', filterRegion);

      const res = await fetch(`${API_URL}/applications?${params}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setApplications(data.applications || []);

      const s = {};
      (data.applications || []).forEach(a => {
        s[a.status] = (s[a.status] || 0) + 1;
      });
      setStats(s);
    } catch (err) {
      showToast(`⚠ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [filterStatus, filterRegion]);

  const handleStatusUpdate = async () => {
    if (!newStatus) { showToast('⚠ Оберіть новий статус'); return; }
    setUpdating(true);
    try {
      const res = await fetch(`${API_URL}/applications/${selectedApp.id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast('✅ Статус оновлено!');
      setSelectedApp(null);
      setNewStatus('');
      setComment('');
      fetchApplications();
    } catch (err) {
      showToast(`⚠ ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const filtered = applications.filter(a =>
    a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.ticket_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-container-max mx-auto px-5 md:px-16 py-12 pb-32 min-h-screen">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-primary mb-1">Адміністратор</p>
          <h1 className="font-bold text-headline-lg text-on-surface">Панель управління</h1>
          <p className="text-body-md text-on-surface-variant mt-1">Управління заявками громадян</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-on-surface-variant bg-surface border border-outline-variant rounded-xl px-4 py-2.5">
          <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
          <span className="font-medium">{user?.firstName} {user?.lastName}</span>
          <span className="bg-primary text-on-primary text-xs font-bold px-2 py-0.5 rounded-full ml-1">ADMIN</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Всього заявок', value: applications.length, icon: 'description', color: 'text-primary' },
          { label: 'На розгляді', value: stats.pending || 0, icon: 'schedule', color: 'text-secondary' },
          { label: 'Схвалено', value: stats.approved || 0, icon: 'check_circle', color: 'text-green-600' },
          { label: 'Відхилено', value: stats.rejected || 0, icon: 'cancel', color: 'text-error' },
        ].map(s => (
          <div key={s.label} className="bg-surface border border-outline-variant rounded-xl p-4 flex flex-col gap-2">
            <span className={`material-symbols-outlined text-2xl ${s.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
            <div className="text-2xl font-extrabold text-on-surface">{s.value}</div>
            <div className="text-xs text-on-surface-variant">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-outline-variant rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Пошук за ім'ям або номером заявки..."
            className="w-full pl-10 pr-4 py-2.5 border border-outline-variant rounded-lg text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div className="relative">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 border border-outline-variant rounded-lg text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
            <option value="">Всі статуси</option>
            {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
        </div>
        <div className="relative">
          <select value={filterRegion} onChange={e => setFilterRegion(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 border border-outline-variant rounded-lg text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
            <option value="">Всі регіони</option>
            {['Вінницька','Волинська','Дніпропетровська','Житомирська','Закарпатська',
              'Івано-Франківська','Київська','Кіровоградська','Львівська','Миколаївська',
              'Одеська','Полтавська','Рівненська','Сумська','Тернопільська','Харківська',
              'Хмельницька','Черкаська','Чернівецька','Чернігівська','м. Київ'
            ].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
        </div>
        {(filterStatus || filterRegion || search) && (
          <button onClick={() => { setFilterStatus(''); setFilterRegion(''); setSearch(''); }}
            className="flex items-center gap-1 px-4 py-2.5 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors text-sm font-medium">
            <span className="material-symbols-outlined text-lg">close</span>
            Скинути
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-outline-variant rounded-xl">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-3 block">inbox</span>
          <p className="text-body-md text-on-surface-variant">Заявок не знайдено</p>
        </div>
      ) : (
        <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Номер</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Заявник</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Послуга</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Регіон</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Статус</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Дата</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Дії</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filtered.map(app => {
                  const status = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                  return (
                    <tr key={app.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-bold text-primary text-sm">{app.ticket_id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-on-surface">{app.full_name}</div>
                        <div className="text-xs text-on-surface-variant">{app.phone}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-on-surface">{app.service_name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-on-surface-variant">{app.region}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${status.color}`}>
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '14px' }}>{status.icon}</span>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-on-surface-variant">
                          {new Date(app.created_at).toLocaleDateString('uk-UA')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => { setSelectedApp(app); setNewStatus(app.status); setComment(''); }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-surface border border-outline-variant hover:border-primary hover:bg-surface-variant transition-colors px-3 py-1.5 rounded-lg">
                          <span className="material-symbols-outlined text-sm">edit</span>
                          Змінити
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-outline-variant bg-surface-container-low">
            <p className="text-xs text-on-surface-variant">Показано {filtered.length} із {applications.length} заявок</p>
          </div>
        </div>
      )}

      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6 backdrop-blur-sm"
          role="dialog" aria-modal="true" aria-labelledby="modal-title"
          onClick={e => { if (e.target === e.currentTarget) setSelectedApp(null); }}>
          <div className="bg-surface rounded-xl max-w-md w-full shadow-2xl border border-outline-variant">

            <div className="bg-primary text-on-primary p-6 rounded-t-xl flex items-start justify-between gap-4">
              <div>
                <h2 id="modal-title" className="font-bold text-headline-md">Змінити статус</h2>
                <p className="text-sm opacity-75 mt-1">{selectedApp.ticket_id} · {selectedApp.full_name}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} aria-label="Закрити" className="text-on-primary/80 hover:text-on-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-label-bold text-on-surface">Поточний статус</label>
                <div className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full w-max ${STATUS_CONFIG[selectedApp.status]?.color}`}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '14px' }}>{STATUS_CONFIG[selectedApp.status]?.icon}</span>
                  {STATUS_CONFIG[selectedApp.status]?.label}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="newStatus" className="font-bold text-label-bold text-on-surface">Новий статус <span className="text-error">*</span></label>
                <div className="relative">
                  <select id="newStatus" value={newStatus} onChange={e => setNewStatus(e.target.value)}
                    className="w-full appearance-none pl-4 pr-10 py-3 border border-outline-variant rounded-lg text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
                    {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="comment" className="font-bold text-label-bold text-on-surface">Коментар</label>
                <textarea id="comment" value={comment} onChange={e => setComment(e.target.value)}
                  rows={3} placeholder="Необов'язково — причина зміни статусу..."
                  className="w-full border border-outline-variant rounded-lg p-3 text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
              </div>
            </div>

            <div className="border-t border-outline-variant p-4 flex justify-end gap-3">
              <button onClick={() => setSelectedApp(null)}
                className="px-5 py-2.5 border border-outline-variant text-on-surface font-medium rounded-lg hover:bg-surface-variant transition-colors">
                Скасувати
              </button>
              <button onClick={handleStatusUpdate} disabled={updating}
                className="px-5 py-2.5 bg-primary text-on-primary font-bold text-label-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2">
                {updating && <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>}
                {updating ? 'Збереження...' : 'Зберегти'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
