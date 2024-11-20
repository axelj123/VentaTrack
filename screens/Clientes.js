import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { listClientes } from '../database';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';

const ClienteCard = ({ cliente, onEdit }) => (
  <TouchableOpacity 
    style={styles.card}
    onPress={() => onEdit(cliente)}
  >
    <View style={styles.cardContent}>
      <View style={styles.cardLeft}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {cliente.nombre.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.nombreCliente}>{cliente.nombre}</Text>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={14} color="#666" />
            <Text style={styles.detalleCliente}>{cliente.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={14} color="#666" />
            <Text style={styles.detalleCliente}>{cliente.telefono}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => onEdit(cliente)}
      >
        <Ionicons name="create-outline" size={20} color="#7E3AF2" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const Clientes = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientes,setClientes]=useState([]);

  const db= useSQLiteContext();
  // Datos de ejemplo

  const fetchClientes = async () => {
    try {
      const clientesData = await listClientes(db);
      const sanitizedClientes = clientesData.map(cliente => ({
        id: cliente.Cliente_id, // Mapeo de Cliente_id a id
        dni: cliente.dni?.toString() || 'Sin dni', 
        nombre: cliente.nombre_completo || 'Sin Nombre',
        email: cliente.email || 'Sin Email',
        telefono: cliente.telefono?.toString() || 'Sin Teléfono',
        direccion: cliente.direccion || 'Sin Dirección',
        pais: cliente.pais || 'Sin País',
      }));
      setClientes(sanitizedClientes);
      
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

useFocusEffect(
  React.useCallback(() => {
    fetchClientes();
  }, [])
);
const handleEditCliente = (cliente) => {
  // Navigate to EditClientScreen and pass the client data
  navigation.navigate('EditClientScreen', { cliente });
};

  const filteredClientes = clientes.filter(cliente =>
    (cliente.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
    (cliente.dni?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
    (cliente.email?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
    (cliente.telefono?.toString().includes(searchQuery) || '')
  );
  
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Clientes</Text>
        <Text style={styles.subtitle}>Gestiona tu cartera de clientes</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, email, dni o teléfono..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{clientes.length}</Text>
          <Text style={styles.statLabel}>Total Clientes</Text>
        </View>
     
      </View>

      <FlatList
        data={filteredClientes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ClienteCard 
            cliente={item} 
            onEdit={handleEditCliente}
          
          
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('NuevoCliente')}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  headerContainer: {
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    color: 'black',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'black',
    fontSize: 16,
    marginTop: 5,
  },
  searchContainer: {
    padding: 16,
    marginTop: -25,
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
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7E3AF2',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#7E3AF2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nombreCliente: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detalleCliente: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  editButton: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#7E3AF2',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default Clientes;