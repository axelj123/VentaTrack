import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getDBConnection, listaProducto } from '../database'; 
import Card from '../components/CardsItems';
import { useFocusEffect } from '@react-navigation/native';
import EmptyState from '../components/EmptyState';
import { useSQLiteContext } from 'expo-sqlite';

const Inventario = ({ navigation }) => {
  const db = useSQLiteContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [productos, setProductos] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState('todos');

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

    if (activeFilter === 'sinStock') {
      filtered = filtered.filter(producto => producto.cantidad === 0);
    }

    setFilteredItems(filtered);  
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProductos();
    }, [])
  );

  useEffect(() => {
    filterProducts();
  }, [searchTerm, activeFilter, productos]);

  return (
    <View style={styles.container}>


      <Text style={styles.h1}>Productos</Text>
      <Text style={styles.p}>¡Gestiona tus productos!</Text>

      {/* Barra de búsqueda */}
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

      {/* Botón de agregar nuevo producto */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('RegistrarProducto')}
      >
        <Ionicons name="add" size={25} color="white" />
      </TouchableOpacity>

      {/* Filtros */}
      <View style={styles.contenedorFiltros}>
        <TouchableOpacity
          style={[styles.bottonFilters, activeFilter === 'todos' && styles.activeFilter]} 
          onPress={() => setActiveFilter('todos')}
        >
          <Text style={activeFilter === 'todos' ? styles.activeText : styles.inactiveText}>Todos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bottonFilters, activeFilter === 'sinStock' && styles.activeFilter]} 
          onPress={() => setActiveFilter('sinStock')}
        >
          <Text style={activeFilter === 'sinStock' ? styles.activeText : styles.inactiveText}>Sin stock</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de productos filtrados */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.Producto_id.toString()}  
        renderItem={({ item }) => (
          <Card
            productoId={item.Producto_id}
            title={item.nombre}
            price={item.precio_venta}
            image={{ uri: item.imagen }} 
            descripcion={item.descripcion}
            purchasePrice={item.precio_compra} 
            stock={item.cantidad}
            navigation={navigation} 
          />
        )}
        numColumns={2}
        ListEmptyComponent={
          <EmptyState
            onRefresh={fetchProductos}
            description='Registra un producto nuevo para visualizar tu inventario'
            buttonText='Agregar Producto'
            onPress={() => navigation.navigate('RegistrarProducto')}


          />
        }
      />

    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#f5f5f5',
  },
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 14,
    color: "#000",
    marginTop: 20,
  },
  p: {
    fontWeight: '400',
    marginBottom: 20,
    color: "#000",
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

  contenedorFiltros: {
    marginBottom: 20,
    flexDirection: 'row',
  },
  bottonFilters: {
    marginRight: 20,
    padding: 10, 
    borderRadius: 30,
  },
  activeFilter: {
    backgroundColor: '#6B21A8', 
  },
  inactiveText: {
    color: '#000',
  },
  activeText: {
    color: '#fff', 
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50, 
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20, 
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    backgroundColor: '#6B21A8', 
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    zIndex: 1,
  },
});

export default Inventario;
