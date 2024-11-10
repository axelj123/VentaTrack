import React, { useState,useEffect} from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image,searchTerm} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Card from '../components/CardsItems'; // Ensure this path is correct
import { useFocusEffect } from '@react-navigation/native';

import { getDBConnection,listaProducto } from '../database';
const VentaProducto = ({ navigation }) => {

  const [searchTerm, setSearchTerm] = useState('');

  const [filteredItems, setFilteredItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState('todos');

  const [productos, setProductos] = useState([]);
  const fetchProductos = async () => {
    try {
      const db = await getDBConnection();
      const productosData = await listaProducto(db); // Llama a la función que consulta la base de datos
      setProductos(productosData);  // Guarda los productos obtenidos en el estado
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };


// Filtra los productos según el término de búsqueda y el filtro activo
  const filterProducts = () => {
    let filtered = productos;

    // Filtrar por nombre o descripción si hay un término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtro de "sin stock" si se selecciona
    if (activeFilter === 'sinStock') {
      filtered = filtered.filter(producto => producto.cantidad === 0);
    }

    setFilteredItems(filtered);  // Actualiza el estado con los productos filtrados
  };

 // Llamar a fetchProductos cuando se monte el componente
  useFocusEffect(
    React.useCallback(() => {
      fetchProductos();
    }, [])
  );

  // Se ejecuta cada vez que cambia el término de búsqueda o el filtro
  useEffect(() => {
    filterProducts();
  }, [searchTerm, activeFilter, productos]);


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
        keyExtractor={(item) => item.Producto_id.toString()}  // Usa Producto_id como clave única
        renderItem={({ item }) => (
          <Card
          productoId={item.Producto_id}
          title={item.nombre}
          price={item.precio_venta}
          image={{ uri: item.imagen }}  // Asume que 'imagen' es una URL o un path
          descripcion={item.descripcion}
          stock={item.cantidad}
          navigation={navigation} // Pasamos la navegación al Card
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