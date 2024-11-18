import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const FormInput = ({ label, error, ...props }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={[styles.input, error && styles.inputError]}
      placeholderTextColor="#9CA3AF"
      {...props}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const FormRegisterCuenta = ({ formData, handleInputChange, step,setStep, onSubmit }) => {
    const [errors, setErrors] = useState({}); // Estado para manejar los errores
  
    const handleNext = () => {
      const newErrors = {};
  
      if (step === 1) {
        // Validaciones para los datos del usuario
        if (!formData.nombre_completo) {
          newErrors.nombre_completo = 'El nombre es requerido';
        }
        if (!formData.email) {
          newErrors.email = 'El email es requerido';
        }
        if (!formData.contraseña) {
          newErrors.contraseña = 'La contraseña es requerida';
        }
        if (formData.contraseña !== formData.confirmar_contraseña) {
          newErrors.confirmar_contraseña = 'Las contraseñas no coinciden';
        }
      } else if (step === 3) {
        // Validaciones para los datos de la empresa
        if (!formData.nombre_empresa) {
          newErrors.nombre_empresa = 'El nombre de la empresa es requerido';
        }
        if (!formData.direccion_empresa) {
          newErrors.direccion_empresa = 'La dirección es requerida';
        }
        if (!formData.telefono_empresa) {
          newErrors.telefono_empresa = 'El teléfono es requerido';
        }
        if (!formData.correo_contacto) {
          newErrors.correo_contacto = 'El correo de contacto es requerido';
        }
        if (!formData.ruc) {
          newErrors.ruc = 'El RUC es requerido';
        }
      }
  
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
  
      // Si no hay errores, pasamos el control a handleSaveData
      onSubmit(formData);
    };
  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setStep(prev => prev - 1)}
            disabled={step === 0} // Deshabilitar botón de retroceso en el primer paso
          >
            <AntDesign name="arrowleft" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>{step === 1 ? 'Crear Cuenta' : 'Datos de la Empresa'}</Text>
            <Text style={styles.subtitle}>{step === 1 ? 'Ingresa tus datos personales' : 'Ingresa los datos de la empresa'}</Text>
          </View>
        </View>

        <View style={styles.formCard}>
          {step === 1 ? (
            <>
              <FormInput
                label="Nombre completo"
                placeholder="Ej: Juan Pérez"
                value={formData.nombre_completo}
                onChangeText={(value) => handleInputChange('nombre_completo', value)}
                error={errors.nombre_completo}
                autoCapitalize="words"
              />
    
              <FormInput
                label="Email"
                placeholder="ejemplo@correo.com"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                error={errors.email}
                autoCapitalize="none"
              />
    
    <FormInput
                label="Contraseña"
                placeholder="Mínimo 8 caracteres"
                secureTextEntry
                value={formData.contraseña}
                onChangeText={(value) => handleInputChange('contraseña', value)}
                error={errors.contraseña}
              />
               <FormInput
                label="Confirmar contraseña"
                placeholder="Repite tu contraseña"
                secureTextEntry
                value={formData.confirmar_contraseña}
                onChangeText={(value) => handleInputChange('confirmar_contraseña', value)}
                error={errors.confirmar_contraseña}
              />
            </>
          ) : (
            <>
              <FormInput
                label="Nombre de la empresa"
                placeholder="Ej: Tech Innovators"
                value={formData.nombre_empresa}
                onChangeText={(value) => handleInputChange('nombre_empresa', value)}
                error={errors.nombre_empresa}
                autoCapitalize="words"
              />
    
              <FormInput
                label="Dirección de la empresa"
                placeholder="Ej: Calle 123, Ciudad"
                value={formData.direccion_empresa}
                onChangeText={(value) => handleInputChange('direccion_empresa', value)}
                error={errors.direccion_empresa}
              />
    
              <FormInput
                label="Teléfono de la empresa"
                placeholder="Ej: 987654321"
                keyboardType="phone-pad"
                value={formData.telefono_empresa}
                onChangeText={(value) => handleInputChange('telefono_empresa', value)}
                error={errors.telefono_empresa}
              />
    
              <FormInput
                label="Correo de contacto"
                placeholder="contacto@empresa.com"
                keyboardType="email-address"
                value={formData.correo_contacto}
                onChangeText={(value) => handleInputChange('correo_contacto', value)}
                error={errors.correo_contacto}
                autoCapitalize="none"
              />
    
              <FormInput
                label="RUC de la empresa"
                placeholder="Ej: 123456789"
                keyboardType="numeric"
                value={formData.ruc}
                onChangeText={(value) => handleInputChange('ruc', value)}
                error={errors.ruc}
              />
            </>
          )}
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleNext}
        >
          <Text style={styles.submitButtonText}>{step === 1 ? 'Siguiente' : 'Finalizar'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    marginTop:20,
  },
  content: {
    padding: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#6B21A8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: "#6b46c1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FormRegisterCuenta;
