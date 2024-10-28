import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Modal, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const Configuraciones = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: 'Melina Erika Muñoz Silva',
    email: 'axeljhosmell13@gmail.com',
    profileImage: 'https://www.elitesingles.co.uk/wp-content/uploads/sites/59/2019/11/2b_en_articleslide_sm2-350x264.jpg'
  });

  const [companyData, setCompanyData] = useState({
    name: 'Empresa Peruana',
    location: 'Lima, Perú',
    phone: '+51 123 456 789',
    ruc: '20123456789',
    logo: 'https://via.placeholder.com/150',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const pickImage = async (type) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      if (type === 'profile') {
        setProfileData({ ...profileData, profileImage: result.assets[0].uri });
      } else {
        setCompanyData({ ...companyData, logo: result.assets[0].uri });
      }
    }
  };

  const handleSaveProfile = () => {
    // Aquí iría la lógica para guardar los datos del perfil
    setIsEditingProfile(false);
    Alert.alert('Éxito', 'Perfil actualizado correctamente');
  };

  const handleSaveCompany = () => {
    // Aquí iría la lógica para guardar los datos de la empresa
    setIsEditingCompany(false);
    Alert.alert('Éxito', 'Datos de la empresa actualizados correctamente');
  };

  const handleChangePassword = () => {
    // Aquí iría la lógica para cambiar la contraseña
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    setIsChangingPassword(false);
    Alert.alert('Éxito', 'Contraseña actualizada correctamente');
  };

  // Modal de edición de perfil
  const ProfileEditModal = () => (
    <Modal
      visible={isEditingProfile}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Editar Perfil</Text>
          
          <TouchableOpacity 
            style={styles.imageContainer}
            onPress={() => pickImage('profile')}
          >
            <Image
              source={{ uri: profileData.profileImage }}
              style={styles.profileImage}
            />
            <View style={styles.imageOverlay}>
              <FontAwesome name="camera" size={20} color="#fff" />
            </View>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={profileData.name}
            onChangeText={(text) => setProfileData({...profileData, name: text})}
            placeholder="Nombre completo"
          />
          <TextInput
            style={styles.input}
            value={profileData.email}
            onChangeText={(text) => setProfileData({...profileData, email: text})}
            placeholder="Correo electrónico"
            keyboardType="email-address"
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setIsEditingProfile(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSaveProfile}
            >
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Modal de edición de empresa
  const CompanyEditModal = () => (
    <Modal
      visible={isEditingCompany}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Datos de la Empresa</Text>

          <TouchableOpacity 
            style={styles.imageContainer}
            onPress={() => pickImage('company')}
          >
            <Image
              source={{ uri: companyData.logo }}
              style={styles.companyLogo}
            />
            <View style={styles.imageOverlay}>
              <FontAwesome name="camera" size={20} color="#fff" />
            </View>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={companyData.name}
            onChangeText={(text) => setCompanyData({...companyData, name: text})}
            placeholder="Nombre de la empresa"
          />
          <TextInput
            style={styles.input}
            value={companyData.ruc}
            onChangeText={(text) => setCompanyData({...companyData, ruc: text})}
            placeholder="RUC"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={companyData.location}
            onChangeText={(text) => setCompanyData({...companyData, location: text})}
            placeholder="Ubicación"
          />
          <TextInput
            style={styles.input}
            value={companyData.phone}
            onChangeText={(text) => setCompanyData({...companyData, phone: text})}
            placeholder="Teléfono"
            keyboardType="phone-pad"
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setIsEditingCompany(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSaveCompany}
            >
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Modal de cambio de contraseña
  const PasswordChangeModal = () => (
    <Modal
      visible={isChangingPassword}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Cambiar Contraseña</Text>

          <TextInput
            style={styles.input}
            value={passwordData.currentPassword}
            onChangeText={(text) => setPasswordData({...passwordData, currentPassword: text})}
            placeholder="Contraseña actual"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            value={passwordData.newPassword}
            onChangeText={(text) => setPasswordData({...passwordData, newPassword: text})}
            placeholder="Nueva contraseña"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            value={passwordData.confirmPassword}
            onChangeText={(text) => setPasswordData({...passwordData, confirmPassword: text})}
            placeholder="Confirmar nueva contraseña"
            secureTextEntry
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setIsChangingPassword(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleChangePassword}
            >
              <Text style={styles.buttonText}>Cambiar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => setIsEditingProfile(true)}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.profileImage}
              source={{ uri: profileData.profileImage }}
            />
            <View style={styles.editBadge}>
              <FontAwesome name="pencil" size={12} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>
        <Text style={styles.userName}>{profileData.name}</Text>
        <Text style={styles.userEmail}>{profileData.email}</Text>
      </View>

      {/* Company Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Datos de la Empresa</Text>
          <TouchableOpacity onPress={() => setIsEditingCompany(true)}>
            <FontAwesome name="edit" size={20} color="#1E90FF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.companyLogoContainer}>
          <Image
            style={styles.companyLogo}
            source={{ uri: companyData.logo }}
          />
        </View>

        <View style={styles.infoRow}>
          <FontAwesome name="building" size={24} color="#555" />
          <Text style={styles.infoText}>{companyData.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome name="id-card" size={24} color="#555" />
          <Text style={styles.infoText}>RUC: {companyData.ruc}</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome name="map-marker" size={24} color="#555" />
          <Text style={styles.infoText}>{companyData.location}</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome name="phone" size={24} color="#555" />
          <Text style={styles.infoText}>{companyData.phone}</Text>
        </View>
      </View>

      {/* Account Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuraciones de Cuenta</Text>
        <TouchableOpacity 
          style={styles.optionButton}
          onPress={() => setIsChangingPassword(true)}
        >
          <Text style={styles.optionText}>Cambiar Contraseña</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      {/* Modals */}
      <ProfileEditModal />
      <CompanyEditModal />
      <PasswordChangeModal />
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
    marginTop: 40,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  editBadge: {
    position: 'absolute',
    bottom: 10,
    right: 0,
    backgroundColor: '#1E90FF',
    borderRadius: 15,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  companyLogoContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  companyLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 0.48,
    paddingVertical: 12,
  },
});

export default Configuraciones;
