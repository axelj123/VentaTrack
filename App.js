// App.js
import React, { useEffect } from 'react';
import { SQLiteProvider } from 'expo-sqlite';

import { ToastProvider } from './components/ToastContext';
import Navigation from './Navigation'; // Suponiendo que tienes un archivo de navegación
import { CartProvider } from './components/CartContext';
import { initDatabase } from './database';

export default function App() {



  return (
    <SQLiteProvider databaseName="VentasDB.db" onInit={initDatabase}>
      <CartProvider>
        <ToastProvider>
          <Navigation />
        </ToastProvider>
      </CartProvider>
    </SQLiteProvider>
  );
}
