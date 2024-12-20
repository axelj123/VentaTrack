import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Modal, SafeAreaView, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import ModalImagePicker from '../components/ModalImagePicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEmpresa, getUsuario } from '../database';
import ModalEditEmpresa from '../components/ModalEditEmpresa';
import ModalEditUser from '../components/ModalEditUser';

const COLORS = {
  primary: '#5B21B6',      
  secondary: '#7C3AED',    
  tertiary: '#A78BFA',     
  background: '#f5f5f5',   
  surface: '#FFFFFF',     
  text: '#1F2937',        
  textSecondary: '#6B7280', 
  border: '#E5E7EB',      
  error: '#DC2626',       
};

const Configuraciones = ({navigation}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageModalVisible, setImageModalVisible] = useState(false); 
  const [companyModalVisible, setCompanyModalVisible] = useState(false); 
  const [selectedImage, setSelectedImage] = useState(null); 
  const [selectCompanyImage, setSelectCompanyImage] = useState(null); 

  const [companyData, setCompanyData] = useState({
    nombre: '',
    location: '',
    phone: '',
    correo: '',
    ruc: '',
    logo: 'https://via.placeholder.com/150',
  });

  const db = useSQLiteContext();

  const saveImageToStorage = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error guardando la imagen:', error);
    }
  };
  const loadImageFromStorage = async (key, setImage) => {
    try {
      const savedImage = await AsyncStorage.getItem(key);
      if (savedImage) {
        setImage(savedImage); 
      }
    } catch (error) {
      console.error('Error cargando la imagen:', error);
    }
  };

  const fetchUserName = async () => {
    try {
      const result = await getUsuario(db); 
      if (result && result.length > 0) {
        const fullName = result[0]?.nombre_completo || "Usuario";
        const mail = result[0]?.email || "email";
        const firstTwoWords = fullName.split(" ").slice(0, 2).join(" ");
        setName(firstTwoWords);
        setEmail(mail);
      } else {
        setName("Usuario");
      }
    } catch (error) {
      console.error("Error al obtener el nombre del usuario:", error);
    }
  };

  const fetchEmpresa = async () => {
    try {
      const result = await getEmpresa(db);


      
      if (result && result.length > 0) {
        const empresa = result[0];

        setCompanyData({
          id: empresa.Empresa_id,
          nombre: empresa.nombre || 'Nombre no registrado',
          location: empresa.direccion || 'Ubicación no registrada',
          phone: empresa.telefono || 'Teléfono no registrado',
          ruc: empresa.ruc || 'RUC no registrado',
          correo: empresa.correo_contacto || 'Correo no registrado',

        });
      } else {
        console.error("No se encontraron datos para la empresa.");
      }
    } catch (error) {
      console.error("Error al obtener los datos de la empresa:", error);
    }
  };
  const refreshEmpresaData = async () => {
    await fetchEmpresa(); 
  };

  useEffect(() => {
    fetchUserName(); 
    fetchEmpresa();
    loadImageFromStorage('profileImage', setSelectedImage);
    loadImageFromStorage('companyImage', setSelectCompanyImage);
  }, []);


  
  
  const MenuItem = ({ icon, title, subtitle }) => (
    <View
      style={styles.menuItem}
    >
      <FontAwesome name={icon} size={20} color={COLORS.primary} style={styles.menuIcon} />
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <FontAwesome name="angle-right" size={20} color={COLORS.textSecondary} />
    </View>
  );

  const Header = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.backButton}>
          <FontAwesome name="angle-left" size={24} color={COLORS.surface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configuración</Text>
        <View style={styles.headerRight}>

        </View>
      </View>

      {/* Profile Preview in Header */}
      <View style={styles.profilePreview}>
        <View style={styles.profileImageWrapper}>
          <Image
            source={selectedImage ? { uri: selectedImage } : { uri: 'https://via.placeholder.com/150' }}
            style={styles.headerProfileImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.editProfileBadge}
            onPress={() => setImageModalVisible(true)}
          >
            <FontAwesome name="camera" size={16} color={COLORS.surface} />
          </TouchableOpacity>
          <ModalImagePicker
            modalVisible={imageModalVisible}
            setModalVisible={setImageModalVisible}
            setSelectedImage={(image) => {
              setSelectedImage(image);
              saveImageToStorage('profileImage', image);
            }}
          />

        </View>


        <View style={styles.profilePreviewInfo}>
          <Text style={styles.profilePreviewName}>{name}</Text>
          <Text style={styles.profilePreviewEmail}>{email}</Text>
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
                source={
                  selectCompanyImage
                    ? { uri: selectCompanyImage } 
                    : { uri: companyData.logo } 
                }
                style={styles.companyLogo}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.companyLogoOverlay}
                onPress={() => setCompanyModalVisible(true)} 
              >
                <FontAwesome name="camera" size={16} color={COLORS.surface} />
              </TouchableOpacity>
              <ModalImagePicker
                modalVisible={companyModalVisible}
                setModalVisible={setCompanyModalVisible}
                setSelectedImage={(image) => {
                  setSelectCompanyImage(image);
                  saveImageToStorage('companyImage', image);
                }}
              />
            </View>


            <MenuItem
              icon="building"
              title={companyData.nombre} 
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
            <MenuItem
              icon="envelope"
              title={companyData.correo}
              subtitle="correo"
            />

          </View>

        </View>
       
         {/* Account Settings */}
         { /* 
         
          <View style={styles.section}>
          <View style={styles.sectionHeader}>

            <Text style={styles.sectionTitle}>Configuraciones de Cuenta</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditingProfile(true)}
            >
              <FontAwesome name="edit" size={16} color={COLORS.surface} />
            </TouchableOpacity>
          </View>
          <MenuItem
            icon="lock"
            title="Cambiar Contraseña"
          />
          <MenuItem
            icon="user"
            title="cambiar nombre de usuario"
          />
          <MenuItem
            icon="envelope"
            title="cambiar correo electrónico"
          />

        </View>
         */}


       
       
        {/*  types */} 

        <ModalEditEmpresa
          modalVisible={isEditingCompany}
          setModalVisible={setIsEditingCompany}
          companyData={companyData}
          setCompanyData={setCompanyData}
          onUpdateSuccess={refreshEmpresaData} 

        />
        <ModalEditUser

          modalVisible={isEditingProfile}
          setModalVisible={setIsEditingProfile}
          setCompanyData={setCompanyData}
          onUpdateSuccess={refreshEmpresaData} 

        />

        {/* Logout Button */}
       
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
    marginBottom: 12,
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
    marginTop: 10,

    marginBottom: 50,
  },
  logoutButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default Configuraciones;