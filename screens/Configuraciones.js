import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Modal, SafeAreaView, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Paleta de colores moderna en tonos morados
const COLORS = {
  primary: '#5B21B6',      // Morado principal
  secondary: '#7C3AED',    // Morado secundario
  tertiary: '#A78BFA',     // Morado claro
  background: '#F5F3FF',   // Fondo muy claro morado
  surface: '#FFFFFF',      // Blanco para tarjetas
  text: '#1F2937',        // Texto oscuro
  textSecondary: '#6B7280', // Texto secundario
  border: '#E5E7EB',      // Bordes
  error: '#DC2626',       // Rojo para acciones críticas
};

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

  const MenuItem = ({ icon, title, subtitle, onPress }) => (
    <TouchableOpacity 
      style={styles.menuItem}
      onPress={onPress}
    >
      <FontAwesome name={icon} size={20} color={COLORS.primary} style={styles.menuIcon} />
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <FontAwesome name="angle-right" size={20} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  const Header = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.backButton}>
          <FontAwesome name="angle-left" size={24} color={COLORS.surface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configuración</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerAction}>
            <FontAwesome name="bell" size={20} color={COLORS.surface} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Profile Preview in Header */}
      <View style={styles.profilePreview}>
        <View style={styles.profileImageWrapper}>
          <Image
            source={{ uri: profileData.profileImage }}
            style={styles.headerProfileImage}
          />
          <TouchableOpacity 
            style={styles.editProfileBadge}
            onPress={() => setIsEditingProfile(true)}
          >
            <FontAwesome name="camera" size={12} color={COLORS.surface} />
          </TouchableOpacity>
        </View>
        <View style={styles.profilePreviewInfo}>
          <Text style={styles.profilePreviewName}>{profileData.name}</Text>
          <Text style={styles.profilePreviewEmail}>{profileData.email}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Company Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Datos de la Empresa</Text>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => setIsEditingCompany(true)}
            >
              <FontAwesome name="edit" size={16} color={COLORS.surface} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.companyContent}>
            <View style={styles.companyLogoContainer}>
              <Image
                source={{ uri: companyData.logo }}
                style={styles.companyLogo}
              />
              <View style={styles.companyLogoOverlay}>
                <TouchableOpacity onPress={() => pickImage('company')}>
                  <FontAwesome name="camera" size={16} color={COLORS.surface} />
                </TouchableOpacity>
              </View>
            </View>
            
            <MenuItem 
              icon="building" 
              title={companyData.name}
              subtitle="Nombre de la empresa"
            />
            <MenuItem 
              icon="id-card" 
              title={companyData.ruc}
              subtitle="RUC"
            />
            <MenuItem 
              icon="map-marker" 
              title={companyData.location}
              subtitle="Ubicación"
            />
            <MenuItem 
              icon="phone" 
              title={companyData.phone}
              subtitle="Teléfono"
            />
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuraciones de Cuenta</Text>
          <MenuItem 
            icon="lock" 
            title="Cambiar Contraseña"
            onPress={() => setIsChangingPassword(true)}
          />
          <MenuItem 
            icon="shield" 
            title="Privacidad y Seguridad"
          />
          <MenuItem 
            icon="gear" 
            title="Preferencias"
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <FontAwesome name="sign-out" size={20} color={COLORS.surface} />
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  headerRight: {
    width: 40,
    alignItems: 'center',
  },
  headerAction: {
    position: 'relative',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1,
    borderColor: COLORS.surface,
  },
  profilePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileImageWrapper: {
    position: 'relative',
  },
  headerProfileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: COLORS.surface,
  },
  editProfileBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  profilePreviewInfo: {
    marginLeft: 15,
    flex: 1,
  },
  profilePreviewName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: 4,
  },
  profilePreviewEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  editButton: {
    backgroundColor: COLORS.secondary,
    padding: 8,
    borderRadius: 12,
  },
  companyContent: {
    alignItems: 'center',
  },
  companyLogoContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  companyLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  companyLogoOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.secondary,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    width: '100%',
  },
  menuIcon: {
    width: 24,
    alignItems: 'center',
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  menuTitle: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  menuSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 15,
    marginVertical: 20,
  },
  logoutButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default Configuraciones;