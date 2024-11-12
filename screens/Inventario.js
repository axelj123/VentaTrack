import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getDBConnection, listaProducto } from '../database';  // Asegúrate de importar correctamente
import Card from '../components/CardsItems'; // Asegúrate de que el componente esté bien importado
import { useFocusEffect } from '@react-navigation/native';
import EmptyState from '../components/EmptyState';

const Inventario = ({ navigation }) => {
  // Estado para el término de búsqueda, productos y filtro activo
  const [searchTerm, setSearchTerm] = useState('');
  const [productos, setProductos] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState('todos');

  // Función para obtener productos desde la base de datos
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


      <Text style={styles.h1}>Productos</Text>
      <Text style={styles.p}>¡Gestiona tus productos!</Text>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar"
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
          selectionColor="#003366" // Cambia el color del cursor aquí
        />
      </View>

      {/* Botón de agregar nuevo producto */}
      <View style={styles.containerButton}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RegistrarProducto')}>
          <Text style={styles.buttonText}>Nuevo</Text>
          <Ionicons name="add" size={25} color="white" style={styles.iconAdd} />
        </TouchableOpacity>
      </View>

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
    padding: 20,
    backgroundColor: 'white',
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#999', // Agregar color de borde
    borderRadius: 15,
    paddingHorizontal: 10,
    marginVertical: 20, // Agregar margen superior e inferior
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
  containerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Centra el contenido verticalmente
    marginBottom: 50,
    marginTop: 50,
  },
  button: {
    width: 145,
    height: 50,
    backgroundColor: '#B90909',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginTop: 40,
    elevation: 3, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginBottom: 30,
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    padding: 2,
  },
  iconAdd: {
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
    backgroundColor: '#B90909', // Color de fondo cuando el filtro está activo
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
});

export default Inventario;
