import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image,searchTerm} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Card from '../components/CardsItems'; // Ensure this path is correct

const VentaProducto = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const items = [
    {
      id: '1',
      title: 'Aceite de Coco',
      descripcion: 'Aceite virgen extra',
      price: '45',
      stock: '13',
      image: require('../assets/producto.png'),
    },
    {
      id: '2',
      title: 'Miel de Abeja',
      descripcion: 'Miel pura recolectada de flores silvestres.',
      price: '30',
      stock: '93',
      image: require('../assets/producto.png'),
    },
    {
      id: '3',
      title: 'Quinua Orgánica',
      descripcion: 'Grano andino certificado.',
      price: '67',
      stock: '23',
      image: require('../assets/producto.png'),
    },
    {
      id: '4',
      title: 'Harina de Almendra',
      descripcion: 'Harina fina y suave hecha de almendras 100% naturales.',
      price: '50',
      stock: '43',
      image: require('../assets/producto.png'),
    },
    {
      id: '4',
      title: 'Harina de Almendra',
      descripcion: 'Harina fina y suave hecha de almendras 100% naturales.',
      price: '50',
      stock: '43',
      image: require('../assets/producto.png'),
    },
    {
      id: '4',
      title: 'Harina de Almendra',
      descripcion: 'Harina fina y suave hecha de almendras 100% naturales.',
      price: '50',
      stock: '43',
      image: require('../assets/producto.png'),
    },
  ];

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const [activeFilter, setActiveFilter] = useState('todos');
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <Text style={styles.header}>Venta</Text>
        <TouchableOpacity style={styles.carritoContent}onPress={() => navigation.navigate('DetalleVenta')} >
          <MaterialIcons name="add-shopping-cart" size={24} color={'white'} />
          <Text style={styles.carritoText} >Ir al carrito</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.subHeader}>Busca los productos y agrégalos!</Text>

      {/* Input de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchTerm}
          onChangeText={text => setSearchTerm(text)}
          selectionColor="#003366" 
        />
      </View>
      {/* Lista de productos */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            title={item.title}
            price={item.price}
            image={item.image}
            descripcion={item.descripcion}
            stock={item.stock}
            navigation={navigation} // Aquí se pasa navigation
            buttonText="Agregar"

          />
        )}
        numColumns={2} // Set 2 columns

      />

 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: 'white'
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginTop: 32,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#999', // Agregar color de borde
    borderRadius: 15,
    paddingHorizontal: 10,
    marginVertical: 10, // Agregar margen superior e inferior
  },
  searchInput: {
    height: 40,
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  icon: {
    marginRight: 10, // Agregar espacio entre el icono y el campo de entrada
  },
  carritoContent: {
    flexDirection: 'row',
    backgroundColor: '#B90909',
    borderRadius: 10,
    padding: 10,
  },
  carritoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 20,
  },

  cartButton: {
    backgroundColor: '#B90909',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  cartButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default VentaProducto;