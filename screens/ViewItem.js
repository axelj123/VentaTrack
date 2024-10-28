import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity,Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Si usas Expo, puedes usar iconos como Ionicons
import { useNavigation } from '@react-navigation/native'; // Para manejar la navegación
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useToast } from '../components/Toast'; // Ajusta la ruta según sea necesario
import ModalImagePicker from '../components/ModalImagePicker';

function ViewItem({ route }) {
  const navigation = useNavigation(); // Hook para obtener acceso a la navegación
  const { title, price, image, descripcion,stock } = route.params;

  const { Toast, showToast } = useToast();

  const manejarMostrarToast = () => {
    showToast('¡Operación exitosa!', 'Se ha guardado correctamente','success');
  };

  // Estados locales para manejar los valores editables
  const [editableTitle, setEditableTitle] = useState(title);
  const [editablePrice, setEditablePrice] = useState(price.toString());
  const [editableDescription, setEditableDescription] = useState(descripcion);
  const [editableStock, setEditableStock] = useState(stock);

  // Estados para controlar el modo de edición
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingStock, setIsEditingStock] = useState(false);

  // Función para manejar el guardado de la información editada
  const handleSave = () => {
    console.log("Producto guardado con nuevos valores:");
    console.log("Título:", editableTitle);
    console.log("Precio:", editablePrice);
    console.log("Descripción:", editableDescription);
    console.log("Stock:" , editableStock);

  };
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
    <View style={styles.container}>
     {Toast} 

      {/* Flecha de retroceso */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      {/* Imagen del producto */}
      <View style={styles.imageContainer}>
  {/* Si hay una imagen seleccionada, mostrarla. Si no, mostrar la imagen pasada como parámetro */}
  <Image source={selectedImage ? { uri: selectedImage } : image} style={styles.image} />
</View>

<View style={styles.imageContainer}>
  <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.imagePlaceholder}>
    <MaterialIcons name="camera-alt" size={24} color="#B90909" />
  </TouchableOpacity>
</View>

      {/* Menú de selección de imagen */}
      <ModalImagePicker
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setSelectedImage={setSelectedImage}
      />


      {/* Información del producto editable */}
      <View style={styles.infoContainer}>
        {/* Título editable */}
        <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
          {isEditingTitle ? (
            <TextInput
              style={styles.titleInput}
              value={editableTitle}
              onChangeText={setEditableTitle}
              onBlur={() => setIsEditingTitle(false)}
              autoFocus
            />
          ) : (
            <Text style={styles.titleText}>{editableTitle}</Text>
          )}
        </TouchableOpacity>

        {/* Descripción editable */}
        <TouchableOpacity onPress={() => setIsEditingDescription(true)}>
          {isEditingDescription ? (
            <TextInput
              style={styles.descriptionInput}
              value={editableDescription}
              onChangeText={setEditableDescription}
              onBlur={() => setIsEditingDescription(false)}
              multiline
              autoFocus
            />
          ) : (
            <Text style={styles.descriptionText}>{editableDescription}</Text>
          )}
        </TouchableOpacity>

        {/* Precio editable y botón de guardar */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => setIsEditingPrice(true)} >
            {isEditingPrice ? (
              <TextInput
                style={styles.priceInput}
                value={editablePrice}
                onChangeText={setEditablePrice}
                onBlur={() => setIsEditingPrice(false)}
                keyboardType="numeric"
                autoFocus
              />
            ) : (
              <Text style={styles.priceText}>S./{editablePrice}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsEditingStock(true)}>
            {isEditingStock? (
              <TextInput
                style={styles.priceInput}
                value={editableStock}
                onChangeText={setEditableStock}
                onBlur={() => setIsEditingStock(false)}
                keyboardType="numeric"
                autoFocus
              />
            ) : (
              <Text style={styles.stockText}>Stock:{editableStock}</Text>
            )}
          </TouchableOpacity>

        </View>
        <View style={styles.footerBotones} >
        <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonTextEliminar}>Eliminar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton}onPress={manejarMostrarToast} > 
            <Text style={styles.saveButtonTextGuardar} >Guardar</Text>
          </TouchableOpacity>
     
        </View>
      

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    alignItems: 'center',
    paddingTop: 150,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1, // Asegura que el botón esté sobre otros elementos
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 40,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  infoContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    alignItems: 'center',
    marginTop: -20,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
    textAlign: 'center',
  },
  titleInput: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#B90909',
    textAlign: 'center',
    borderWidth: 0, // Sin bordes
  },
  descriptionText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  descriptionInput: {
    fontSize: 16,
    color: '#7A7A7A',
    textAlign: 'center',
    marginBottom: 20,
    borderWidth: 0, // Sin bordes
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  footerBotones:{
    flexDirection: 'row',
    marginTop: 100,

  },
  priceText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
  },
  stockText: {
    fontSize: 18,
    color: '#000',
  },
  priceInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    borderWidth: 0, // Sin bordes
    textAlign: 'center',
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  saveButtonTextGuardar: {
    backgroundColor:'#B90909',
    padding:10,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    borderRadius:25,
  },
  saveButtonTextEliminar: {
    color: '#000',
    backgroundColor:'white',
    padding:10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,

    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro para el modal
  },
  modalContent: {
    width: '100%',
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
    padding: 10,
    borderRadius: 5,
    width: '100%', // Ajusta el ancho para que los botones ocupen el mismo espacio
    alignItems: 'center',
    borderBottomColor: '#f1f1f0',
    flexDirection: 'row',
justifyContent:'center',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  modalIcon:{
marginRight:5,
  },
  modalButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalCloseButton: {
    padding: 10,
    borderBottomColor: '#f1f1f0',
    borderBottomWidth: 1,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
});

export default ViewItem;
