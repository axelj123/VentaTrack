import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import Card from '../components/CardsItems'; // Ensure this path is correct
import Ionicons from 'react-native-vector-icons/Ionicons';

const Inventario = ({ navigation }) =>  {
  // Sample data for inventory
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term
  const items = [
    { id: '1', title: 'Fido', descripcion: 'Labrador', price: 's/. 140', image: require('../assets/producto.png') },
    { id: '2', title: 'Bella', descripcion: 'Beagle', price: 's/. 120', image: require('../assets/producto.png') },
    { id: '3', title: 'Max', descripcion: 'Bulldog', price: 's/. 160', image: require('../assets/producto.png') },
    { id: '4', title: 'Lucy', descripcion: 'Poodle', price: 's/. 150', image: require('../assets/producto.png') },
  ];
  


  const filteredItems = items.filter(items =>
    items.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [activeFilter, setActiveFilter] = useState('todos');
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Productos</Text>
      <Text style={styles.p}>¡Gestiona tus productos!</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchTerm}
          onChangeText={text => setSearchTerm(text)}
          selectionColor="#003366" // Change cursor color here
        />
      </View>
      <View style={styles.containerButton}>
        <TouchableOpacity style={styles.button}  onPress={() => navigation.navigate('RegistrarProducto')}
        >
          <Text style={styles.buttonText}>Nuevo</Text>
          <Ionicons name="add" size={25} color="white" style={styles.iconAdd} />

        </TouchableOpacity>
      </View>
      <View style={styles.contenedorFiltros}>
      <TouchableOpacity
        style={[
          styles.bottonFilters,
          activeFilter === 'todos' && styles.activeFilter, // Aplica estilos si este es el filtro activo
        ]}
        onPress={() => handleFilterChange('todos')}
      >
        <Text style={activeFilter === 'todos' ? styles.activeText : styles.inactiveText}>Todos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.bottonFilters,
          activeFilter === 'sinStock' && styles.activeFilter, // Aplica estilos si este es el filtro activo
        ]}
        onPress={() => handleFilterChange('sinStock')}
      >
        <Text style={activeFilter === 'sinStock' ? styles.activeText : styles.inactiveText}>Sin stock</Text>
      </TouchableOpacity>
    </View>

    <FlatList
  data={filteredItems}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <Card 
      title={item.title} 
      price={item.price} 
      image={item.image} 
      descripcion={item.descripcion} 
      navigation={navigation} // Aquí se pasa navigation
    />
  )}
/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
    backgroundColor: '#F4F4F4',
  },
  h1: {
    fontSize: 44,
    fontWeight: 'bold',
    marginBottom: 14,
    color: "#800020",
  },
  p: {
    fontWeight: '400',
    marginBottom: 20,
    color: "#800020",
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 0,
    borderRadius: 15,
    paddingHorizontal: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30,
    marginBottom: 10,

  },
  searchInput: {
    height: 40,
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  containerButton: {
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center', // Centra el contenido verticalmente
    backgroundColor: '#F4F4F4',
    marginBottom:50,
    marginTop:50,
  },
  button: {
    width: 145, 
    height: 50,
    backgroundColor: '#800020',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
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
    padding:2,
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
    backgroundColor: '#800020', // Color de fondo cuando el filtro está activo
  },
  inactiveText: {
    color: '#000', // Color de texto para filtros inactivos
  },
  activeText: {
    color: '#fff', // Color de texto para filtros activos
    fontWeight:'bold',
  },
});

export default Inventario;
