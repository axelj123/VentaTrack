import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, Image, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons'; // Importa los íconos

const RegistroAuto = ({navigation}) => {
  const [step, setStep] = useState(1);
  const [serie, setSerie] = useState('');
  const [modelo, setModelo] = useState('');
  const [vin, setVin] = useState('');
  const [concesionario, setConcesionario] = useState('');
  const [programaTraslado, setProgramaTraslado] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [cantidadDaños, setCantidadDaños]=useState('');
  const [ficha, setFicha] = useState('');
  const [estado, setEstado] = useState('');
  const [autorizado, setAutorizado] = useState('');
  const [entrada, setEntrada] = useState('');
  const [salida, setSalida] = useState('');
  const [imageUris, setImageUris] = useState([]);

  const handleCameraLaunch = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permiso denegado', 'No se puede acceder a la cámara');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
    if (!result.canceled) {
      setImageUris([...imageUris, result.assets[0].uri]);
    }
  };

  const handleImageLibraryLaunch = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permiso denegado', 'No se puede acceder a la galería');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: true,
    });
    if (!result.canceled) {
      const selectedUris = result.assets.map(asset => asset.uri);
      setImageUris([...imageUris, ...selectedUris]);
    }
  };

  const handleSubmit = () => {
    if (!serie || !modelo || !vin || !concesionario || !programaTraslado || !ficha || !estado || !entrada || !salida || imageUris.length === 0) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }
    Alert.alert('Registro completado', `Vehículo registrado con éxito`);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <TextInput style={styles.input} placeholder="Serie" value={serie} onChangeText={setSerie} />
            <TextInput style={styles.input} placeholder="Modelo" value={modelo} onChangeText={setModelo} />
            <TextInput style={styles.input} placeholder="Vin/Chasis" value={vin} onChangeText={setVin} />
          </View>
        );
      case 2:
        return (
          <View>
            <TextInput style={styles.input} placeholder="Concesionario" value={concesionario} onChangeText={setConcesionario} />
            <TextInput style={styles.input} placeholder="Programa de Traslado" value={programaTraslado} onChangeText={setProgramaTraslado} />
            <TextInput style={styles.input} placeholder="Cantidad daños" value={cantidadDaños} onChangeText={setCantidadDaños} />

            <TextInput style={[styles.input, styles.textArea]}
              placeholder="Observaciones" value={observaciones} onChangeText={setObservaciones}   multiline={true} 
               />
          </View>
        );
      case 3:
        return (
          <View>
            <TextInput style={styles.input} placeholder="Ficha" value={ficha} onChangeText={setFicha} />
            <TextInput style={styles.input} placeholder="Estado" value={estado} onChangeText={setEstado} />
            <TextInput style={styles.input} placeholder="Autorizado (Sí/No)" value={autorizado} onChangeText={setAutorizado} />
            <TextInput style={styles.input} placeholder="Entrada (fecha)" value={entrada} onChangeText={setEntrada} />
            <TextInput style={styles.input} placeholder="Salida (fecha)" value={salida} onChangeText={setSalida} />
            {imageUris.length > 0 && (
              <ScrollView horizontal style={styles.imagePreview}>
                {imageUris.map((uri, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri }} style={styles.image} />
                  </View>
                ))}
              </ScrollView>
            )}
            <View style={styles.buttonContainer}>
              <Button title="Abrir cámara" onPress={handleCameraLaunch} />
              <Button title="Seleccionar de la galería" onPress={handleImageLibraryLaunch} />
            </View>
          </View>
        );
    }
  };

  return (
    <View style={styles.background}>
        <View style={styles.navBar}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="black" style={styles.backIcon} />
      </TouchableOpacity>
    </View>
           <View style={styles.headerContainer}>
    <Image source={require('../assets/mecanicoRegister.png')} style={styles.headerRegister} />
  </View>

      <View style={styles.container}>

        {/* Step Indicator */}
        <View style={styles.stepIndicatorContainer}>
          {[1, 2, 3].map(num => (
            <View key={num} style={[styles.stepIndicator, step === num ? styles.activeStep : styles.inactiveStep]}>
              <Text style={styles.stepText}>{num}</Text>
            </View>
          ))}
        </View>

        {renderStepContent()}

        <View style={styles.navigationButtons}>
          {step > 1 && (
            <TouchableOpacity style={styles.navButtonAnterior} onPress={() => setStep(step - 1)}>
              <Text style={styles.buttonText}>ATRÁS</Text>
            </TouchableOpacity>
          )}
          {step < 3 && (
            <TouchableOpacity style={styles.navButtonSiguiente} onPress={() => setStep(step + 1)}>
              <Text style={styles.buttonText}>SIGUIENTE</Text>
            </TouchableOpacity>
          )}
          {step === 3 && (
            <TouchableOpacity style={styles.navButtonRegistrar} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Registrar Vehículo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
    marginTop: 50,
  },
  backIcon: {
    marginRight: 15, // Espacio entre el icono y el título
  },
  navBarTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: 'white',

  },
  container: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 50,
    color: 'white',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  textArea: {
    height: 150, // Ajusta la altura para simular un textarea
    justifyContent: 'flex-start',
    textAlignVertical: 'top', // Alinea el texto en la parte superior
  },
  imagePreview: {
    marginBottom: 20,
    flexDirection: 'row',
  },
  imageContainer: {
    marginRight: 10,
   
  },
  image: {
    width: 100,
    height: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  navButtonAnterior: {
    backgroundColor: '#003366',
    width: 120,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  navButtonSiguiente: {
    backgroundColor: '#003366',
    width: 120,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  stepIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderWidth: 2,
  },
  activeStep: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  inactiveStep: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  stepText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  headerContainer: {
    alignItems: 'center', 
    },
  headerRegister: {
    width: 150,
    marginBottom:20,
    height: 150,
  },
});

export default RegistroAuto;
