// App.js
import React, { useEffect } from 'react';
import { SQLiteProvider } from 'expo-sqlite';

import { ToastProvider } from './components/ToastContext';
import Navigation from './Navigation'; // Suponiendo que tienes un archivo de navegación
import { CartProvider } from './components/CartContext';
import { initDatabase } from './database';
import { registerForPushNotificationsAsync } from './components/NotificationsPush';
export default function App() {
  useEffect(() => {
    // Configurar las notificaciones push
    const setupNotifications = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          console.log('Push Notification Token:', token);
          // Si lo deseas, puedes guardar este token en SQLite para futuras configuraciones
          // Ejemplo:
          // await saveTokenToDatabase(token);
        }
      } catch (error) {
        console.error('Error al configurar notificaciones push:', error);
      }
    };

    setupNotifications();
  }, []);
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
