import React from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import './Toast.css';

const ICONS = {
  success: <CheckCircle2 size={22} />,
  error:   <XCircle size={22} />,
  info:    <Info size={22} />,
  warning: <AlertTriangle size={22} />,
};

const ToastContainer = ({ toasts, onClose }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <div className="toast-icon">{ICONS[t.type] || ICONS.info}</div>
          <p className="toast-message">{t.message}</p>
          <button
            className="toast-close"
            onClick={() => onClose(t.id)}
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
          <div className="toast-progress" />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;