import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, TouchableWithoutFeedback, PermissionsAndroid, Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const ModalImagePicker = ({ modalVisible, setModalVisible, setSelectedImage }) => {
  const requestGalleryPermission = async () => {
    try {
      // Para Android 13 y superior (API 33+)
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: "Permiso para acceder a la galería",
            message: "Necesitamos acceder a tus fotos para que puedas seleccionar una imagen.",
            buttonNeutral: "Preguntar después",
            buttonNegative: "Cancelar",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // Para Android 12 y anterior
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Permiso para acceder a la galería",
            message: "Necesitamos acceder a tus fotos para que puedas seleccionar una imagen.",
            buttonNeutral: "Preguntar después",
            buttonNegative: "Cancelar",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Permiso para usar la cámara",
          message: "Necesitamos acceder a tu cámara para que puedas tomar una foto.",
          buttonNeutral: "Preguntar después",
          buttonNegative: "Cancelar",
          buttonPositive: "OK"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const handleImagePick = async () => {
    try {
      const hasPermission = await requestGalleryPermission();
      
      if (!hasPermission) {
        Alert.alert(
          'Permiso denegado',
          'Necesitas permitir el acceso a la galería para seleccionar imágenes.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Ir a Configuración',
              onPress: () => Linking.openSettings()
            }
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setModalVisible(false);
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo acceder a la galería');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const hasPermission = await requestCameraPermission();
      
      if (!hasPermission) {
        Alert.alert(
          'Permiso denegado',
          'Necesitas permitir el acceso a la cámara para tomar fotos.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Ir a Configuración',
              onPress: () => Linking.openSettings()
            }
          ]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setModalVisible(false);
      }
    } catch (error) {
      console.error('Error al tomar foto:', error);
      Alert.alert('Error', 'No se pudo acceder a la cámara');
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={handleCloseModal}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={handleTakePhoto} style={styles.modalButton}>
                <Ionicons name="camera-outline" size={24} color="#000" style={styles.modalIcon} />
                <Text style={styles.modalButtonText}>Tomar Foto</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleImagePick} style={styles.modalButton}>
                <Ionicons name="image-outline" size={24} color="#000" style={styles.modalIcon} />
                <Text style={styles.modalButtonText}>Seleccionar de Galería</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCloseModal} style={styles.modalCloseButton}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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