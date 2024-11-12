import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Toast = ({ title, message, type, onHide }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(3000), // Aumentado el tiempo de visualización
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

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return styles.successToast;
      case 'warning':
        return styles.warningToast;
      case 'error':
        return styles.errorToast;
      case 'info':
        return styles.infoToast;
      default:
        return styles.defaultToast;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'alert-circle';
      case 'info':
        return 'information-circle';
      default:
        return 'checkmark-circle';
    }
  };

  const getActionButton = () => {
    switch (type) {
      case 'success':
        return 'Undo';
      case 'info':
        return 'Update';
      case 'warning':
        return 'Show';
      case 'error':
        return 'View';
      default:
        return '';
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
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={getIcon()}
            size={24}
            color="white"
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.message}>{message}</Text>
        </View>
        {getActionButton() && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onHide}
          >
            <Text style={styles.actionButtonText}>{getActionButton()}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={onHide}
        >
          <Ionicons name="close" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// Hook personalizado para usar el Toast (sin cambios)
export const useToast = () => {
  const [toastConfig, setToastConfig] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToastConfig({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToastConfig(null);
  }, []);

  return {
    Toast: toastConfig ? (
      <Toast
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
    top: 0,
    alignSelf: 'center',
    width: '95%',
    maxWidth: 400,
    borderRadius: 8,
    marginTop: 35,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  actionButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
  // Estilos para diferentes tipos de toast
  successToast: {
    backgroundColor: '#2E7D32', // Verde
  },
  warningToast: {
    backgroundColor: '#ED6C02', // Naranja
  },
  errorToast: {
    backgroundColor: '#D32F2F', // Rojo
  },
  infoToast: {
    backgroundColor: '#0288D1', // Azul
  },
  defaultToast: {
    backgroundColor: '#424242', // Gris oscuro
  },
});

export default Toast;