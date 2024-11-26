import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import { handleSaveEmpresa } from '../database';
import { useToast } from '../components/ToastContext'; // Importar el contexto

const COLORS = {
    primary: '#4338CA',
    secondary: '#6366F1',
    background: '#F4F4F5',
    surface: '#FFFFFF',
    text: '#18181B',
    textSecondary: '#71717A',
    border: '#E4E4E7',
    error: '#EF4444',
    overlay: 'rgba(0,0,0,0.5)',
};

const ModalEditEmpresa = ({
    modalVisible,
    setModalVisible,
    companyData,
    setCompanyData,
    onUpdateSuccess,
}) => {
    const [companyName, setCompanyName] = useState('');
    const [companyLocation, setCompanyLocation] = useState('');
    const [companyPhone, setCompanyPhone] = useState('');
    const [companyRuc, setCompanyRuc] = useState('');
    const [companyCorreo, setCompanyCorreo] = useState('');
    const db = useSQLiteContext();
    const { showToast } = useToast(); // Usamos el hook para acceder al showToast

    useEffect(() => {
        if (modalVisible && companyData) {
            setCompanyName(companyData.nombre || '');
            setCompanyLocation(companyData.location || '');
            setCompanyPhone(String(companyData.phone || ''));
            setCompanyRuc(String(companyData.ruc || ''));
            setCompanyCorreo(companyData.correo || '');
        }
    }, [modalVisible, companyData]);


    const saveCompanyData = async () => {
        try {
          const Empresa_id = companyData.id;
      
          if (!Empresa_id) {
            console.error('Error: Empresa_id no definido.');
            return;
          }
      
          const updatedData = {
            nombre: companyName.trim() || 'Nombre no registrado',
            direccion: companyLocation.trim() || 'Ubicación no registrada',
            telefono: companyPhone.trim() || 'Teléfono no registrado',
            ruc: companyRuc.trim() || 'RUC no registrado',
            correo_contacto: companyCorreo.trim() || 'Correo no registrado',
          };
      
          const success = await handleSaveEmpresa(db, updatedData, Empresa_id);
      
          if (success) {
            console.log('Datos de la empresa guardados con éxito');
            showToast('success', 'Datos guardados correctamente.', 'success');

            setCompanyData({ ...companyData, ...updatedData }); 
            onUpdateSuccess();
          } else {
            console.error('No se pudo guardar la empresa.');
          }
      
          setModalVisible(false);
        } catch (error) {
          console.error('Error al guardar los datos de la empresa:', error);
        }
      };
      

    return (
        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent
            statusBarTranslucent
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Editar Datos de Empresa</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <FontAwesome name="times" size={20} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.modalContent}>
                        <View style={styles.inputGroup}>
                            <TextInput
                                style={[styles.input, styles.inputPadding]}
                                placeholder="Nombre de la empresa"
                                placeholderTextColor={COLORS.textSecondary}
                                value={companyName}
                                onChangeText={setCompanyName}
                            />
                            <TextInput
                                style={[styles.input, styles.inputPadding]}
                                placeholder="Ubicación"
                                placeholderTextColor={COLORS.textSecondary}
                                value={companyLocation}
                                onChangeText={setCompanyLocation}
                            />
                            <TextInput
                                style={[styles.input, styles.inputPadding]}
                                placeholder="Teléfono"
                                placeholderTextColor={COLORS.textSecondary}
                                value={companyPhone}
                                onChangeText={setCompanyPhone}
                                keyboardType="phone-pad"
                            />
                            <TextInput
                                style={[styles.input, styles.inputPadding]}
                                placeholder="RUC"
                                placeholderTextColor={COLORS.textSecondary}
                                value={companyRuc}
                                onChangeText={setCompanyRuc}
                                keyboardType="numeric"
                            />
                            <TextInput
                                style={[styles.input, styles.inputPadding]}
                                placeholder="Correo"
                                placeholderTextColor={COLORS.textSecondary}
                                value={companyCorreo}
                                onChangeText={setCompanyCorreo}
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.saveButton]}
                            onPress={saveCompanyData}
                        >
                            <Text style={[styles.buttonText, styles.saveButtonText]}>Guardar Cambios</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: COLORS.overlay,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        maxWidth: 500,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
    },
    closeButton: {
        padding: 5,
    },
    modalContent: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    inputGroup: {
        gap: 15,
    },
    input: {
        backgroundColor: COLORS.background,
        borderRadius: 10,
        fontSize: 16,
        color: COLORS.text,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    inputPadding: {
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelButton: {
        marginRight: 10,
        backgroundColor: COLORS.background,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
    },
    buttonText: {
        fontWeight: '500',
    },
    saveButtonText: {
        color: COLORS.surface,
        fontWeight: '600',
    },
});

export default ModalEditEmpresa;