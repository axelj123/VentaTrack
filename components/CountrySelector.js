// CountrySelector.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';

const countries = [
    { code: 'AR', name: 'Argentina', flag: '🇦🇷', callingCode: '+54' },
    { code: 'BO', name: 'Bolivia', flag: '🇧🇴', callingCode: '+591' },
    { code: 'CL', name: 'Chile', flag: '🇨🇱', callingCode: '+56' },
    { code: 'CO', name: 'Colombia', flag: '🇨🇴', callingCode: '+57' },
    { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', callingCode: '+506' },
    { code: 'CU', name: 'Cuba', flag: '🇨🇺', callingCode: '+53' },
    { code: 'DO', name: 'República Dominicana', flag: '🇩🇴', callingCode: '+1' },
    { code: 'EC', name: 'Ecuador', flag: '🇪🇨', callingCode: '+593' },
    { code: 'SV', name: 'El Salvador', flag: '🇸🇻', callingCode: '+503' },
    { code: 'GT', name: 'Guatemala', flag: '🇬🇹', callingCode: '+502' },
    { code: 'HN', name: 'Honduras', flag: '🇭🇳', callingCode: '+504' },
    { code: 'MX', name: 'México', flag: '🇲🇽', callingCode: '+52' },
    { code: 'NI', name: 'Nicaragua', flag: '🇳🇮', callingCode: '+505' },
    { code: 'PA', name: 'Panamá', flag: '🇵🇦', callingCode: '+507' },
    { code: 'PY', name: 'Paraguay', flag: '🇵🇾', callingCode: '+595' },
    { code: 'PE', name: 'Perú', flag: '🇵🇪', callingCode: '+51' },
    { code: 'ES', name: 'España', flag: '🇪🇸', callingCode: '+34' },
    { code: 'UY', name: 'Uruguay', flag: '🇺🇾', callingCode: '+598' },
    { code: 'VE', name: 'Venezuela', flag: '🇻🇪', callingCode: '+58' },
    { code: 'US', name: 'Estados Unidos', flag: '🇺🇸', callingCode: '+1' },
    { code: 'CA', name: 'Canadá', flag: '🇨🇦', callingCode: '+1' },
];

const CountrySelector = ({ onSelectCountry }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtra los países según el término de búsqueda
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsModalVisible(false);
    onSelectCountry(country); // Callback para pasar el país seleccionado al componente principal
  };

  return (
    <View>
        <TouchableOpacity 
            style={styles.selectorButton}
            onPress={() => setIsModalVisible(true)}
        >
            <Text style={styles.selectorText}>
            {selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : 'Seleccione un país'}
            </Text>
        </TouchableOpacity>

        <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setIsModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Seleccionar País</Text>

                {/* Campo de búsqueda */}
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar país"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => handleCountrySelect(item)}
                >
                  <Text style={styles.countryText}>{item.flag} {item.name}</Text>
                </TouchableOpacity>
              )}
            />
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selectorButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    marginBottom:20,

  },
  selectorText: {
    fontSize: 16,
    backgroundColor:"white",
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    flex:1,
    backgroundColor: '#fff',
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  countryItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  countryText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
});

export default CountrySelector;
