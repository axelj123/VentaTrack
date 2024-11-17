import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import EditClientModal from '../components/EditClientModal';

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
  
  // Datos de ejemplo
  const [clientesEjemplo, setClientesEjemplo] = useState([
    {
      id: '1',
      dni: '12345678',
      nombre: 'Juan Pérez',
      email: 'juan@email.com',
      telefono: '+51 987 654 321',
      direccion: 'Av. Principal 123',
      country: {
        flag: '🇵🇪',
        callingCode: '+51'
      }
    },
    {
      id: '2',
      dni: '87654321',
      nombre: 'María García',
      email: 'maria@email.com',
      telefono: '+51 923 456 789',
      direccion: 'Jr. Secundario 456',
      country: {
        flag: '🇵🇪',
        callingCode: '+51'
      }
    },
    {
      id: '3',
      dni: '87654321',
      nombre: 'María García',
      email: 'maria@email.com',
      telefono: '+51 923 456 789',
      direccion: 'Jr. Secundario 456',
      country: {
        flag: '🇵🇪',
        callingCode: '+51'
      }
    },
    {
      id: '4',
      dni: '87654321',
      nombre: 'María García',
      email: 'maria@email.com',
      telefono: '+51 923 456 789',
      direccion: 'Jr. Secundario 456',
      country: {
        flag: '🇵🇪',
        callingCode: '+51'
      }
    },
    {
      id: '5',
      dni: '87654321',
      nombre: 'María García',
      email: 'maria@email.com',
      telefono: '+51 923 456 789',
      direccion: 'Jr. Secundario 456',
      country: {
        flag: '🇵🇪',
        callingCode: '+51'
      }
    },
    {
      id: '6',
      dni: '87654321',
      nombre: 'María García',
      email: 'maria@email.com',
      telefono: '+51 923 456 789',
      direccion: 'Jr. Secundario 456',
      country: {
        flag: '🇵🇪',
        callingCode: '+51'
      }
    },
  ]);

  const handleEditCliente = (cliente) => {
    setSelectedClient({
      dni: cliente.dni,
      name: cliente.nombre,
      email: cliente.email,
      phone: cliente.telefono,
      address: cliente.direccion,
      country: cliente.country
    });
    setIsEditModalVisible(true);
  };
  const handleUpdateClient = (updatedClientData) => {
    // Actualizar el cliente en el array de clientes
    setClientesEjemplo(prevClientes => 
      prevClientes.map(cliente => {
        if (cliente.id === selectedClient.id) {
          return {
            ...cliente,
            dni: updatedClientData.dni,
            nombre: updatedClientData.name,
            email: updatedClientData.email,
            telefono: updatedClientData.phone,
            direccion: updatedClientData.address,
            country: updatedClientData.country
          };
        }
        return cliente;
      })
    );
  };
  const filteredClientes = clientesEjemplo.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cliente.telefono.includes(searchQuery)
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
            placeholder="Buscar por nombre, email o teléfono..."
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
          <Text style={styles.statNumber}>{clientesEjemplo.length}</Text>
          <Text style={styles.statLabel}>Total Clientes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Nuevos este mes</Text>
        </View>
      </View>

      <FlatList
        data={filteredClientes}
        keyExtractor={(item) => item.id}
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
      <EditClientModal
        isVisible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setSelectedClient(null);
        }}
        clientData={selectedClient}
        onUpdateClient={handleUpdateClient}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
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