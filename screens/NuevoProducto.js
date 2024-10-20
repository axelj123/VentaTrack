import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Dimensions, Alert, Image, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

const RegistrarProducto = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del menú

  // Función para manejar la selección de imagen
  const handleImagePick = async () => {
    setModalVisible(false); // Cerrar el menú al seleccionar

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('¡Permiso denegado!', 'Necesitas permitir el acceso a la galería para seleccionar una imagen.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.assets[0].uri); // Verifica el URI de la imagen
      setSelectedImage(result.assets[0].uri);

    }
  };

  // Función para manejar la toma de foto
  const handleTakePhoto = async () => {
    setModalVisible(false); // Cerrar el menú al seleccionar

    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('¡Permiso denegado!', 'Necesitas permitir el acceso a la cámara para tomar una foto.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 4],

      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.assets[0].uri); // Verifica el URI de la imagen
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Svg
          height={height * 0.35}
          width="100%"
          viewBox={`0 0 ${width} ${height * 0.35}`} preserveAspectRatio="none"
          style={styles.svgCurve}
        >
          <Path
            fill="#B90909"
            d={`M0 0 
       L${width} 0 
       L${width} ${height * 0.25} 
       C${width * 0.85} ${height * 0.3}, ${width * 0.15} ${height * 0.35}, 0 ${height * 0.25} 
       Z`}
          />
        </Svg>

        <Text style={styles.headerText}>Agregar</Text>
      </View>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.imagePlaceholder}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.image} resizeMode="contain" />
          ) : (
            <MaterialIcons name="camera-alt" size={24} color="#8B0000" />
          )}
        </TouchableOpacity>
      </View>

      {/* Menú de selección de imagen */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Imagen</Text>
            <TouchableOpacity onPress={handleImagePick} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Seleccionar de Galería</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleTakePhoto} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Tomar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.form}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre del producto"
          placeholderTextColor="#999"
        />
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.input}
          placeholder="Breve descripción"
          placeholderTextColor="#999"
        />
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Precio</Text>
            <TextInput
              style={styles.input}
              placeholder="Soles"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Stock</Text>
            <TextInput
              style={styles.input}
              placeholder="ejm: 12"
              placeholderTextColor="#999"
            />
          </View>
        </View>
        <View style={styles.containerButton}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Registrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4F4F4',
  },
  svgCurve: {
    position: 'absolute',
    top: 0,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: 'bold',
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: height * 0.2,
    zIndex: 2,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro para el modal
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#800020',
    padding: 10,
    borderRadius: 5,
    width: '100%', // Ajusta el ancho para que los botones ocupen el mismo espacio
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalCloseButton: {
    backgroundColor: '#B90909',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  form: {
    padding: 20,
    marginTop: 20,
  },
  label: {
    color: '#B90909',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 25,
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  containerButton: {
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center', // Centra el contenido verticalmente
    backgroundColor: '#F4F4F4',
    marginBottom:50,
    marginTop:50,
  },
  button: {
    width: 145, 
    height: 50,
    backgroundColor: '#B90909',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginTop: 40,
    elevation: 3, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginBottom: 30,
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    padding:2,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default RegistrarProducto;
