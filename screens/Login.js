// screens/Login.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ImageBackground, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import CustomInput from '../components/CustomInput'; // Verifica que la ruta sea correcta
import { useNavigation } from '@react-navigation/native'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigation = useNavigation();

  const handleHome = () => {
    Alert.alert('Inicio de sesión', `Correo: ${email} \nContraseña: ${password}`);
    navigation.navigate("HOME"); // Navega a la pantalla "HOME"
  };

  return (
    <ImageBackground
      source={require('../assets/background-login.jpg')} // Reemplaza con la ruta a tu imagen
      style={styles.background}
    >
      <View style={styles.containerLogo}>
        <View style={styles.blackRectangle}>
          <Image
            source={require('../assets/logo.png')} // Asegúrate de que la ruta sea correcta
            style={styles.logo}
          />
        </View>
      </View>

      <View style={styles.container}>
        <StatusBar style="auto" />

        <Text style={styles.title}>Login</Text>
        <CustomInput  
          containerStyle={{ marginHorizontal: 20 }}
          placeholder={'Email'}
          onChangeText={setEmail}
        />
        <CustomInput 
          containerStyle={{ marginHorizontal: 20, marginTop: 10 }}
          placeholder={'Password'}
          onChangeText={setPassword}
          error={passwordError}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleHome}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>
        <Text style={styles.textCopyRight}>@HeferApp S.A.C</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  containerLogo: {
    alignItems: 'center',
    marginBottom: 80, 
  },
  blackRectangle: {
    backgroundColor: '#fff', 
    width: 100, 
    height: 100, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5, 
  },
  logo: {
    width: 120, 
    height: 120, 
  },
  container: {
    width: '100%',
    backgroundColor: '#fff',
    height: '60%',
    borderTopLeftRadius: 60,
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'normal',
    marginTop: 30,
    marginBottom: 40,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 40,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'plain',
  },
  textCopyRight: {
    textAlign: 'center',
    marginTop: 50,
    color: '#9d9d9f',
  },
});

export default Login;
