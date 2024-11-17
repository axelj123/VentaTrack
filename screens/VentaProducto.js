import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Card from '../components/CardsItems';
import ProductModal from '../components/ProductModal';
import { getDBConnection, listaProducto } from '../database';
import EmptyState from '../components/EmptyState';
import { useCart } from '../components/CartContext'; // Usamos el contexto para el carrito
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { useToast } from '../components/ToastContext';
const VentaProducto = ({navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [productos, setProductos] = useState([]);
  const { cartItems, addToCart } = useCart(); // Obtener cartItems y la función addToCart
  const { showToast }=useToast();
  const db=useSQLiteContext();


  const fetchProductos = async () => {
    try {
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
  useFocusEffect(
    React.useCallback(() => {
      fetchProductos();
    }, [])
  );

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
    navigation.setOptions({
      onCartUpdate: (updatedCart) => {
        setCartItems(updatedCart);  // Actualiza el carrito con el nuevo valor
      }
    });
  }, [navigation]);

  const navigateToCart = () => {
    if (cartItems.length > 0) {
      navigation.navigate('DetalleVenta');

    } else {
      showToast("error","Tiene que añadir productos para usar el carrito","error")
    }
  };
  const handleAddToCart = (productToAdd) => {
    addToCart(productToAdd);  // Usamos la función addToCart del contexto
    showToast("success",`Producto agregado: ${productToAdd.title}`,"success",navigateToCart )

    setModalVisible(false);
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
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#666"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
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
    backgroundColor: '#F8F9FF',
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
    paddingBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  carritoContent: {
    flexDirection: 'row',
    backgroundColor: '#6B21A8',
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