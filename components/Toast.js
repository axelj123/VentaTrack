import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Componente Toast
const Toast = ({ title, message, type, onHide }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0, // Cambiado a 0 para que aparezca desde arriba
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
          toValue: -100, // Se mantiene para que desaparezca hacia arriba
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

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return styles.successToast;
      case 'warning':
        return styles.warningToast;
      default:
        return styles.infoToast;
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case 'success':
        return styles.successText;
      case 'warning':
        return styles.warningText;
      default:
        return styles.infoText;
    }
  };

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

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return styles.successIcon;
      case 'warning':
        return styles.warningIcon;
      default:
        return styles.infoIcon;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        getToastStyle(),
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Ionicons
        name={getIcon()}
        size={24}
        style={[styles.icon, getIconColor()]}
      />
      <View style={styles.textContainer}>
        <Text style={[styles.title, getTextStyle()]}>{title}</Text>
        <Text style={[styles.message, getTextStyle()]}>{message}</Text>
      </View>
    </Animated.View>
  );
};

// Hook personalizado para usar el Toast
export const useToast = () => {
  const [toastConfig, setToastConfig] = useState(null);

  const showToast = useCallback((title, message, type = 'info') => {
    setToastConfig({ title, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToastConfig(null);
  }, []);

  return {
    Toast: toastConfig ? (
      <Toast
        title={toastConfig.title}
        message={toastConfig.message}
        type={toastConfig.type}
        onHide={hideToast}
      />
    ) : null,
    showToast,
  };
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, // Cambiado para posicionar en la parte superior
    alignSelf: 'center',
    height: 80,
    width: 380,
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
    marginTop: 35, // Añadido un pequeño margen superior
  },
  infoToast: {
    backgroundColor: 'white',
    borderLeftWidth: 5,
    borderLeftColor: '#0066cc',
  },
  successToast: {
    backgroundColor: 'white',
    borderLeftWidth: 5,
    borderLeftColor: '#18aa6f',
  },
  warningToast: {
    backgroundColor: 'white',
    borderLeftWidth: 5,
    borderLeftColor: '#cc6600',
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
  },
  infoText: {
    color: '#0066cc',
  },
  successText: {
    color: '#18aa6f',
  },
  warningText: {
    color: '#cc6600',
  },
  infoIcon: {
    color: '#0066cc',
  },
  successIcon: {
    color: '#18aa6f',
  },
  warningIcon: {
    color: '#cc6600',
  },
});

export default Toast;