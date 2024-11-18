import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const GetStarted = () => {
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate('OnboardingFlow');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#6B21A8', '#4C1D95']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Decorative circles */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <View style={styles.brandContainer}>
              <View style={styles.iconWrapper}>
                <FontAwesome5 name="box-open" size={32} color="#fff" />
              </View>
              <Text style={styles.welcomeText}>InvenTrack Pro</Text>
            </View>
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <View style={[styles.divider, styles.dividerShort]} />
            </View>
            <Text style={styles.subtitleText}>
              Tu solución integral para{'\n'}gestión de inventario
            </Text>
          </View>

          <View style={styles.decorationContainer}>
            {[...Array(3)].map((_, i) => (
              <View 
                key={i}
                style={[
                  styles.decorationLine,
                  { 
                    width: width * (0.7 - i * 0.2),
                    opacity: 0.8 - i * 0.2
                  }
                ]} 
              />
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.loginButton]}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#ffffff', '#f3f4f6']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.loginButtonText}>Empezar</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.registerButton]}
              onPress={handleRegister}
              activeOpacity={0.8}
            >
              <Text style={styles.registerButtonText}>Conoce al Desarrollador</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerContent}>
              <Text style={styles.footerText}>InvenTrack Pro v1.0</Text>
              <View style={styles.footerDivider} />
              <Text style={styles.copyrightText}>InvenTrack Pro © 2024</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    position: 'relative',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: height * 0.4,
    height: height * 0.4,
    borderRadius: height * 0.2,
    backgroundColor: 'rgba(233, 213, 255, 0.1)',
    top: -height * 0.1,
    right: -width * 0.2,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: height * 0.3,
    height: height * 0.3,
    borderRadius: height * 0.15,
    backgroundColor: 'rgba(233, 213, 255, 0.08)',
    bottom: -height * 0.05,
    left: -width * 0.15,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: height * 0.1,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 24,
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
  welcomeText: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 1,
  },
  dividerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    width: 40,
    height: 4,
    backgroundColor: '#E9D5FF',
    borderRadius: 2,
    marginBottom: 8,
  },
  dividerShort: {
    width: 20,
    opacity: 0.6,
  },
  subtitleText: {
    fontSize: 18,
    color: '#E9D5FF',
    textAlign: 'center',
    lineHeight: 28,
    opacity: 0.9,
  },
  decorationContainer: {
    alignItems: 'flex-end',
    marginTop: height * 0.08,
    gap: 12,
  },
  decorationLine: {
    height: 2,
    backgroundColor: 'rgba(233, 213, 255, 0.2)',
    borderRadius: 1,
  },
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: 40,
    gap: 16,
    paddingHorizontal: 12,
  },
  button: {
    height: 60,
    borderRadius: 20,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  loginButtonText: {
    color: '#6B21A8',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(233, 213, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  footerContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  footerDivider: {
    width: 20,
    height: 1,
    backgroundColor: 'rgba(233, 213, 255, 0.3)',
    marginVertical: 8,
  },
  footerText: {
    color: '#E9D5FF',
    fontSize: 14,
    fontWeight: '500',
  },
  copyrightText: {
    color: '#E9D5FF',
    fontSize: 12,
    opacity: 0.8,
  },
});

export default GetStarted;