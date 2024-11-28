import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import eventEmitter from './eventEmitter';
const ClientSearchInput = ({ onClientSelect, style }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation(); 

  const db=useSQLiteContext();

 

  const [selectedClient, setSelectedClient] = useState(null);
  useEffect(() => {
    if (searchTerm.length > 0) {
      fetchClients(searchTerm);
    } else {
      setClients([]);
    }
  }, [searchTerm]);

  const fetchClients = async (dni) => {
    try {
      const result = await db.getAllAsync(
        'SELECT * FROM Cliente WHERE dni LIKE ?',
        [`%${dni}%`]
      );
      setClients(result);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClients([]);
    }
  };

  const handleSearchChange = (text) => {
    setSearchTerm(text);
    if (selectedClient && selectedClient.dni !== text) {
      setSelectedClient(null);
    }
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    onClientSelect(client);
    setSearchTerm(client.dni.toString());
    setClients([]);
  };

  const handleAddNewClient = () => {
    navigation.navigate('NuevoCliente', {
        dni: searchTerm, 
    });
};
useEffect(() => {
  const handleClientAdded = (newClient) => {
    if (!newClient.Cliente_id) {
      console.error("El cliente agregado no tiene un Cliente_id:", newClient);
      return;
    }
    setSelectedClient(newClient); 
    setSearchTerm(newClient.dni.toString()); 
    onClientSelect(newClient); 
  };

  eventEmitter.on('clientAdded', handleClientAdded); 

  return () => {
    eventEmitter.off('clientAdded', handleClientAdded);
  };
}, [onClientSelect]);


  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchContainer}>
        <Icon name="person-search" size={24} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Buscar cliente por DNI"
          value={searchTerm}
          onChangeText={handleSearchChange}
          keyboardType="numeric"
        />
        {selectedClient && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              setSearchTerm('');
              setSelectedClient(null);
              onClientSelect(null);
            }}
          >
            <Icon name="close" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {selectedClient && (
        <View style={styles.selectedClientInfo}>
          <Text style={styles.selectedClientName}>{selectedClient.nombre_completo}</Text>
          <Text style={styles.selectedClientDetails}>DNI: {selectedClient.dni}</Text>
        </View>
      )}

      {clients.length > 0 && !selectedClient && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={clients}
            keyExtractor={item => item.dni.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.suggestionItem, selectedClient?.dni === item.dni && styles.selectedItem]}
                onPress={() => handleClientSelect(item)}
              >
                <Text style={styles.clientName}>{item.nombre_completo}</Text>
                <Text style={styles.clientDNI}>DNI: {item.dni}</Text>
              </TouchableOpacity>
            )}
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}

      {searchTerm.length > 0 && clients.length === 0 && !selectedClient && (
        <TouchableOpacity
          style={styles.addNewButton}
          onPress={handleAddNewClient}

        >
          <Icon name="person-add" size={20} color="white" style={styles.addIcon} />
          <Text style={styles.addNewButtonText}>
            Añadir nuevo cliente
          </Text>
        </TouchableOpacity>
      )}
  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    zIndex: 11,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  selectedClientInfo: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#7534FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedClientName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  selectedClientDetails: {
    fontSize: 14,
    color: 'white',
    marginTop: 4,
  },
  suggestionsContainer: {
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height: 200,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedItem: {
    backgroundColor: '#f0f0f0',
  },
  clientName: {
    fontSize: 16,
    fontWeight: '500',
  },
  clientDNI: {
    fontSize: 14,
    color: '#666',
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#7534FF',
    borderRadius: 8,
    marginTop: 8,
  },
  addIcon: {
    marginRight: 8,
  },
  addNewButtonText: {
    color: 'white',
    fontSize: 15,
  },
  
});

export default ClientSearchInput;
