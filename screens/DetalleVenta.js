import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomInput from '../components/CustomInput';
import DropDownPicker from 'react-native-dropdown-picker';
import { Platform } from 'react-native';

const DetalleVenta = ({ navigation }) => {

    const [openCourier, setOpenCourier] = useState(false);
    const [openTipo, setOpenTipo] = useState(false);
    const [selectedCourier, setSelectedCourier] = useState(null);
    const [selectedTipo, setSelectedTipo] = useState(null);
    const handleCourierOpen = () => {
        setOpenTipo(false);  // Cierra el otro dropdown
    };

    const handleTipoOpen = () => {
        setOpenCourier(false);  // Cierra el otro dropdown
    };
    const [items, setItems] = useState([
        { label: 'Olva Courier', value: 'alimentos' },
        { label: 'Shalom', value: 'bebidas' },
        { label: 'Agencia', value: 'ropa' },
        // Agrega más categorías según sea necesario
    ]);
    const [productos, setProductos] = useState([
        {
            id: 1,
            nombre: 'Te Divina',
            modelo: 'Modelo 01',
            codigo: '30023',
            precio: 140,
            cantidad: 2,
        },
        {
            id: 2,
            nombre: 'Te Divina',
            modelo: 'Modelo 01',
            codigo: '30023',
            precio: 140,
            cantidad: 2,
        },
        {
            id: 3,
            nombre: 'Te Divina',
            modelo: 'Modelo 01',
            codigo: '30023',
            precio: 140,
            cantidad: 2,
        },
    ]);

    const incrementarCantidad = (index) => {
        const nuevosProductos = [...productos];
        nuevosProductos[index].cantidad += 1;
        setProductos(nuevosProductos);
    };

    const decrementarCantidad = (index) => {
        const nuevosProductos = [...productos];
        if (nuevosProductos[index].cantidad > 1) {
            nuevosProductos[index].cantidad -= 1;
            setProductos(nuevosProductos);
        }
    };

    const total = productos.reduce((sum, producto) => sum + producto.precio * producto.cantidad, 0);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detalles de la Venta</Text>
                <View style={styles.cartIcon}>
                    <Icon name="shopping-cart" size={24} color="black" />
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>4</Text>
                    </View>
                </View>
            </View>

            {/* Formulario */}
            <View style={styles.form}>
                <CustomInput
                    placeholder="Nombre del cliente"
                    focusedBorderColor="#211132"           // Color del borde cuando está en foco
                    unfocusedBorderColor="#999"           // Color del borde cuando no está en foco
                    placeholderTextColor="#999"           // Color del texto del placeholder
                    errorMessage="Este campo es obligatorio"
                />

                <View style={styles.row}>
                    <View style={styles.dropdownWrapper}>
                        <DropDownPicker
                            open={openCourier}
                            value={selectedCourier}
                            items={items}
                            setOpen={setOpenCourier}
                            setValue={setSelectedCourier}
                            setItems={setItems}
                            placeholder="Courier"
                            onOpen={handleCourierOpen} // Cambiado a una función
                            style={styles.dropdown}
                            containerStyle={styles.dropdownContainer}
                            textStyle={styles.dropdownText}
                            labelStyle={styles.dropdownLabel}
                            placeholderStyle={styles.placeholderStyle}
                            listItemLabelStyle={styles.listItemLabel}
                            dropDownContainerStyle={styles.dropDownContainerStyle}
                            selectedItemLabelStyle={styles.selectedItemLabel}
                            listItemContainerStyle={styles.listItemContainer}
                            zIndex={3000}
                            zIndexInverse={1000}
                        />
                    </View>
                    <View style={styles.dropdownWrapper}>
                        <DropDownPicker
                            open={openTipo}
                            value={selectedTipo}
                            items={items}
                            setOpen={setOpenTipo}
                            setValue={setSelectedTipo}
                            setItems={setItems}
                            placeholder="Tipo"
                            onOpen={handleTipoOpen} // Cambiado a una función
                            style={styles.dropdown}
                            containerStyle={styles.dropdownContainer}
                            textStyle={styles.dropdownText}
                            labelStyle={styles.dropdownLabel}
                            placeholderStyle={styles.placeholderStyle}
                            listItemLabelStyle={styles.listItemLabel}
                            dropDownContainerStyle={styles.dropDownContainerStyle}
                            selectedItemLabelStyle={styles.selectedItemLabel}
                            listItemContainerStyle={styles.listItemContainer}
                            zIndex={2000}
                            zIndexInverse={2000}
                        />
                    </View>
                </View>
                <View style={styles.inputDescuento}>

                    <CustomInput
                        placeholder="Descuento"
                        focusedBorderColor="#211132"
                        unfocusedBorderColor="#999"
                        placeholderTextColor="#999"
                        errorMessage="Este campo es obligatorio"
                        keyboardType="numeric"

                    />
                </View>

            </View>

            {/* Carrito */}
            <Text style={styles.carritoTitle}>Carrito</Text>
            <ScrollView style={styles.productList}>
                {productos.map((producto, index) => (
                    <View key={index} style={styles.productCard}>
                        <View style={styles.productImage}>
                            <View style={styles.imagePlaceholder} />
                        </View>
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{producto.nombre}</Text>
                            <Text style={styles.productModel}>{producto.modelo}</Text>
                            <Text style={styles.productCode}>Code: {producto.codigo}</Text>
                            <Text style={styles.productPrice}>s/.{producto.precio}</Text>
                        </View>
                        <View style={styles.quantityControl}>
                            <TouchableOpacity onPress={() => decrementarCantidad(index)}>
                                <Icon name="remove-circle-outline" size={24} color="black" />
                            </TouchableOpacity>
                            <Text style={styles.quantity}>{producto.cantidad}</Text>
                            <TouchableOpacity onPress={() => incrementarCantidad(index)}>
                                <Icon name="add-circle-outline" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.deleteButton}>
                            <Icon name="delete" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {/* Total y Botones */}
            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>Total: s/ {total}</Text>
                </View>
                <TouchableOpacity style={styles.cancelButton}>
                    <Text style={styles.buttonText}>CANCELAR VENTA</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.registerButton}>
                    <Text style={styles.buttonText}>REGISTRAR VENTA</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginTop: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    cartIcon: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        right: -8,
        top: -8,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
    },
    form: {
        padding: 16,
    },
    inputDescuento: {
        marginTop: 10,
        width: 100,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15,
        zIndex: 1000,
        gap: 10,
    },
    dropdownWrapper: {
        flex: 1,
        justifyContent: 'center',


    },
    dropdown: {
        borderWidth: 1.5,
        borderColor: '#E8E8E8',
        borderRadius: 12,

        backgroundColor: '#FFFFFF',
        minHeight: 45,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    dropdownContainer: {
        paddingVertical: 2,

    },
    dropdownText: {
        fontSize: 14,

    },
    dropdownLabel: {
        fontSize: 14,

    },
    placeholderStyle: {
        color: '#000',
        fontSize: 14,
        fontWeight: '400',
    },
    listItemLabel: {
        color: '#333',
        fontSize: 14,
        fontWeight: '400',
    },
    dropDownContainerStyle: {
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 3,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    selectedItemLabel: {

    },
    listItemContainer: {
        height: 45,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },

    halfInput: {
        width: '48%',
    },
    carritoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 16,
    },
    productList: {
        flex: 1,
    },
    productCard: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
    },
    productImage: {
        width: 60,
        height: 80,
        marginRight: 16,
    },
    imagePlaceholder: {
        backgroundColor: '#f0f0f0',
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    productModel: {
        color: '#666',
    },
    productCode: {
        color: '#999',
    },
    productPrice: {
        fontWeight: 'bold',
        marginTop: 4,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    quantity: {
        marginHorizontal: 8,
        fontSize: 16,
    },
    deleteButton: {
        padding: 4,
    },
    footer: {
        padding: 16,
        backgroundColor: '#211132',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    totalContainer: {
        backgroundColor: '#211132',
        padding: 16,
        borderRadius: 8,
        borderColor: 'white',
        borderWidth: 2,
        marginBottom: 16,
    },
    totalText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    cancelButton: {
        backgroundColor: '#B90909',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    registerButton: {
        backgroundColor: '#EFB810',
        padding: 16,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default DetalleVenta;
