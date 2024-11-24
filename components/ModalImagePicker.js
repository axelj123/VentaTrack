import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, TouchableWithoutFeedback, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const ModalImagePicker = ({ modalVisible, setModalVisible, setSelectedImage }) => {
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        // Solicitar permisos al iniciar el componente
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
          Alert.alert(
            'Permisos necesarios',
            'La aplicación necesita permisos para acceder a la cámara y la galería.',
            [{ text: 'OK' }]
          );
        }
      }
    })();
  }, []);

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert(
            'Permiso denegado',
            'Por favor, habilita los permisos de galería en la configuración de tu dispositivo.',
            [
              { text: 'OK' }
            ]
          );
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
        setModalVisible(false);
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'Hubo un problema al seleccionar la imagen');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.getCameraPermissionsAsync();
      
      if (status !== 'granted') {
        const { status: newStatus } = await ImagePicker.requestCameraPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert(
            'Permiso denegado',
            'Por favor, habilita los permisos de cámara en la configuración de tu dispositivo.',
            [
              { text: 'OK' }
            ]
          );
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
        setModalVisible(false);
      }
    } catch (error) {
      console.error('Error al tomar foto:', error);
      Alert.alert('Error', 'Hubo un problema al tomar la foto');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.option}
                onPress={handleTakePhoto}
              >
                <Ionicons name="camera" size={24} color="#000" />
                <Text style={styles.optionText}>Tomar Foto</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.option}
                onPress={handleImagePick}
              >
                <Ionicons name="images" size={24} color="#000" />
                <Text style={styles.optionText}>Seleccionar de Galería</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.option, styles.cancelOption]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.optionText, styles.cancelText]}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro para toda la pantalla
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButton: {
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomColor: '#f1f1f0',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  modalIcon: {
    marginRight: 10,
  },
  modalButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalCloseButton: {
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#f1f1f0',
  },
});

export default ModalImagePicker;
