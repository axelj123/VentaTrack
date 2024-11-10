// App.js
import React from 'react';
import { ToastProvider } from './components/ToastContext';
import Navigation from './Navigation'; // Suponiendo que tienes un archivo de navegación

export default function App() {
  return (
    <ToastProvider>
      <Navigation />
    </ToastProvider>
  );
}
