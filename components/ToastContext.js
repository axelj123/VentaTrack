import React, { createContext, useState, useContext, useCallback } from 'react';
import Toast from './Toast';

// Creamos el contexto
const ToastContext = createContext();

// Hook para acceder al contexto
export const useToast = () => {
  return useContext(ToastContext);
};

// ToastProvider que será el proveedor del contexto
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
          onAction={toast.onAction} // Pasar la acción personalizada
          onHide={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
};
