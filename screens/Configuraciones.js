import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Configuraciones = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* User Profile Section */}
      <View style={styles.profileContainer}>
        <Image
          style={styles.profileImage}
          source={{ uri: 'https://www.elitesingles.co.uk/wp-content/uploads/sites/59/2019/11/2b_en_articleslide_sm2-350x264.jpg' }} // Imagen de usuario (coloca aquí la URL de la foto real del usuario)
        />
        <Text style={styles.userName}>Nombre del Usuario</Text>
        <Text style={styles.userEmail}>usuario@example.com</Text>
      </View>

      {/* Company Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos de la Empresa</Text>
        <View style={styles.infoRow}>
          <FontAwesome name="building" size={24} color="#555" />
          <Text style={styles.infoText}>Nombre de la Empresa: Empresa Peruana</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome name="map-marker" size={24} color="#555" />
          <Text style={styles.infoText}>Ubicación: Lima, Perú</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome name="phone" size={24} color="#555" />
          <Text style={styles.infoText}>Teléfono: +51 123 456 789</Text>
        </View>
        <TouchableOpacity>
          <Text>Cambiar datos de la empresa</Text>
        </TouchableOpacity>
      </View>

      {/* Account Actions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuraciones de Cuenta</Text>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Cambiar Contraseña</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Actualizar Información</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,

  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    marginTop:40,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#555',
  },
  optionButton: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 14,
    color: '#1E90FF',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Configuraciones;
