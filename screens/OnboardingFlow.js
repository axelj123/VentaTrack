import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, SafeAreaView, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import FormRegisterCuenta from '../components/FormRegisterCuenta'; // El componente FormRegisterCuenta
import { useSQLiteContext } from 'expo-sqlite';
const { width, height } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createUsuario,createEmpresa,getAllUsuarios,getAllEmpresa } from '../database';
const OnboardingFlow = () => {
    const db = useSQLiteContext();
    const navigation = useNavigation();

    const [step, setStep] = useState(0); // Comienza en el paso 0
    const [formData, setFormData] = useState({
        // Datos del Usuario
        nombre_completo: '',
        email: '',
        contraseña: '',
        confirmar_contraseña: '',
        // Datos de la Empresa
        nombre_empresa: '',
        direccion_empresa: '',
        telefono_empresa: '',
        correo_contacto: '',
        ruc: ''
    });
    const inspectDatabase = async () => {
        try {
          const usuarios = await getAllUsuarios(db);
          const empresa=await getAllEmpresa(db); 
          console.log('Contenido actual de la tabla Usuario:', usuarios);
          console.log('Contenido actual de la tabla Empresa:', empresa);

        } catch (error) {
          console.error('Error inspeccionando la base de datos:', error);
        }
      };
      
      useEffect(() => {
        inspectDatabase();
      }, []);

    const handleSaveData = async (userData) => {
        // Actualizamos el formulario con los nuevos datos
        setFormData((prev) => ({
          ...prev,
          ...userData,
        }));
      
        // Paso 1: Guardamos los datos y avanzamos al paso siguiente
        if (step === 1) {
          setStep(2); // Avanza al segundo paso
        } else if (step === 2) {
          setStep(3); // Avanza al formulario de la empresa
        } else {
          // Paso 3: Último paso, registrar todos los datos en la base de datos
          try {
      
            // Registrar el usuario
            const usuarioId = await createUsuario(db, {
              nombre_completo: formData.nombre_completo,
              email: formData.email,
              contraseña: formData.contraseña,
            });
      
            console.log('Usuario creado con ID:', usuarioId);
      
            // Registrar la empresa
            const empresaId = await createEmpresa(db, {
              nombre: formData.nombre_empresa,
              direccion: formData.direccion_empresa,
              telefono: formData.telefono_empresa,
              correo_contacto: formData.correo_contacto,
              ruc: formData.ruc,
            });
      
            console.log('Empresa creada con ID:', empresaId);
           
            handleFinalizar();
          } catch (error) {
            console.error('Error al registrar los datos:', error);
          }
        }
      };
      const handleFinalizar = async () => {
        try {
          await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
          console.log('Onboarding completado');
          navigation.navigate('TabNavigator');  // Reemplaza la pantalla actual con MAIN
        } catch (error) {
          console.error('Error al guardar el estado de onboarding:', error);
        }
      };
    

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const screens = [
        // Primera presentación
        {
            title: "Gestiona tu Inventario",
            content: (
                <View style={styles.presentationContainer}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require('../assets/inventory-management.jpg')}
                            style={styles.presentationImage}
                        />
                    </View>
                    <Text style={styles.presentationTitle}>
                        Gestiona tu Inventario
                    </Text>
                    <Text style={styles.presentationDescription}>
                        Optimiza el control de tu inventario con InvenTrack Pro.
                        Gestiona productos, stock y más de manera eficiente.
                    </Text>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => setStep(1)} // Comienza con el primer formulario
                    >
                        <Text style={styles.primaryButtonText}>Comenzar</Text>
                    </TouchableOpacity>
                </View>
            )
        },
        // Primer formulario (Datos del Usuario)
        {
            title: "Datos del Usuario",
            content: (
                <FormRegisterCuenta
                    formData={formData}
                    handleInputChange={handleInputChange}
                    onSubmit={handleSaveData}
                    step={step} // Pasamos el paso actual como prop
                    setStep={setStep} // Pasamos la función setStep como prop
                />
            )
        },
        // Segunda presentación (Configura tu Empresa)
        {
            title: "Configura tu Empresa",
            content: (
                <View style={styles.presentationContainer}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require('../assets/business-setup.jpg')}
                            style={styles.presentationImage}
                        />
                    </View>
                    <Text style={styles.presentationTitle}>
                        Configura tu Empresa
                    </Text>
                    <Text style={styles.presentationDescription}>
                        Personaliza la información de tu empresa para una mejor
                        gestión y seguimiento de tu inventario.
                    </Text>
                    <View style={styles.rowButton}>
                        <TouchableOpacity
                            style={styles.primaryButtonBack}
                            onPress={() => setStep(1)} // Retrocede al formulario
                        >
                            <Text style={styles.primaryButtonBackText}>Regresar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={() => setStep(3)} // Avanza al formulario de la empresa
                        >
                            <Text style={styles.primaryButtonText}>Configurar</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            )
        },
        // Segundo formulario (Datos de la Empresa)
        {
            title: "Datos de la Empresa",
            content: (
                <FormRegisterCuenta
                    formData={formData}
                    handleInputChange={handleInputChange}
                    onSubmit={handleSaveData}
                    step={step} // Pasamos el paso actual como prop
                    setStep={setStep} // Pasamos la función setStep como prop
                />
            )
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            {screens[step].content}

            <View style={styles.dotsContainer}>
                {screens.map((_, index) => (
                    <View
                        key={index}
                        style={[styles.dot, index === step ? styles.activeDot : null]}
                    />
                ))}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    presentationContainer: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowButton: {
        flexDirection: 'row',
        gap: 12,

    },
    imageContainer: {
        width: width * 0.8,
        height: height * 0.35,
        marginBottom: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    presentationImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    presentationTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 16
    },
    presentationDescription: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
        paddingHorizontal: 24
    },
    formContainer: {
        flex: 1
    },
    formContent: {
        padding: 24,
        paddingTop: 40
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8
    },
    formSubtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 32
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        fontSize: 16,
        color: '#1F2937'
    },
    primaryButtonBack: {
        borderRadius: 8,
        padding: 16,
        borderColor: '#6B21A8',
        borderWidth: 1,
        alignItems: 'center',
        marginTop: 24
    },
    primaryButtonBackText: {
        color: '#6B21A8',
        fontSize: 16,

        fontWeight: '600'
    },
    primaryButton: {
        backgroundColor: '#6B21A8',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 24
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 20
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 4
    },
    activeDot: {
        backgroundColor: '#6b46c1'
    }
});

export default OnboardingFlow;