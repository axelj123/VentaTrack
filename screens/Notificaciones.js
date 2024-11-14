import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const Notificaciones = () => {
  const [notifications] = useState([
    {
      id: 1,
      title: 'Nueva Venta Registrada',
      description: 'Venta de S/. 150.00 del Producto A',
      time: '2 min',
      read: false,
      type: 'sale'
    },
    {
      id: 2,
      title: 'Stock Bajo',
      description: 'El Producto B tiene menos de 5 unidades',
      time: '1h',
      read: false,
      type: 'inventory'
    },
    {
      id: 3,
      title: 'Nuevo Cliente',
      description: 'Juan Pérez se ha registrado como cliente',
      time: '3h',
      read: false,
      type: 'client'
    },
    {
      id: 4,
      title: 'Meta Alcanzada',
      description: '¡Felicitaciones! Has alcanzado la meta de ventas diaria',
      time: '4h',
      read: true,
      type: 'achievement'
    },
    {
      id: 5,
      title: 'Recordatorio de Pedido',
      description: 'Tienes un pedido pendiente de entrega para hoy',
      time: '5h',
      read: true,
      type: 'reminder'
    }
  ]);

  const getIconName = (type) => {
    switch(type) {
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
        <TouchableOpacity style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Limpiar todo</Text>
        </TouchableOpacity>
      </View>

      {/* Notification Counter */}
      <View style={styles.counter}>
        <View style={styles.badgeContainer}>
          <Ionicons name="notifications" size={24} color="#6B21A8" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {notifications.filter(n => !n.read).length}
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
              !notification.read && styles.unreadNotification
            ]}
          >
            <View style={[
              styles.iconContainer,
              !notification.read && styles.unreadIconContainer
            ]}>
              <Ionicons
                name={getIconName(notification.type)}
                size={24}
                color={!notification.read ? '#FFFFFF' : '#6B21A8'}
              />
            </View>
            <View style={styles.notificationContent}>
              <Text style={[
                styles.notificationTitle,
                !notification.read && styles.unreadText
              ]}>
                {notification.title}
              </Text>
              <Text style={styles.notificationDescription}>
                {notification.description}
              </Text>
              <Text style={styles.notificationTime}>
                {notification.time}
              </Text>
            </View>
            {!notification.read && (
              <View style={styles.unreadDot} />
            )}
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