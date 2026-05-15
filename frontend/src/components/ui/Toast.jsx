import { useState, useEffect } from 'react';

let toastFn = null;

export function showToast(msg) {
  if (toastFn) toastFn(msg);
}

export function Toast() {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    toastFn = (msg) => {
      setMessage(msg);
      setVisible(true);
      setTimeout(() => setVisible(false), 3500);
    };
    return () => { toastFn = null; };
  }, []);

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={`toast${visible ? ' show' : ''}`}
    >
      {message}
    </div>
  );
}
