// NotificationsPush.js
import * as Notifications from 'expo-notifications';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { getCriticalNotifications } from '../database';

const BACKGROUND_FETCH_TASK = 'background-stock-check';
let globalDb = null;

// Configurar el manejador de notificaciones con alta prioridad
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

// Definir la tarea en segundo plano antes de cualquier otra operación
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  console.log('[Background Task] Iniciando verificación de stock...');
  try {
    if (!globalDb) {
      console.error('[Background Task] Base de datos no disponible');
      return BackgroundFetch.Result.FAILED;
    }

    const lowStockProducts = await getCriticalNotifications(globalDb);
    
    if (lowStockProducts.length > 0) {
      const productList = lowStockProducts
        .map(p => `${p.product_name} (${p.stock} unidades)`)
        .join('\n');

      await Notifications.scheduleNotificationAsync({
        content: {
          title: '⚠️ Alerta de Stock Bajo',
          body: `Los siguientes productos necesitan reposición:\n\n${productList}`,
          data: { timestamp: new Date().getTime() },
          sound: true,
          priority: 'max',
          vibrate: [0, 250, 250, 250],
        },
        trigger: null,
      });

      console.log('[Background Task] Notificación enviada:', lowStockProducts);
      return BackgroundFetch.Result.NEW_DATA;
    }

    console.log('[Background Task] No hay productos con stock bajo');
    return BackgroundFetch.Result.NO_DATA;
  } catch (error) {
    console.error('[Background Task] Error:', error);
    return BackgroundFetch.Result.FAILED;
  }
});

export const initializeNotificationSystem = async (db) => {
  try {
    globalDb = db;
    console.log('Inicializando sistema de notificaciones...');

    // Verificar y solicitar permisos
    const permissionStatus = await requestNotificationPermissions();
    if (!permissionStatus) {
      throw new Error('No se obtuvieron permisos de notificación');
    }

    // Configurar canal de notificaciones en Android
    if (Platform.OS === 'android') {
      await setupNotificationChannel();
    }

    // Registrar la tarea en segundo plano
    await registerBackgroundTask();

    // Realizar primera verificación
    await checkLowStock(db);

    console.log('Sistema de notificaciones inicializado correctamente');
    return true;
  } catch (error) {
    console.error('Error en inicialización:', error);
    return false;
  }
};

const requestNotificationPermissions = async () => {
  if (!Device.isDevice) {
    console.warn('Dispositivo no físico detectado');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });
    finalStatus = status;
  }

  return finalStatus === 'granted';
};

const setupNotificationChannel = async () => {
  await Notifications.setNotificationChannelAsync('stock-alerts', {
    name: 'Alertas de Stock',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
    enableVibrate: true,
    enableLights: true,
  });
};

const registerBackgroundTask = async () => {
  try {
    // Verificar si la tarea ya está registrada
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    if (!isRegistered) {
      // Registrar la tarea con nueva configuración
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 10, // 10 segundos
        stopOnTerminate: false,
        startOnBoot: true,
      });
      
      console.log('Tarea en segundo plano registrada exitosamente');
    } else {
      console.log('La tarea en segundo plano ya estaba registrada');
    }

    return true;
  } catch (error) {
    console.error('Error al registrar tarea en segundo plano:', error);
    return false;
  }
};

export const checkLowStock = async (db) => {
  try {
    if (!db) return false;
    
    const lowStockProducts = await getCriticalNotifications(db);
    
    if (lowStockProducts.length > 0) {
      const productList = lowStockProducts
        .map(p => `${p.product_name} (${p.stock} unidades)`)
        .join('\n');

      await Notifications.scheduleNotificationAsync({
        content: {
          title: '⚠️ Alerta de Stock Bajo',
          body: `Los siguientes productos necesitan reposición:\n\n${productList}`,
          data: { timestamp: new Date().getTime() },
          sound: true,
          priority: 'max',
          vibrate: [0, 250, 250, 250],
        },
        trigger: null,
      });

      return true;
    }
    return false;
  } catch (error) {
    console.error('Error al verificar stock bajo:', error);
    return false;
  }
};