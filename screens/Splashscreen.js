import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  LinearGradient,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome5 } from '@expo/vector-icons';

const SplashScreen = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.navigate('GetStarted');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={styles.circle} />
        <View style={[styles.circle, styles.circle2]} />
      </View>

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
    <View style={styles.iconWrapper}>
                <FontAwesome5 name="box-open" size={32} color="#fff" />
              </View>
        <Text style={styles.title}>InvenTrack Pro</Text>
        <Text style={styles.subtitle}>Sistema Inteligente de Gestión</Text>
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.infoContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.features}>
          <View style={styles.featureIcon}>
            <Ionicons name="cube" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.featureText}>Inventario Inteligente</Text>
        </View>
        <View style={styles.features}>
          <View style={styles.featureIcon}>
            <Ionicons name="trending-up" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.featureText}>Ventas Optimizadas</Text>
        </View>
        <View style={styles.features}>
          <View style={styles.featureIcon}>
            <Ionicons name="analytics" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.featureText}>Análisis en Tiempo Real</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Text style={styles.version}>Versión 1.0.0</Text>
      </Animated.View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6B21A8', // Color morado base
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  circle: {
    position: 'absolute',
    top: -height * 0.2,
    right: -width * 0.3,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: '#805AD5', // Color morado más claro
    opacity: 0.3,
  },
  circle2: {
    top: height * 0.5,
    left: -width * 0.3,
    backgroundColor: '#553C9A', // Color morado más oscuro
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: 'rgba(233, 213, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(233, 213, 255, 0.3)',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#E9D8FD', // Color lavanda claro
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  infoContainer: {
    width: '100%',
    paddingHorizontal: 40,
  },
  features: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  footer: {
    marginBottom: 20,
  },
  version: {
    color: '#E9D8FD',
    fontSize: 14,
  },
});

export default SplashScreen;