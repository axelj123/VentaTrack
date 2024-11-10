// Toast.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ToastPrueba = ({ message, type, onHide }) => {
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(-100);

  useEffect(() => {
    // Animación de aparición
    Animated.sequence([
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 60,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(1200),
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => onHide());

  }, [fadeAnim, onHide, slideAnim]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'warning':
        return 'warning';
      default:
        return 'information-circle';
    }
  };

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: 'green' };
      case 'warning':
        return { backgroundColor: 'orange' };
      default:
        return { backgroundColor: 'blue' };
    }
  };

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        getToastStyle(),
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Ionicons name={getIcon()} size={24} style={styles.icon} />
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: '10%',
    right: '10%',
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    marginRight: 12,
  },
  toastText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default ToastPrueba;
