// App.js
import React from 'react';
import { ToastProvider } from './components/ToastContext';
import Navigation from './Navigation'; // Suponiendo que tienes un archivo de navegación
import { CartProvider } from './components/CartContext';
export default function App() {



  return (
    <CartProvider>


    <ToastProvider>
      <Navigation />
    </ToastProvider>
    </CartProvider>

  );
}
