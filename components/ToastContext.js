// ToastContext.js
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

  const showToast = useCallback((title,message, type = 'info') => {
    setToast({ title,message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && 
      <Toast 
      title={toast.title}
      message={toast.message} 
      type={toast.type}
       onHide={hideToast} />}
    </ToastContext.Provider>
  );
};
