import React, { useState, useRef } from 'react';
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
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CustomInput from '../components/CustomInput';
import { useToast } from '../components/ToastContext';

const { width, height } = Dimensions.get('window');

const Register = () => {
    const { showToast } = useToast();
    const navigation = useNavigation();

    const [step, setStep] = useState(1); 
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    const validateForm = () => {
        const newErrors = {};

        if (!fullName) {
            newErrors.fullName = 'El nombre es requerido';
        }

        if (!email) {
            newErrors.email = 'El correo es requerido';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Ingrese un correo válido';
        }

        if (!password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            newErrors.password = 'La contraseña debe contener mayúsculas, minúsculas y números';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Confirme su contraseña';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateVerificationCode = () => {
        const newErrors = {};

        if (!verificationCode) {
            newErrors.verificationCode = 'El código es requerido';
        } else if (verificationCode.length !== 6) {
            newErrors.verificationCode = 'El código debe tener 6 dígitos';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateForm()) {
            showToast('Por favor, corrija los errores del formulario', 'error');
            return;
        }

        try {
            setIsLoading(true);
            Keyboard.dismiss();

            await new Promise(resolve => setTimeout(resolve, 1500));

            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: -width,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setStep(2);
                fadeAnim.setValue(1);
                slideAnim.setValue(0);
            });

            showToast('Código de verificación enviado a su correo', 'success');
        } catch (error) {
            showToast('Error al registrar usuario. Intente nuevamente.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerification = async () => {
        if (!validateVerificationCode()) {
            showToast('Por favor, ingrese el código válido', 'error');
            return;
        }

        try {
            setIsLoading(true);
            Keyboard.dismiss();

            await new Promise(resolve => setTimeout(resolve, 1500));


            showToast('¡Registro exitoso!', 'success');
            navigation.navigate('Login');
        } catch (error) {
            showToast('Error al verificar código. Intente nuevamente.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        try {
            setIsLoading(true);

            await new Promise(resolve => setTimeout(resolve, 1500));

            showToast('Nuevo código enviado a su correo', 'success');
        } catch (error) {
            showToast('Error al reenviar código. Intente nuevamente.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                                opacity: fadeAnim,
                                transform: [{ translateX: slideAnim }],
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
                            <Text style={styles.subtitleText}>
                                {step === 1 ? 'Crea tu cuenta para comenzar' : 'Verifica tu correo electrónico'}
                            </Text>
                        </View>

                        <View style={styles.formContainer}>
                            {step === 1 ? (
                                <>
                                    <CustomInput
                                        value={fullName}
                                        placeholder="Nombre completo"
                                        focusedBorderColor="#211132"
                                        unfocusedBorderColor="#999"
                                        placeholderTextColor="#999"
                                        errorMessage={errors.fullName}
                                        onChangeText={(text) => {
                                            setFullName(text);
                                            if (errors.fullName) {
                                                setErrors(prev => ({ ...prev, fullName: '' }));
                                            }
                                        }}
                                        leftIcon={
                                            <FontAwesome name="user" size={20} color="#666" />
                                        }
                                    />

                                    <CustomInput
                                        value={email}
                                        placeholder="Correo electrónico"
                                        focusedBorderColor="#211132"
                                        unfocusedBorderColor="#999"
                                        placeholderTextColor="#999"
                                        errorMessage={errors.email}
                                        onChangeText={(text) => {
                                            setEmail(text);
                                            if (errors.email) {
                                                setErrors(prev => ({ ...prev, email: '' }));
                                            }
                                        }}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        leftIcon={
                                            <FontAwesome name="envelope" size={20} color="#666" />
                                        }
                                    />
                                    <CustomInput
                                        value={password}
                                        placeholder="Contraseña"
                                        focusedBorderColor="#211132"
                                        unfocusedBorderColor="#999"
                                        placeholderTextColor="#999"
                                        errorMessage={errors.password}
                                        showError={true}
                                        onChangeText={(text) => {
                                            setPassword(text);
                                            if (errors.password) {
                                                setErrors((prev) => ({ ...prev, password: '' }));
                                            }
                                        }}
                                        secureTextEntry={!isPasswordVisible}
                                        autoCapitalize="none" 
                                        leftIcon={
                                            <FontAwesome name="lock" size={20} color="#666" />
                                        }
                                        rightIcon={
                                            <TouchableOpacity
                                                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                                            >
                                                <FontAwesome
                                                    name={isPasswordVisible ? "eye-slash" : "eye"}
                                                    size={20}
                                                    color="#666"
                                                />
                                            </TouchableOpacity>
                                        }
                                    />

                                    <CustomInput
                                        value={confirmPassword}
                                        placeholder="Confirmar contraseña"
                                        focusedBorderColor="#211132"
                                        unfocusedBorderColor="#999"
                                        placeholderTextColor="#999"
                                        errorMessage={errors.confirmPassword}
                                        showError={true}
                                        onChangeText={(text) => {
                                            setConfirmPassword(text);
                                            if (errors.confirmPassword) {
                                                setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                                            }
                                        }}
                                        secureTextEntry={!isConfirmPasswordVisible}
                                        autoCapitalize="none" 
                                        leftIcon={
                                            <FontAwesome name="lock" size={20} color="#666" />
                                        }
                                        rightIcon={
                                            <TouchableOpacity
                                                onPress={() =>
                                                    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                                                }
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
                                        style={[
                                            styles.button,
                                            isLoading && styles.buttonDisabled
                                        ]}
                                        onPress={handleRegister}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text style={styles.buttonText}>REGISTRARSE</Text>
                                        )}
                                    </TouchableOpacity>
                                </>
                            ) : (
                         
                                <>
                                    <Text style={styles.verificationText}>
                                        Hemos enviado un código de verificación a:
                                    </Text>
                                    <Text style={styles.emailText}>{email}</Text>

                                    <CustomInput
                                        value={verificationCode}
                                        containerStyle={styles.input}
                                        placeholder="Código de verificación"
                                        focusedBorderColor="#211132"
                                        unfocusedBorderColor="#999"
                                        placeholderTextColor="#999"
                                        errorMessage={errors.verificationCode}
                                        onChangeText={(text) => {
                                            setVerificationCode(text);
                                            if (errors.verificationCode) {
                                                setErrors(prev => ({ ...prev, verificationCode: '' }));
                                            }
                                        }}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                        leftIcon={
                                            <FontAwesome name="key" size={20} color="#666" />
                                        }
                                    />

                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            isLoading && styles.buttonDisabled
                                        ]}
                                        onPress={handleVerification}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text style={styles.buttonText}>VERIFICAR</Text>
                                        )}
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.resendButton}
                                        onPress={handleResendCode}
                                        disabled={isLoading}
                                    >
                                        <Text style={styles.resendButtonText}>
                                            ¿No recibiste el código? Reenviar
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            )}

                            <TouchableOpacity
                                style={styles.loginButton}
                                onPress={() => navigation.navigate('Login')}
                            >
                                <Text style={styles.loginButtonText}>
                                    ¿Ya tienes cuenta? Inicia sesión
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
        paddingTop: height * 0.05,
    },
    brandContainer: {
        alignItems: 'center',
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
        fontSize: 32,
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
    formContainer: {
        marginTop: 40,
        backgroundColor: '#fff',
        borderRadius: 30,
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
    button: {
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
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    loginButton: {
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    loginButtonText: {
        color: '#6B21A8',
        fontSize: 14,
        fontWeight: '500',
    },
    verificationText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 8,
    },
    emailText: {
        fontSize: 16,
        color: '#6B21A8',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 24,
    },
    resendButton: {
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resendButtonText: {
        color: '#6B21A8',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default Register;
