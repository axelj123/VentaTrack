import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getDBConnection, listaProducto } from '../database';  // Asegúrate de importar correctamente
import Card from '../components/CardsItems'; // Asegúrate de que el componente esté bien importado
import { useFocusEffect } from '@react-navigation/native';
import EmptyState from '../components/EmptyState';
import { useSQLiteContext } from 'expo-sqlite';

const Inventario = ({ navigation }) => {
  const db = useSQLiteContext();
  // Estado para el término de búsqueda, productos y filtro activo
  const [searchTerm, setSearchTerm] = useState('');
  const [productos, setProductos] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState('todos');

  // Función para obtener productos desde la base de datos
  const fetchProductos = async () => {
    try {
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
          style={[styles.bottonFilters, activeFilter === 'todos' && styles.activeFilter]} // Estilo activo
          onPress={() => setActiveFilter('todos')}
        >
          <Text style={activeFilter === 'todos' ? styles.activeText : styles.inactiveText}>Todos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bottonFilters, activeFilter === 'sinStock' && styles.activeFilter]} // Estilo activo
          onPress={() => setActiveFilter('sinStock')}
        >
          <Text style={activeFilter === 'sinStock' ? styles.activeText : styles.inactiveText}>Sin stock</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de productos filtrados */}
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
            purchasePrice={item.precio_compra} // Añade purchasePrice aquí
            stock={item.cantidad}
            navigation={navigation} // Pasamos la navegación al Card
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
    backgroundColor: '#F8F9FF',
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
    padding: 10, // Espacio dentro del botón
    borderRadius: 30, // Bordes redondeados
  },
  activeFilter: {
    backgroundColor: '#6B21A8', // Color de fondo cuando el filtro está activo
  },
  inactiveText: {
    color: '#000', // Color de texto para filtros inactivos
  },
  activeText: {
    color: '#fff', // Color de texto para filtros activos
    fontWeight: 'bold',
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    backgroundColor: '#6B21A8', // Mantenemos el mismo color que tenías
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // Mismo valor de elevation que tenías
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
