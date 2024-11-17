import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Modal,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CountrySelector from './CountrySelector';

const InputField = ({ icon, label, value, onChangeText, placeholder, keyboardType = "default" }) => (
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
            <Icon name="chevron-forward" size={20} color="#E5E7EB" />
        </View>
    </View>
);

const EditClientModal = ({
    isVisible,
    onClose,
    clientData,
    onUpdateClient,
}) => {
    const [dni, setDni] = React.useState(clientData?.dni || '');
    const [country, setCountry] = React.useState(clientData?.country || null);
    const [name, setName] = React.useState(clientData?.name || '');
    const [email, setEmail] = React.useState(clientData?.email || '');
    const [phone, setPhone] = React.useState(clientData?.phone || '');
    const [address, setAddress] = React.useState(clientData?.address || '');

    React.useEffect(() => {
        if (clientData && isVisible) {
            setDni(clientData.dni || '');
            setCountry(clientData.country || null);
            setName(clientData.name || '');
            setEmail(clientData.email || '');
            setPhone(clientData.phone || '');
            setAddress(clientData.address || '');
        }
    }, [clientData, isVisible]);

    const handleUpdate = () => {
        const updatedClient = {
            dni,
            country,
            name,
            email,
            phone,
            address,
        };
        onUpdateClient(updatedClient);
        onClose();
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
        >
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={onClose}
                        >
                            <Icon name="chevron-back" size={24} color="#111827" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Editar Cliente</Text>
                        <View style={styles.headerRight} />
                    </View>
                    <View style={styles.headerDivider} />
                </View>

                {/* Content */}
                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.contentContainer}
                >
                    <ScrollView 
                        style={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.formSection}>
                            <InputField
                                icon="person"
                                label="DNI"
                                value={dni}
                                onChangeText={setDni}
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
                                            style={styles.countrySelector}
                                            initialCountry={country}
                                            onSelectCountry={setCountry}
                                        />
                                    </View>
                                    <Icon name="chevron-forward" size={20} color="#E5E7EB" />
                                </View>
                            </View>

                            <InputField
                                icon="person"
                                label="Nombre Completo"
                                value={name}
                                onChangeText={setName}
                                placeholder="Ingrese nombre completo"
                            />

                            <InputField
                                icon="mail"
                                label="Email"
                                value={email}
                                onChangeText={setEmail}
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
                                            {country && (
                                                <View style={styles.countryCodeContainer}>
                                                    <Text style={styles.callingCode}>
                                                        {country.flag} {country.callingCode}
                                                    </Text>
                                                </View>
                                            )}
                                            <TextInput
                                                style={styles.phoneInput}
                                                placeholder="Teléfono"
                                                value={phone}
                                                onChangeText={setPhone}
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
                                value={address}
                                onChangeText={setAddress}
                                placeholder="Ingrese dirección"
                            />
                        </View>
                    </ScrollView>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.saveButton]}
                            onPress={handleUpdate}
                        >
                            <Text style={styles.buttonText}>Actualizar</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    // ... Los mismos estilos que el NewClientModal
    container: {
        flex: 1,
        backgroundColor: 'white',
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
        fontWeight: '600',
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
        backgroundColor: '#F3F4F6',
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
        backgroundColor: '#FFFFFF',
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

export default EditClientModal;