import { useState, useEffect } from 'react';

export function Toast() {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleToast = (e) => {
      setMessage(e.detail);
      setVisible(true);
      setTimeout(() => setVisible(false), 3500);
    };

    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={`fixed bottom-6 right-6 z-[100] px-6 py-4 rounded-xl shadow-2xl border border-outline-variant font-medium text-sm transition-all duration-300 flex items-center gap-3
        ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12 pointer-events-none'}
        bg-surface text-on-surface`}
    >
      <span className="material-symbols-outlined text-primary text-xl">info</span>
      {message}
    </div>
  );
}
