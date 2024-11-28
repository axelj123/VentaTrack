import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, TouchableWithoutFeedback, Platform, PermissionsAndroid } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const ModalImagePicker = ({ modalVisible, setModalVisible, setSelectedImage }) => {

  const requestAndroidPermissions = async (useCamera) => {
    try {
      const permissions = useCamera 
        ? [
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
          ]
        : [PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE];

      const results = await PermissionsAndroid.requestMultiple(permissions);
      
      const allGranted = Object.values(results).every(
        result => result === PermissionsAndroid.RESULTS.GRANTED
      );

      if (!allGranted) {
        throw new Error('Se requieren todos los permisos para continuar');
      }

      return true;
    } catch (err) {
      console.log('Error al solicitar permisos:', err);
      return false;
    }
  };

  const pickImage = async (useCamera = false) => {
    try {
      if (Platform.OS === 'android') {
        const hasPermissions = await requestAndroidPermissions(useCamera);
        if (!hasPermissions) {
          Alert.alert(
            'Permisos Requeridos',
            useCamera 
              ? 'Se necesitan permisos de cámara y almacenamiento para continuar.'
              : 'Se necesita permiso de almacenamiento para continuar.',
            [
              { 
                text: 'Ir a Configuración', 
                onPress: () => {
                }
              },
              { text: 'Cancelar' }
            ]
          );
          return;
        }
      } else {
        const permissionResult = useCamera
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
          Alert.alert(
            'Permiso Denegado',
            useCamera
              ? 'Se necesita acceso a la cámara para esta función.'
              : 'Se necesita acceso a la galería para esta función.'
          );
          return;
        }
      }

      const options = {
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      };

      const result = useCamera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
        setModalVisible(false);
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error.message);
      Alert.alert(
        'Error',
        useCamera
          ? 'No se pudo acceder a la cámara. Por favor, verifica los permisos.'
          : 'No se pudo acceder a la galería. Por favor, verifica los permisos.'
      );
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      statusBarTranslucent

      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={() => pickImage(true)} style={styles.modalButton}>
                <Ionicons name="camera-outline" size={24} color="#000" style={styles.modalIcon} />
                <Text style={styles.modalButtonText}>Tomar Foto</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => pickImage(false)} style={styles.modalButton}>
                <Ionicons name="image-outline" size={24} color="#000" style={styles.modalIcon} />
                <Text style={styles.modalButtonText}>Seleccionar de Galería</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
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
