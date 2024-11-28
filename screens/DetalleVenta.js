import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Modal, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomInput from '../components/CustomInput';
import { getDBConnection, registrarVenta } from '../database';
import DropDownPicker from 'react-native-dropdown-picker';
import ProductoCarritoCard from '../components/ProductoCarritoCard '; 
import EmptyState from '../components/EmptyState';
import { useCart } from '../components/CartContext'; 
import ClientSearchInput from '../components/ClientSearchInput ';
import { useToast } from '../components/ToastContext'; 
import VentaFooter from '../components/VentaFooter';
import { useSQLiteContext } from 'expo-sqlite';
import { generarBoleta } from '../components/GenerarBoleta';
import { useFocusEffect } from '@react-navigation/native';
const DetalleVenta = ({ navigation }) => {
    const { showToast } = useToast(); 
    const { cartItems, removeFromCart, updateQuantity } = useCart();   
    const [total, setTotal] = useState(0);
    const [selectedClient, setSelectedClient] = useState(null);
    const [subtotal, setSubtotal] = useState(0);

    const [openCourier, setOpenCourier] = useState(false);
    const [openTipo, setOpenTipo] = useState(false);
    const [selectedCourier, setSelectedCourier] = useState(null);
    const [selectedTipo, setSelectedTipo] = useState(null);
    const [courierItems, setCourierItems] = useState([]);
    const [tipoItems, setTipoItems] = useState([]);
    const [descuento, setDescuento] = useState('');

    const [showBoletaModal, setShowBoletaModal] = useState(false);
    const [ventaActual, setVentaActual] = useState(null);
    const [detallesVentaActual, setDetallesVentaActual] = useState([]);

    const db=useSQLiteContext();

    const fetchCouriers = async () => {
        try {
            const result = await db.getAllAsync(`SELECT * FROM Courier`);

            if (result && result.length > 0) {
                const couriersList = result.map(courier => ({
                    label: courier.nombre,
                    value: courier.Courier_id
                }));
                setCourierItems(couriersList);
            } else {
                setCourierItems([]);
            }
        } catch (error) {
            console.error("Error al obtener couriers:", error);
        }
    };
  
    const fetchTipos = async () => {
        try {
            const result = await db.getAllAsync(`SELECT * FROM Tipo_Venta`);
            if (result && result.length > 0) {
                const tiposList = result.map(tipo => ({
                    label: tipo.nombre,
                    value: tipo.tipoVenta_id
                }));
                setTipoItems(tiposList);
            } else {
                setTipoItems([]);
            }
        } catch (error) {
            console.error("Error al obtener tipos de venta:", error);
        }
    };
    const validarDescuento = () => {
        const descuentoNumerico = parseFloat(descuento) || 0;
        if (descuentoNumerico > subtotal) {
            showToast('Info', 'El descuento no puede ser mayor que el subtotal', 'info');
            setDescuento(0); 
            return false;
        }
        return true;
    };
  useFocusEffect(
    React.useCallback(() => {
      if (cartItems.length === 0) {
        navigation.navigate('VentaProducto'); 
      }
    }, [cartItems, navigation])
  );
    useEffect(() => {
        const subtotalAmount = cartItems.reduce(
            (sum, producto) => sum + producto.price * producto.quantity,
            0
        );
        setSubtotal(subtotalAmount);
    
        const descuentoNumerico = parseFloat(descuento) || 0;
        const totalFinal = Math.max(0, subtotalAmount - descuentoNumerico);
        setTotal(totalFinal);
    }, [cartItems, descuento]);

  
    useEffect(() => {
        fetchCouriers();
        fetchTipos();
    }, []);

    const incrementarCantidad = (index) => {
        const producto = cartItems[index];
        updateQuantity(producto.id, producto.quantity + 1); 
    };

    const decrementarCantidad = (index) => {
        const producto = cartItems[index];
        if (producto.quantity > 1) {
            updateQuantity(producto.id, producto.quantity - 1); 
        }
    };
    const eliminarProducto = (index) => {
        removeFromCart(cartItems[index].id);  
    };

    const handleClientSelect = (client) => {
        setSelectedClient(client); 
    };



const handleRegistrarVenta = async () => {
    if (!validarDescuento()) return;
  
    if (!selectedClient || !selectedTipo || !selectedCourier) {
      showToast('Error', 'Por favor, complete todos los campos.', 'warning');
      return;
    }
  
    const ventaData = {
      Cliente_id: selectedClient.Cliente_id,
      Total: total,
      tipoVenta_id: selectedTipo,
      Courier_id: selectedCourier,
      descuento: parseFloat(descuento) || 0,
    };
  
    const detallesVenta = cartItems.map(item => ({
      Producto_id: item.id,
      cantidad: item.quantity,
      precio_unitario: item.price,
      subtotal: item.price * item.quantity,
    }));
  
  
    const result = await registrarVenta(db, ventaData, detallesVenta);

    if (result.success) {
        navigation.navigate('VentaExitosa', {
          total: total,
          descuento: descuento, 
          items: cartItems, 
          cliente: selectedClient,
          ventaId: result.ventaId,    
          timestamp: result.timestamp  
        });

            cartItems.forEach(item => removeFromCart(item.id));
    } else {
      showToast('Error', 'Error al registrar la venta.', 'error');
    }
  };
  

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detalles de la Venta</Text>
            </View>

            {/* Formulario */}
            <View style={styles.form}>
                <ClientSearchInput
                    onClientSelect={handleClientSelect}
                />
                <View style={styles.row}>
                    <View style={styles.halfWidth}>
                        <DropDownPicker
                            open={openCourier}
                            value={selectedCourier}
                            items={courierItems}
                            setOpen={setOpenCourier}
                            setValue={setSelectedCourier}
                            setItems={setCourierItems}
                            placeholder="Courier"
                            onOpen={() => setOpenTipo(false)}
                            zIndex={1000}
                            style={{
                                borderColor: '#dddddd', 
                            }}
                            dropDownContainerStyle={{
                                borderColor: '#dddddd',
                            }}
                        />
                    </View>

                    <View style={styles.halfWidth}>
                        <DropDownPicker
                            open={openTipo}
                            value={selectedTipo}
                            items={tipoItems}
                            setOpen={setOpenTipo}
                            setValue={setSelectedTipo}
                            setItems={setTipoItems}
                            placeholder="Tipo"
                            onOpen={() => setOpenCourier(false)}
                            zIndex={900}
                            style={{
                                borderColor: '#dddddd', 
                            }}
                            dropDownContainerStyle={{
                                borderColor: '#dddddd', 
                            }}
                        />
                    </View>
                </View>
                <View style={styles.descuentoInput}>

                    <CustomInput
                        placeholder="Descuento"
                        value={descuento.toString()} 
                        onChangeText={(value) => setDescuento(value)} 
                        focusedBorderColor="#211132"
                        unfocusedBorderColor="#dddddd"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                    />
                </View>
            </View>

            {/* Carrito */}
            <Text style={styles.carritoTitle}>Carrito</Text>
            <ScrollView style={styles.productList}>
                {cartItems.map((producto, index) => (
                    <ProductoCarritoCard
                        key={index}
                        producto={producto}
                        index={index}
                        incrementarCantidad={() => incrementarCantidad(index)}
                        decrementarCantidad={() => decrementarCantidad(index)}
                        onDelete={() => eliminarProducto(index)}

                        ListEmptyComponent={
                            <EmptyState

                            />
                        }
                    />
                ))}
            </ScrollView>

            {/* Total y Botones */}
            <VentaFooter
                total={total}
                onCancelarVenta={() => navigation.goBack()}
                onRegistrarVenta={handleRegistrarVenta}
            />
<Modal visible={showBoletaModal} animationType="slide">
  <View style={styles.modalContent}>
    <Text style={styles.modalTitle}>¡Venta Registrada!</Text>
    <Text>La boleta se ha generado correctamente.</Text>
    <Button title="Ver Boleta" onPress={() => generarBoleta(ventaActual, detallesVentaActual)} />
    <Button title="Cerrar" onPress={() => setShowBoletaModal(false)} />
  </View>
</Modal>
      
        </View>
        
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    marginTop:20,
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 16,
        textAlign:'center'
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
        marginBottom: 10,
        marginTop: 20,

    },
    halfWidth: {
        width: '48%', 
    },
    customDropdown: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderColor: '#999',
        paddingHorizontal: 10,
        height: 45,
        marginBottom: 15,

    },
    customDropDownContainer: {
        borderRadius: 8,
        backgroundColor: '#FFF',
        borderColor: '#999',
        maxHeight: 150,

    },
    placeholderStyle: {
        color: '#A9A9A9',
        fontSize: 14,
    },
    selectedItemLabel: {
        fontWeight: 'bold',
        color: '#333',
    },
    listItemLabel: {
        color: '#666',
        fontSize: 14,
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
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 8,
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
    descuentoInput: {
        width: 100,
        marginTop: 10,
    }
});

export default DetalleVenta;
