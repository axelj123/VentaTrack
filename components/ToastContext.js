import React, { createContext, useState, useContext, useCallback } from 'react';
import Toast from './Toast';

const ToastContext = createContext();

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((title, message, type = 'info', onAction = null) => {
    setToast({ title, message, type, onAction });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <Toast
          title={toast.title}
          message={toast.message}
          type={toast.type}
          onAction={toast.onAction} 
          onHide={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
};
