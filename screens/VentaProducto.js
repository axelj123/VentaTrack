import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Card from '../components/CardsItems';
import ProductModal from '../components/ProductModal';
import { getDBConnection, listaProducto } from '../database';
import EmptyState from '../components/EmptyState';

const VentaProducto = ({ route,navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cartItems, setCartItems] = useState([]);



  const fetchProductos = async () => {
    try {
      const db = await getDBConnection();
      const productosData = await listaProducto(db);
      setProductos(productosData);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const filterProducts = () => {
    let filtered = productos;
    if (searchTerm) {
      filtered = filtered.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredItems(filtered);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, productos]);


  const handleProductPress = (product) => {
    setSelectedProduct({
      title: product.nombre,
      price: product.precio_venta,
      stock: product.cantidad,
      id: product.Producto_id,
      imagen: product.imagen,
      descripcion: product.descripcion
    });
    setModalVisible(true);
  };
  // Actualizar el manejo del carrito
  useEffect(() => {
    if (route.params?.updatedCart) {
      setCartItems(route.params.updatedCart);
    }
  }, [route.params?.updatedCart]);


  const navigateToCart = () => {
    navigation.navigate('DetalleVenta', {
      cartItems,
      onCartUpdate: (updatedCart) => {
        navigation.setParams({ updatedCart }); // Esto actualizará el carrito cuando volvamos
      }
    });
  };

  const handleAddToCart = (productToAdd) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productToAdd.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + productToAdd.quantity }
            : item
        );
      }
      return [...prevItems, { ...productToAdd, quantity: productToAdd.quantity }];
    });
    
    // Después de agregar al carrito, actualiza los parámetros de la navegación
    navigation.setParams({ cartItems: [...cartItems, productToAdd] });
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <Text style={styles.header}>Venta</Text>
        <TouchableOpacity
          style={styles.carritoContent}
          onPress={navigateToCart}
        >
          <MaterialIcons name="add-shopping-cart" size={24} color={'white'} />
          <Text style={styles.carritoText}>Ir al carrito ({cartItems.length})</Text>
        </TouchableOpacity>

      </View>

      <Text style={styles.subHeader}>Busca los productos y agrégales al carrito</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar"
          value={searchTerm}
          onChangeText={text => setSearchTerm(text)}
          selectionColor="#003366"
        />
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={item => item.Producto_id.toString()}
        renderItem={({ item }) => (
          <Card
            key={item.Producto_id}
            productoId={item.Producto_id}
            title={item.nombre}
            price={item.precio_venta}
            image={{ uri: item.imagen }}
            descripcion={item.descripcion}
            stock={item.cantidad}
            navigation={navigation}
            buttonText="Agregar"
            onPress={() => handleProductPress(item)}
          />
        )}
        numColumns={2}
        ListEmptyComponent={
          <EmptyState
            onRefresh={fetchProductos}
          />
        }
      />

      <ProductModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50, // Ajusta según sea necesario
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20, // Espacio entre el icono y el texto
  },
});

export default VentaProducto;