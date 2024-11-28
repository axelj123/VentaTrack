import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CustomInput from '../components/CustomInput';
import { useToast } from '../components/ToastContext';

const { width, height } = Dimensions.get('window');

const Login = () => {
  const { showToast } = useToast();
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const fadeAnim = new Animated.Value(1);
  const translateY = new Animated.Value(0);

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Ingrese un correo válido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {

    try {
      setIsLoading(true);

      await new Promise(resolve => setTimeout(resolve, 1500));


      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      navigation.navigate('MAIN');
    } catch (error) {
      showToast('Error al iniciar sesión. Intente nuevamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  const handleRegister = async () => {
    navigation.navigate('Register');
  };

  const handleFocus = () => {
    Animated.timing(translateY, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableWithoutFeedback >
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#6B21A8', '#4C1D95']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />

          <Animated.View
            style={[
              styles.content,
              {
                transform: [{ translateY }],
                opacity: fadeAnim,
              }
            ]}
          >
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

            </View>

            <View style={styles.formContainer}>
              <CustomInput
                placeholder="Usuario"
                focusedBorderColor="#211132"
                unfocusedBorderColor="#999"
                placeholderTextColor="#999"
                errorMessage="Este campo es obligatorio"
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <CustomInput
                value={confirmPassword}
                placeholder="Confirmar contraseña"
                focusedBorderColor="#211132"
                unfocusedBorderColor="#999"
                placeholderTextColor="#999"
                errorMessage={errors.confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) {
                    setErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }
                }}
                secureTextEntry={!isConfirmPasswordVisible}
                leftIcon={
                  <FontAwesome name="lock" size={20} color="#666" />
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  >
                    <FontAwesome
                      name={isConfirmPasswordVisible ? "eye-slash" : "eye"}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                }
              />

              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.forgotPasswordText}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  isLoading && styles.loginButtonDisabled
                ]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#6B21A8" />
                ) : (
                  <Text style={styles.loginButtonText}>INICIAR SESIÓN</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleRegister}
              >
                <Text style={styles.registerButtonText}>
                  ¿No tienes cuenta? Regístrate
                </Text>
              </TouchableOpacity>
            </View>


          </Animated.View>
        </LinearGradient>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    paddingHorizontal: 0,
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
  formContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 600,
    paddingVertical: 32,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    gap: 16,
    width: '100%',
  },

  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },

  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },

  forgotPasswordText: {
    color: '#6B21A8',
    fontSize: 14,
    fontWeight: '500',
  },

  loginButton: {
    height: 56,
    backgroundColor: '#6B21A8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#6B21A8',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  loginButtonDisabled: {
    opacity: 0.7,
  },

  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  registerButton: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  registerButtonText: {
    color: '#6B21A8',
    fontSize: 14,
    fontWeight: '500',
  },

  inputContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },

  inputIcon: {
    color: '#6B21A8',
  },

  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },

});

export default Login;