import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CountrySelector from '../components/CountrySelector';
import { useToast } from '../components/ToastContext'; // Importar el contexto
import { useSQLiteContext } from 'expo-sqlite';
import { registrarCliente } from '../database';
import eventEmitter from '../components/eventEmitter';
const InputField = ({ icon, label, value, onChangeText, placeholder, keyboardType = 'default' }) => (
    <View style={styles.inputContainer}>
        <View style={styles.inputContent}>
            <View style={styles.iconContainer}>
                <Icon name={icon} size={20} color="#7534FF" />
            </View>
            <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>{label}</Text>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    keyboardType={keyboardType}
                />
            </View>
        </View>
    </View>
);

const NuevoCliente = ({ navigation, route }) => {
    const [newClientDNI, setNewClientDNI] = useState('');
    const [newClientCountry, setNewClientCountry] = useState('');
    const [newClientName, setNewClientName] = useState('');
    const [newClientEmail, setNewClientEmail] = useState('');
    const [newClientPhone, setNewClientPhone] = useState('');
    const [newClientAddress, setNewClientAddress] = useState('');
    const { showToast } = useToast(); // Usamos el hook para acceder al showToast

    const db=useSQLiteContext();
    useEffect(() => {
        if (route.params?.dni) {
            setNewClientDNI(route.params.dni);
        }
    }, [route.params?.dni]);

  // Función para registrar el cliente
const handleRegistrarCliente = async () => {
    if (!newClientDNI || !newClientName || !newClientCountry || !newClientEmail || !newClientPhone || !newClientAddress) {
        let missingFields = [];

        if (!newClientDNI) missingFields.push('DNI');
        if (!newClientName) missingFields.push('Nombre Completo');
        if (!newClientCountry) missingFields.push('País');
        if (!newClientEmail) missingFields.push('Email');
        if (!newClientPhone) missingFields.push('Teléfono');
        if (!newClientAddress) missingFields.push('Dirección');

        const missingMessage = `Por favor complete los siguientes campos: ${missingFields.join(', ')}`;
        showToast('Error', missingMessage, 'warning');
        return;
    }

    const cliente = {
        dni: newClientDNI,
        nombre_completo: newClientName,
        pais: newClientCountry.name || '',
        email: newClientEmail,
        telefono: newClientPhone,
        direccion: newClientAddress
    };

    try {
        // Registrar el cliente y obtener el ID generado
        const clienteId = await registrarCliente(db, cliente);
        
        if (clienteId) {
            cliente.Cliente_id = clienteId; // Asignar el ID al objeto cliente
            eventEmitter.emit('clientAdded', cliente); // Emitir el cliente con el ID

            console.log("Cliente registrado con ID:", clienteId);

            // Limpia los campos después de registrar
            setNewClientDNI('');
            setNewClientName('');
            setNewClientCountry(null);
            setNewClientEmail('');
            setNewClientPhone('');
            setNewClientAddress('');

            showToast('Éxito', 'Cliente registrado correctamente.', 'success');
            navigation.goBack(); // Navegar de regreso
        }
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            showToast('Error', 'El correo ya está registrado. Intente con otro.', 'error');
        } else {
            console.error("Error al registrar el cliente:", error);
            showToast('Error', 'Hubo un problema al registrar el cliente.', 'error');
        }
    }
};


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-back" size={24} color="#111827" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Registrar Cliente</Text>
                </View>
            </View>
            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.formSection}>
                    <InputField
                        icon="person"
                        label="DNI"
                        value={newClientDNI}
                        onChangeText={setNewClientDNI}
                        placeholder="Ingrese DNI"
                        keyboardType="numeric"
                    />
                    <View style={styles.inputContainer}>
                        <View style={styles.inputContent}>
                            <View style={styles.iconContainer}>
                                <Icon name="flag" size={20} color="#7534FF" />
                            </View>
                            <View style={styles.inputWrapper}>
                                <Text style={styles.inputLabel}>País</Text>
                                <CountrySelector
                                    onSelectCountry={(country) => setNewClientCountry(country)}
                                />
                            </View>
                        </View>
                    </View>
                    <InputField
                        icon="person"
                        label="Nombre Completo"
                        value={newClientName}
                        onChangeText={setNewClientName}
                        placeholder="Ingrese nombre completo"
                    />
                    <InputField
                        icon="mail"
                        label="Email"
                        value={newClientEmail}
                        onChangeText={setNewClientEmail}
                        placeholder="Ingrese email"
                        keyboardType="email-address"
                    />
                 <View style={styles.inputContainer}>
                                <View style={styles.inputContent}>
                                    <View style={styles.iconContainer}>
                                        <Icon name="call" size={20} color="#7534FF" />
                                    </View>
                                    <View style={styles.inputWrapper}>
                                        <Text style={styles.inputLabel}>Teléfono</Text>
                                        <View style={styles.phoneContainer}>
                                            {newClientCountry && (
                                                <View style={styles.countryCodeContainer}>
                                                    <Text style={styles.callingCode}>
                                                        {newClientCountry.flag} {newClientCountry.callingCode}
                                                    </Text>
                                                </View>
                                            )}
                                            <TextInput
                                                style={styles.phoneInput}
                                                placeholder="Teléfono"
                                                value={newClientPhone}
                                                onChangeText={setNewClientPhone}
                                                keyboardType="numeric"
                                                placeholderTextColor="#9CA3AF"
                                            />
                                        </View>
                                    </View>
                                    <Icon name="chevron-forward" size={20} color="#E5E7EB" />
                                </View>
                            </View>

                    <InputField
                        icon="location"
                        label="Dirección"
                        value={newClientAddress}
                        onChangeText={setNewClientAddress}
                        placeholder="Ingrese dirección"
                    />
                </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.saveButton]}
                    onPress={handleRegistrarCliente}
                >
                    <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 2,
        marginTop:40,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 56,
    },
    headerTitle: {
        color: '#111827',
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerRight: {
        width: 40,
    },
    headerDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    contentContainer: {
        flex: 1,
    },
    scrollContent: {
        flex: 1,
    },
    formSection: {
        padding: 16,
        gap: 12,
    },
    inputContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },
    inputContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    inputWrapper: {
        flex: 1,
        marginLeft: 12,
    },
    inputLabel: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 4,
        fontWeight: '500',
    },
    input: {
        fontSize: 16,
        color: '#111827',
        padding: 0,
    },
    countrySelector: {
        padding: 0,
        margin: 0,
        height: 24,
        backgroundColor: 'transparent',
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    countryCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 12,
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
    },
    callingCode: {
        fontSize: 16,
        color: '#111827',
    },
    phoneInput: {
        flex: 1,
        fontSize: 16,
        color: '#111827',
        marginLeft: 12,
        padding: 0,
    },
    buttonContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
        backgroundColor: '#f5f5f5',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    button: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        borderWidth: 1,
        borderColor: '#EF4444',
    },
    cancelButtonText: {
        color: '#EF4444',
    },
    saveButton: {
        backgroundColor: '#7534FF',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default NuevoCliente