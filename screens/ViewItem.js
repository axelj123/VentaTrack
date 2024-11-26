import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import ModalImagePicker from '../components/ModalImagePicker';
import { handleSave, eliminarProducto } from '../database';  
import ModalConfirm from '../components/ModalConfirm';
import { useToast } from '../components/ToastContext';
import CustomInput from '../components/CustomInput';
import { useSQLiteContext } from 'expo-sqlite';

function ViewItem({ route }) {
  const navigation = useNavigation();
  const { Producto_id, title, price, purchasePrice,image, descripcion, stock } = route.params;
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const { showToast } = useToast(); 
  const db = useSQLiteContext();

  const [formData, setFormData] = useState({
    title: title,
    price: price.toString(),
    purchasePrice: purchasePrice ? purchasePrice.toString() : '', 
    description: descripcion,
    stock: stock.toString()
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImage] = useState(image); 

  const [modalVisible, setModalVisible] = useState(false);


  const handleDeleteProduct = async () => {
    try {
      const success = await eliminarProducto(db, Producto_id);  

      if (success) {
        showToast('¡Operación exitosa!', 'Producto eliminado correctamente', 'success');
        navigation.goBack();
      } else {
        showToast('¡Error!', 'No se pudo eliminar el producto', 'warning');
      }
    } catch (error) {
      showToast('¡Error!', 'Hubo un problema al eliminar el producto', 'warning');
      console.error("Error en handleDeleteProduct:", error);
    }
    setConfirmModalVisible(false);
  };

  const handleSaveProduct = async () => {
    try {
      if (!formData.title || !formData.description || !formData.price || !formData.purchasePrice || !formData.stock) {
        showToast('¡Error!', 'Por favor, completa todos los campos obligatorios', 'warning');
        return;
      }

      const success = await handleSave(db, formData, selectedImage, Producto_id, currentImage);

      if (success) {
        showToast('¡Operación exitosa!', 'Se ha guardado correctamente', 'success');
        navigation.goBack(); 

      } else {
        showToast('¡Error!', 'Hubo un problema al guardar los cambios', 'warning');

      }
    } catch (error) {
      showToast('¡Error!', 'Hubo un problema al guardar los cambios ', 'warning');
      console.error("Error en handleSaveProduct:", error);
    }
  };




  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles del Producto</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Imagen y Botón de Cámara */}
        <View style={styles.imageSection}>
          <View style={styles.imageWrapper}>
            <Image
              source={selectedImage ? { uri: selectedImage } : image}
              style={styles.image}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.cameraButton}
            >
              <MaterialIcons name="camera-alt" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Formulario */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <CustomInput
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="Ingrese el nombre del producto"
              placeholderTextColor="#999"
              focusedBorderColor="#000"

            />
          </View>

          <View style={styles.inputGroup}>
            <CustomInput
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Ingrese la descripción del producto"
              isTextArea={true}
              focusedBorderColor="#000"

              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.rowContainer}>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <CustomInput
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
                keyboardType="numeric"
                placeholder="Precio de venta"
                placeholderTextColor="#999"
                focusedBorderColor="#000"

              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <CustomInput
                value={formData.stock}
                onChangeText={(text) => setFormData({ ...formData, stock: text })}
                keyboardType="numeric"
                placeholder="Stock"
                placeholderTextColor="#999"
                focusedBorderColor="#000"

              />
            </View>
          </View>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <CustomInput
              value={formData.purchasePrice}
              onChangeText={(text) => setFormData({ ...formData, purchasePrice: text })}
              keyboardType="numeric"
              placeholder="Precio de compra"
              placeholderTextColor="#999"
              focusedBorderColor="#000"
            />
          </View>
        </View>
      </ScrollView>

      {/* Botones de Acción */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => setConfirmModalVisible(true)}
        >
          <MaterialIcons name="delete-outline" size={24} color="#5B21B6" />
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveProduct}
        >
          <MaterialIcons name="save" size={24} color="#FFF" />
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>

      {/* Modales */}
      <ModalImagePicker
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setSelectedImage={setSelectedImage}
      />

      <ModalConfirm
        visible={confirmModalVisible}
        onClose={() => setConfirmModalVisible(false)}
        onConfirm={handleDeleteProduct}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este producto?"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 15,
  },
  backButton: {
    padding: 5,
  },
  container: {
    flex: 1,
  },
  imageSection: {
    backgroundColor: '#FFF',
    padding: 20,
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 15,
    backgroundColor: '#F8F9FA',
  },
  cameraButton: {
    position: 'absolute',
    bottom: -15,
    right: -15,
    backgroundColor: '#5B21B6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },


  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfWidth: {
    width: '47%',
  },
  numberInput: {
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#5B21B6',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5B21B6',
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#5B21B6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ViewItem;