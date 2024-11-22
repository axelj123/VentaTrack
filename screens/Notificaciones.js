import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import { getCriticalNotifications } from '../database';
import { registerForPushNotificationsAsync, sendLocalNotification, sendNotificationToBackend } from '../components/NotificationsPush';

const Notificaciones = () => {
  const [notifications, setNotifications] = useState([]);
  const db = useSQLiteContext();
  const [deviceToken, setDeviceToken] = useState(null);
  const notificationInterval = 5 * 60 * 1000; // 5 minutos

  const fetchDeviceToken = async () => {
    try {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        console.log('Token recibido:', token);
        setDeviceToken(token);
      } else {
        console.log('No se pudo obtener el token de dispositivo');
      }
    } catch (error) {
      console.error('Error al obtener el token:', error);
    }
  };

  const fetchAndSendNotifications = async () => {
    try {
      const criticalNotifications = await getCriticalNotifications(db);

      if (!criticalNotifications || criticalNotifications.length === 0) {
        console.log('No hay notificaciones críticas.');
        return;
      }

      const now = new Date();

      // Formatear notificaciones con hora única
      const formattedNotifications = criticalNotifications.map((notification, index) => ({
        id: notification.id || index + 1,
        title: '⚠️ Bajo Stock',
        description: `El producto ${notification.product_name} tiene un stock de ${notification.stock} unidades.`,
        read: false,
        time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`, // Hora única inicial
      }));

      setNotifications(formattedNotifications);

      if (deviceToken) {
        criticalNotifications.forEach((notification, index) => {
          setTimeout(() => {
            const sendTime = new Date(); // Registrar la hora exacta de envío

            sendNotificationToBackend(
              deviceToken,
              '⚠️ Bajo Stock',
              `El producto ${notification.product_name} tiene un stock de ${notification.stock} unidades.`
            );

            console.log(
              `Notificación enviada para: ${notification.product_name} a las ${sendTime.getHours()}:${sendTime.getMinutes()}:${sendTime.getSeconds()}`
            );

            // Actualizar la notificación con la hora exacta
            setNotifications((prev) =>
              prev.map((n) =>
                n.id === notification.id
                  ? { ...n, time: `${sendTime.getHours()}:${sendTime.getMinutes()}:${sendTime.getSeconds()}` }
                  : n
              )
            );
          }, index * notificationInterval);
        });
      }
    } catch (error) {
      console.error('Error al cargar y enviar notificaciones:', error);
    }
  };

  useEffect(() => {
    fetchDeviceToken();
    fetchAndSendNotifications();
  }, []);

  const getIconName = (type) => {
    switch (type) {
      case 'sale':
        return 'cash-outline';
      case 'inventory':
        return 'cube-outline';
      case 'client':
        return 'person-add-outline';
      case 'achievement':
        return 'trophy-outline';
      case 'reminder':
        return 'calendar-outline';
      default:
        return 'notifications-outline';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <TouchableOpacity style={styles.clearButton} onPress={sendLocalNotification}>
          <Text style={styles.clearButtonText}>Limpiar todo</Text>
        </TouchableOpacity>
      </View>

      {/* Notification Counter */}
      <View style={styles.counter}>
        <View style={styles.badgeContainer}>
          <Ionicons name="notifications" size={24} color="#6B21A8" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {notifications.filter((n) => !n.read).length}
            </Text>
          </View>
        </View>
        <Text style={styles.counterText}>Nuevas notificaciones</Text>
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.notificationList}>
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationItem,
              !notification.read && styles.unreadNotification,
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                !notification.read && styles.unreadIconContainer,
              ]}
            >
              <Ionicons
                name={getIconName(notification.type)}
                size={24}
                color={!notification.read ? '#FFFFFF' : '#6B21A8'}
              />
            </View>
            <View style={styles.notificationContent}>
              <Text
                style={[
                  styles.notificationTitle,
                  !notification.read && styles.unreadText,
                ]}
              >
                {notification.title}
              </Text>
              <Text style={styles.notificationDescription}>
                {notification.description}
              </Text>
              <Text style={styles.notificationTime}>{notification.time}</Text>
            </View>
            {!notification.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#6B21A8',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  counter: {
    padding: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  badgeContainer: {
    position: 'relative',
    marginRight: 12,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#6B21A8',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  counterText: {
    color: '#6B21A8',
    fontSize: 16,
    fontWeight: '600',
  },
  notificationList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'center',
  },
  unreadNotification: {
    backgroundColor: '#F3E8FF',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  unreadIconContainer: {
    backgroundColor: '#6B21A8',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  unreadText: {
    color: '#6B21A8',
    fontWeight: '700',
  },
  notificationDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6B21A8',
    marginLeft: 8,
  },
});

export default Notificaciones;