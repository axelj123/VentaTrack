import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configurar el comportamiento de las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Obtener el token del dispositivo para notificaciones push
export const registerForPushNotificationsAsync = async () => {
  if (!Device.isDevice) {
    alert('Las notificaciones push solo funcionan en dispositivos físicos.');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('No se otorgaron permisos para notificaciones.');
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return token;
};

// Enviar una notificación local (prueba)
export const sendLocalNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '¡Notificación de prueba!',
        body: 'Esta es una notificación local de prueba.',
      },
      trigger: {
        seconds: 2, // Enviar la notificación después de 2 segundos
      },
    });
  };