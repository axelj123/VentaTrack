import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Dimensions, Alert, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import ModalImagePicker from '../components/ModalImagePicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';

const { width, height } = Dimensions.get('window');

const RegistrarProducto = () => {
  const [open, setOpen] = useState(false); // Estado para abrir/cerrar el menú desplegable
  const [selectedCategory, setSelectedCategory] = useState(null); // Estado para la categoría seleccionada

  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [dateIngreso, setDateIngreso] = useState(new Date());
  const [dateVencimiento, setDateVencimiento] = useState(new Date());
  const [showIngreso, setShowIngreso] = useState(false);
  const [showVencimiento, setShowVencimiento] = useState(false);

  const onChangeIngreso = (event, selectedDate) => {
    const currentDate = selectedDate || dateIngreso;
    setShowIngreso(false);
    setDateIngreso(currentDate);
  };

  const onChangeVencimiento = (event, selectedDate) => {
    const currentDate = selectedDate || dateVencimiento;
    setShowVencimiento(false);
    setDateVencimiento(currentDate);
  };


  const [items, setItems] = useState([
    { label: 'Alimentos', value: 'alimentos' },
    { label: 'Bebidas', value: 'bebidas' },
    { label: 'Ropa', value: 'ropa' },
    { label: 'Electrónica', value: 'electronica' },
    // Agrega más categorías según sea necesario
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Svg
          height={height * 0.35}
          width="100%"
          viewBox={`0 0 ${width} ${height * 0.5}`}
          preserveAspectRatio="none"
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

      <ModalImagePicker
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setSelectedImage={setSelectedImage}
      />

      <View style={styles.form}>
        {/* Row 1: Nombre and Fecha de Ingreso */}
        <DropDownPicker
        open={open}
        value={selectedCategory}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedCategory}
        setItems={setItems}
        placeholder="select Country"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={1000}
      />
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del producto"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Fecha de ingreso</Text>
            <TouchableOpacity onPress={() => setShowIngreso(true)} style={styles.dateInput}>
              <Text style={styles.dateText}>{dateIngreso.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showIngreso && (
              <DateTimePicker
                value={dateIngreso}
                mode="date"
                display="spinner"
                onChange={onChangeIngreso}
              />
            )}
          </View>
        </View>

        {/* Row 2: Fecha de Vencimiento and Descripción */}
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Fecha de vencimiento</Text>
            <TouchableOpacity onPress={() => setShowVencimiento(true)} style={styles.dateInput}>
              <Text style={styles.dateText}>{dateVencimiento.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showVencimiento && (
              <DateTimePicker
                value={dateVencimiento}
                mode="date"
                display="spinner"
                onChange={onChangeVencimiento}
              />
            )}
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={styles.input}
              placeholder="Breve descripción"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Row 3: Precio and Stock */}
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


        {/* Botón de registrar */}
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
    flex:1,
  },
  svgCurve: {
    position: 'absolute',
    top: 0,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
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
    padding: 20,
    marginTop: 20,
  },
  label: {
    color: '#000',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 15,
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 15,
  },
  dropdown: {
    backgroundColor: 'white', // Color de fondo gris claro
    borderRadius: 12,           // Bordes redondeados suaves
    borderColor: '#E0E0E0',     // Color de borde gris claro
    borderWidth: 1,             // Grosor del borde
    height: 45,                 // Ajuste de altura similar a la imagen
    paddingHorizontal: 10,      // Espacio interno horizontal
    marginBottom:20,

  },
  dropdownContainer: {
    borderColor: '#E0E0E0',     // Color de borde gris claro
    borderRadius: 12,           // Bordes redondeados suaves
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 15,
    backgroundColor: 'white',
    padding: 10,
    height:50,
    marginBottom: 15,
    justifyContent: 'center',
  },
  dateText: {
    color: '#800EB',
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
    justifyContent: 'center',
    marginTop: 40,
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
