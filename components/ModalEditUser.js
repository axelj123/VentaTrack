import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, Alert, Platform,Animated, LayoutAnimation} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import { getUsuario } from '../database';
import { useToast } from './ToastContext';
const COLORS = {
    primary: '#007AFF',
    background: '#F2F2F7',
    surface: '#FFFFFF',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#C7C7CC',
    error: '#FF3B30',
    overlay: 'rgba(0,0,0,0.4)',
};

const ModalEditUser = ({
    modalVisible,
    setModalVisible,
    onUpdateSuccess,
}) => {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showChangePassword, setShowChangePassword] = useState(false);
    const { showToast } = useToast(); // Usamos el hook para acceder al showToast

    // Animated values for password section
    const passwordOpacity = useState(new Animated.Value(0))[0];

    const db = useSQLiteContext();


const toggleChangePassword = () => {
        if (showChangePassword) {
            // Animate opacity out
            Animated.timing(passwordOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }).start(() => {
                setShowChangePassword(false);
                // Reset password fields when hiding
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
            });
        } else {
            // Show password section
            setShowChangePassword(true);
            Animated.timing(passwordOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }).start();
        }
    };

    useEffect(() => {
        fetchUserName();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [showChangePassword]);


    // Function to fetch user data and update inputs
    const fetchUserName = async () => {
        try {
            const result = await getUsuario(db); // Calling getUsuario function to fetch user
            if (result && result.length > 0) {
                const fullName = result[0]?.nombre_completo || "Usuario";
                const mail = result[0]?.email || "email";
                
                // Update the input states directly
                setUserName(fullName);
                setUserEmail(mail);
            } else {
                // Set default values if no user found
                setUserName("Usuario");
                setUserEmail("");
            }
        } catch (error) {
            console.error("Error al obtener el nombre del usuario:", error);
            Alert.alert('Error', 'No se pudo cargar la información del usuario');
        }
    };

    const validateInputs = async () => {
        // Validate basic fields
        if (!userName.trim()) {
            Alert.alert('Error', 'El nombre no puede estar vacío');
            return false;
        }

        if (!userEmail.trim()) {
            Alert.alert('Error', 'El correo electrónico no puede estar vacío');
            return false;
        }

        // If trying to change password, validate password fields
        if (newPassword || confirmNewPassword) {
            // Check current password
            if (!currentPassword.trim()) {
                Alert.alert('Error', 'Debe ingresar su contraseña actual');
                return false;
            }

            // Verify current password
            try {
                const result = await db.getFirstAsync(
                    'SELECT * FROM Usuario WHERE contraseña = ?',
                    [currentPassword]
                );

                if (!result) {
                    Alert.alert('Error', 'La contraseña actual es incorrecta');
                    return false;
                }
            } catch (error) {
                Alert.alert('Error', 'No se pudo verificar la contraseña');
                return false;
            }

            // Validate new password
            if (newPassword !== confirmNewPassword) {
                Alert.alert('Error', 'Las nuevas contraseñas no coinciden');
                return false;
            }

            if (newPassword.length < 6) {
                Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
                return false;
            }
        }

        return true;
    };

    const saveUserData = async () => {
        try {
            // Validar los campos básicos (nombre y correo)
            if (!userName.trim() || !userEmail.trim()) {
                Alert.alert('Error', 'El nombre y correo electrónico no pueden estar vacíos');
                return;
            }

            // Prepara los datos a actualizar
            const updatedData = {
                nombre_completo: userName.trim(),
                email: userEmail.trim(),
            };

            // Si la nueva contraseña está proporcionada, añádela a la actualización
            const updateQuery = newPassword.trim()
                ? 'UPDATE Usuario SET nombre_completo = ?, email = ?, contraseña = ?'
                : 'UPDATE Usuario SET nombre_completo = ?, email = ?';

            const queryParams = newPassword.trim()
                ? [updatedData.nombre_completo, updatedData.email, newPassword.trim()]
                : [updatedData.nombre_completo, updatedData.email];

            // Ejecutar la consulta de actualización
            await db.runAsync(updateQuery, ...queryParams);

            // Mostrar mensaje de éxito
            showToast('success', 'Datos de usuario actualizados correctamente','success');

            // Cerrar el modal y disparar la función de éxito
            onUpdateSuccess();
            setModalVisible(false);

        } catch (error) {
            console.error('Error al actualizar los datos del usuario:', error);
            Alert.alert('Error', 'No se pudieron actualizar los datos del usuario');
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
                        <Text style={styles.modalTitle}>Editar Perfil</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Ionicons name="close" size={24} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.modalContent}>
                        <View style={styles.inputGroup}>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nombre Completo"
                                    placeholderTextColor={COLORS.textSecondary}
                                    value={userName}
                                    onChangeText={setUserName}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Correo Electrónico"
                                    placeholderTextColor={COLORS.textSecondary}
                                    value={userEmail}
                                    onChangeText={setUserEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <TouchableOpacity 
                                style={styles.changePasswordButton} 
                                onPress={toggleChangePassword}
                            >
                                <Ionicons 
                                    name={showChangePassword ? "chevron-up" : "key-outline"} 
                                    size={20} 
                                    color={COLORS.primary} 
                                />
                                <Text style={styles.changePasswordButtonText}>
                                    {showChangePassword ? "Ocultar Cambio de Contraseña" : "Cambiar Contraseña"}
                                </Text>
                            </TouchableOpacity>

                            {showChangePassword && (
                                <Animated.View 
                                    style={[
                                        styles.passwordSection, 
                                        { 
                                            opacity: passwordOpacity 
                                        }
                                    ]}
                                >
                                    <View style={styles.inputContainer}>
                                        <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Contraseña Actual"
                                            placeholderTextColor={COLORS.textSecondary}
                                            value={currentPassword}
                                            onChangeText={setCurrentPassword}
                                            secureTextEntry
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Ionicons name="lock-open-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Nueva Contraseña"
                                            placeholderTextColor={COLORS.textSecondary}
                                            value={newPassword}
                                            onChangeText={setNewPassword}
                                            secureTextEntry
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Ionicons name="lock-open-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Confirmar Nueva Contraseña"
                                            placeholderTextColor={COLORS.textSecondary}
                                            value={confirmNewPassword}
                                            onChangeText={setConfirmNewPassword}
                                            secureTextEntry
                                        />
                                    </View>
                                </Animated.View>
                            )}
                        </View>
                    </View>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={saveUserData}
                        >
                            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
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
        ...Platform.select({
            ios: {
                paddingTop: 50,
            },
        }),
    },
    modalContainer: {
        width: '90%',
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        maxWidth: 500,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 0.5,
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
        paddingHorizontal: 15,
        paddingVertical: 20,
    },
    inputGroup: {
        gap: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: COLORS.border,
    },
    inputIcon: {
        marginLeft: 10,
        marginRight: 5,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: COLORS.text,
        paddingRight: 15,
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderTopWidth: 0.5,
        borderTopColor: COLORS.border,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginRight: 10,
        backgroundColor: COLORS.background,
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: COLORS.text,
        fontWeight: '500',
    },
    saveButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        color: COLORS.surface,
        fontWeight: '600',
    },
    changePasswordButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: COLORS.background,
        borderRadius: 10,
        marginTop: 10,
    },
    changePasswordButtonText: {
        color: COLORS.primary,
        marginLeft: 10,
        fontWeight: '500',
    },
    passwordSection: {
        overflow: 'hidden',
        gap: 15,
    },
});

export default ModalEditUser;