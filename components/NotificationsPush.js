import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configurar el comportamiento de las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const sendNotificationToBackend = async (token, title, message) => {
  try {
    const response = await fetch('https://servicenotification-production.up.railway.app/sendNotification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        title: title,
        message: message,
      }),
    });

    const responseText = await response.text(); // Obtener texto de respuesta en lugar de JSON

    console.log('Respuesta del backend (texto):', responseText);
    console.log('Estatus de la respuesta:', response.status);

    if (!response.ok) {
      console.error('Error en la respuesta del backend:', response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error enviando la notificación:', error);
  }
};

export const registerForPushNotificationsAsync = async () => {
  if (Device.isDevice) {
    const { status } = await Notifications.requestPermissionsAsync(); // Solicitar permisos
    if (status !== 'granted') {
      alert('Se necesitan permisos para recibir notificaciones.');
      return null; // Retorna null si no se concede el permiso
    }
    const token = await Notifications.getExpoPushTokenAsync(); // Obtener el token
    return token.data; // Devolver el token
  } else {
    alert('Debe usar un dispositivo físico para recibir notificaciones push.');
    return null;
  }
};
