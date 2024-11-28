import React, { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { initializeNotificationSystem, checkLowStock } from './NotificationsPush';

const NotificationInitializer = () => {
  const db = useSQLiteContext();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        await initializeNotificationSystem(db);
      } catch (error) {
        console.error('Error en configuración inicial:', error);
      }
    };

    const handleAppStateChange = async (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) && 
        nextAppState === 'active'
      ) {
        console.log('App regresó al primer plano - verificando stock');
        await checkLowStock(db);
      }
      appState.current = nextAppState;
    };

    setupNotifications();
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    const interval = setInterval(() => {
      if (appState.current === 'active') {
        checkLowStock(db);
      }
    }, 10000);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, [db]);

  return null;
};

export default NotificationInitializer;