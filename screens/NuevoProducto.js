import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ModalImagePicker from '../components/ModalImagePicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { getDBConnection } from '../database';
import CustomInput from '../components/CustomInput';
import CustomDatePicker from '../components/CustomDatePicker';

const { width, height } = Dimensions.get('window');

const RegistrarProducto = () => {
  const [openCategoria, setOpenCategoria] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [categoriaItems, setCategoriaItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchCategorias = async () => {
    try {
      const db = await getDBConnection();
      const result = await db.getAllAsync(`SELECT * FROM Categoria_Producto`);
      if (result && result.length > 0) {
        const categoriasList = result.map(categoria => ({
          label: categoria.nombre,
          value: categoria.categoria_id
        }));
        setCategoriaItems(categoriasList);
      } else {
        console.log("No se encontraron categorias en la base de datos.");
        setCategoriaItems([]);
      }
    } catch (error) {
      console.error("Error al obtener categorias:", error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>Agregar</Text>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.imagePlaceholder}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.image} resizeMode="contain" />
          ) : (
            <MaterialIcons name="camera-alt" size={24} color="#8B0000" />
          )}
        </TouchableOpacity>
      </View>

      <ModalImagePicker
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setSelectedImage={setSelectedImage}
      />

      <View style={styles.form}>
        {/* Nombre y Descripción */}
        <CustomInput
          placeholder="Nombre del producto"
          focusedBorderColor="#000"
          unfocusedBorderColor="#E0E0E0"
          placeholderTextColor="#999"
          containerStyle={styles.fullWidthInput}
        />
        <CustomInput
          placeholder="Descripción"
          focusedBorderColor="#000"
          unfocusedBorderColor="#E0E0E0"
          placeholderTextColor="#999"
          containerStyle={styles.fullWidthInput}
        />

        {/* Fecha de Ingreso y Fecha de Vencimiento */}
        <View style={styles.row}>
          <CustomDatePicker
            placeholder="Fecha de ingreso"
            focusedBorderColor="#000"

            onDateChange={(selectedDate) => {}}
            containerStyle={styles.halfInput}
            errorMessage="Este campo es obligatorio"
          />
          <CustomDatePicker
            placeholder="Fecha de vencimiento"
            focusedBorderColor="#000"
            onDateChange={(selectedDate) => {}}
            containerStyle={styles.halfInput}
            errorMessage="Este campo es obligatorio"
          />
        </View>

        {/* Precio y Comisión */}
        <View style={styles.row}>
          <CustomInput
            placeholder="Precio (Soles)"
            focusedBorderColor="#000"
            unfocusedBorderColor="#E0E0E0"
            placeholderTextColor="#999"
            keyboardType="numeric"
            containerStyle={styles.halfInput}
          />
          <CustomInput
            placeholder="Comision (%)"
            focusedBorderColor="#000"
            unfocusedBorderColor="#E0E0E0"
            placeholderTextColor="#999"
            keyboardType="numeric"
            containerStyle={styles.halfInput}
          />
        </View>

        {/* Comisión y Stock */}
        <View style={styles.row}>
          <CustomInput
            placeholder="Comision (%)"
            focusedBorderColor="#000"
            unfocusedBorderColor="#E0E0E0"
            placeholderTextColor="#999"
            keyboardType="numeric"
            containerStyle={styles.halfInput}
          />
          <CustomInput
            placeholder="Stock"
            focusedBorderColor="#000"
            unfocusedBorderColor="#E0E0E0"
            placeholderTextColor="#999"
            keyboardType="numeric"
            containerStyle={styles.halfInput}
          />
        </View>

        {/* Categoría */}
        <DropDownPicker
          open={openCategoria}
          value={selectedCategoria}
          items={categoriaItems}
          setOpen={setOpenCategoria}
          setValue={setSelectedCategoria}
          setItems={setCategoriaItems}
          placeholder="Categoría"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={1000}
        />

        {/* Botón de Registrar */}
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
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
  },
  title:{
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 14,
    color: "#000",
    marginTop:30,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  form: {
    paddingHorizontal: 20,
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    height: 45,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '60%', // Ajusta el ancho del dropdown para hacerlo más pequeño
    alignSelf: 'center', // Centra el dropdown en el contenedor
  },
  dropdownContainer: {
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  halfInput: {
    width: '48%',
  },
  fullWidthInput: {
    width: '100%',
    marginBottom: 15,
  },
  containerButton: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 50,
  },
  button: {
    width: 145,
    height: 50,
    backgroundColor: '#B90909',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default RegistrarProducto;
