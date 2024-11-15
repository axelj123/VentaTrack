import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import CustomInput from '../components/CustomInput';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { initDatabase,deleteDatabase,obtenerHoraYfecha } from '../database'; // Importa la función de inicialización de la base de datos
import * as FileSystem from 'expo-file-system';
import { useToast } from '../components/ToastContext';



const Login = () => {
  const { showToast } = useToast(); // Usamos el hook para acceder al showToast

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigation = useNavigation();
  const dbUri = `${FileSystem.documentDirectory}SQLite/VentasDB.db`; // Ruta de la base de datos

  useEffect(() => {
  
  
    initializeDB();
  }, []);
  const initializeDB = async () => {

    try {
      // Verifica si la base de datos ya existe
      const dbExists = await FileSystem.getInfoAsync(dbUri);

      if (!dbExists.exists) {
        showToast('Info', 'Inicializando la base de datos por primera vez...', 'info');

        await initDatabase();
      } else {
        showToast('Info', 'La base de datos ya existe, se omite la inicialización.', 'info');
        showToast('Info', `Base de datos ubicada en: ${dbUri}`, 'info'); 

      }
    } catch (error) {
      showToast('Info', 'Error al inicializar la base de datos', 'info');
    }
  };
 // Función para eliminar la base de datos
 const handleDeleteDatabase = async () => {
  try {
    const result = await deleteDatabase();
    if (result) {
      Alert.alert('Éxito', 'Base de datos eliminada correctamente');
      return true;
    } else {
      Alert.alert('Info', 'No existe base de datos para eliminar');
      return false;
    }
  } catch (error) {
    console.error('Error al eliminar la base de datos:', error);
    Alert.alert('Error', 'No se pudo eliminar la base de datos');
    return false;
  }
};
  const handleLogin = () => {

    navigation.navigate('MAIN');
  };
  const handleForgotPassword = async () => {
    await obtenerHoraYfecha();
  };
  return (

    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >

          <View style={styles.headerContainer}>
            <Text style={styles.welcomeText}> Log in</Text>
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <FontAwesome name="user" size={20} color="#666" style={styles.inputIcon} />
              <CustomInput
                containerStyle={styles.input}
                placeholder="Usuario"
                focusedBorderColor="#211132"         
                unfocusedBorderColor="#999"       
                placeholderTextColor="#999"          
                errorMessage="Este campo es obligatorio" 
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome name="lock" size={20} color="#666" style={styles.inputIcon} />
              <CustomInput
                containerStyle={styles.input}
                placeholder="Contraseña"
                focusedBorderColor="#211132"          
                unfocusedBorderColor="#999"       
                placeholderTextColor="#999"         
                errorMessage="Este campo es obligatorio"
                onChangeText={setPassword}
                error={passwordError}
                secureTextEntry
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>

            <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword} >
              <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>INICIAR SESIÓN</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Sistema de Inventario v1.0</Text>
              <Text style={styles.copyrightText}>Vida Divina S.A.C © 2024</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa', 
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
  },
  logoContainer: {
    width: 250,
    height: 250,
    alignItems: 'center',
    marginTop:30,
  
  },
  logo: {
    width: '80%',
    height: '80%',
  },
  welcomeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    textAlign: 'center',
  },

  formContainer: {
    flex: 0.6,
    backgroundColor: '#fff',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 25,
    
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 10,
  },
  inputIcon: {
    marginRight: 15,
    marginTop: 45,

  },
  input: {
    flex: 1,
    height: 50,
    marginTop: 45,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#666',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#B90909',
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
  
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 5,
  },
  copyrightText: {
    color: '#999',
    fontSize: 12,
  },
});

export default Login;
