import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5, Feather,MaterialCommunityIcons  } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import { generarBoleta } from '../components/GenerarBoleta';
import { getEmpresa } from '../database';

const TicketView = ({ route, navigation }) => {
  const { total, descuento, items, clienteId, ventaId, timestamp } = route.params; // Desestructuración de los parámetros
  const db = useSQLiteContext();

  const [cliente, setCliente] = useState(null);
  const [productos, setProductos] = useState([]);
  const [companyData, setCompanyData] = useState({
    nombre: '',
    location: '',
    phone: '',
    correo:'',
  });
  useEffect(() => {
    fetchEmpresa();
    if (clienteId) {
      fetchCliente(clienteId);
    }
    if (items.length > 0) {
      fetchProductos(items);
    }
  }, [clienteId, items]);

  const fetchCliente = async (Cliente_id) => {
    try {
      const result = await db.getAllAsync(
        `SELECT nombre_completo FROM Cliente WHERE Cliente_id = ?`,
        [Cliente_id]
      );
      setCliente(result.length > 0 ? { nombre: result[0].nombre_completo, Cliente_id } : null);
    } catch (error) {
      console.error('Error al obtener datos del cliente:', error);
      setCliente(null);
    }
  };

  const fetchProductos = async (productos) => {
    try {
      if (!productos || productos.length === 0) {
        setProductos([]);
        return;
      }

      // Extraer IDs de los productos
      const ids = productos.map((item) => item.Producto_id);

      if (ids.length === 0) {
        setProductos([]);
        return;
      }

      // Construir marcadores dinámicos para la consulta SQL
      const placeholders = ids.map(() => '?').join(',');

      // Consultar los nombres y precios de los productos
      const result = await db.getAllAsync(
        `SELECT Producto_id, nombre, precio_venta FROM Productos WHERE Producto_id IN (${placeholders})`,
        ids
      );

      // Mapear los datos con las cantidades de `items`
      const productosMapeados = productos.map((item) => ({
        ...item,
        nombre: result.find((prod) => prod.Producto_id === item.Producto_id)?.nombre || 'N/A',
        precio_venta: result.find((prod) => prod.Producto_id === item.Producto_id)?.precio_venta || 0,
      }));

      setProductos(productosMapeados);
    } catch (error) {
      console.error('Error al obtener nombres de productos:', error);
      setProductos([]);
    }
  };



  const handleGeneratePDF = async () => {
    // Asegurarnos de que el descuento sea un número
    const descuentoNumerico = parseFloat(descuento || 0);
    const totalNumerico = parseFloat(total || 0);

    // Preparar el objeto venta con valores por defecto seguros
    const venta = {
      Cliente_id: cliente?.nombre || 'Consumidor Final',
      Total: totalNumerico,
      descuento: descuentoNumerico // Aseguramos que sea número
    };

    // Preparar los detalles de venta asegurándonos que todos los valores sean números
    const detallesVenta = productos.map(producto => ({
      cantidad: parseInt(producto.cantidad) || 0,
      descripcion: producto.nombre || 'Producto sin nombre',
      precio_unitario: parseFloat(producto.precio_venta) || 0
    }));

    try {
      // Llamar a la función generarBoleta
      await generarBoleta(venta, detallesVenta);
    } catch (error) {
      console.error('Error específico al generar la boleta:', error);
      // Opcionalmente, puedes mostrar un mensaje al usuario
      Alert.alert(
        'Error',
        'No se pudo generar la boleta. Por favor, intente nuevamente.'
      );
    }
  };

  const fetchEmpresa = async () => {
    try {
      const result = await getEmpresa(db);
  
      console.log("Resultado de fetchEmpresa:", result);
  
      if (result && result.length > 0) {
        const empresa = result[0];
  
        setCompanyData({
          nombre: empresa.nombre || 'Nombre no registrado',
          location: empresa.direccion || 'Ubicación no registrada',
          correo: empresa.correo_contacto || 'Correo no registrado',

        });
      } else {
        console.error("No se encontraron datos para la empresa.");
      }
    } catch (error) {
      console.error("Error al obtener los datos de la empresa:", error);
    }
  };
  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Feather name="x" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Editar mi recibo</Text>
      <View style={{ width: 24 }}>
        <Text> </Text>
      </View>
    </View>
      {/* Ticket Content */}
      <ScrollView style={styles.ticketContainer}>
        <View style={styles.ticketContent}>
        <View style={styles.businessHeader}>
            <MaterialCommunityIcons name="cart" size={40} color="#211132" style={styles.logo} />
            <View style={styles.businessInfoContainer}>
              <Text style={styles.businessName}>{companyData.nombre}</Text>
              <Text style={styles.receiptNumber}>RECIBO# {ventaId}</Text>
            </View>
          </View>
          <Text style={styles.businessAddress}>{companyData.location}</Text>
          <Text style={styles.businessAddress}>{companyData.correo} </Text>

          <View style={styles.separator} />

          {/* Información del cliente */}
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>
              Cliente: {cliente?.nombre || 'N/A'}
            </Text>
            <Text style={styles.clientID}>
              ID Cliente: {cliente?.Cliente_id || 'N/A'}
            </Text>
          </View>

          <View style={styles.separator} />

          {/* Lista de productos */}
          <Text style={styles.itemsHeader}>Productos ({productos?.length || 0})</Text>
          {productos.map((producto, index) => (
            <View style={styles.itemRow} key={index}>
              <Text style={styles.itemQuantity}>{producto.cantidad}x</Text>
              <Text style={styles.itemName}>{producto.nombre || 'Producto sin nombre'}</Text>
              <Text style={styles.itemUnitPrice}>S/{producto.precio_venta.toFixed(2)}</Text>
              <Text style={styles.itemTotalPrice}>S/{(producto.cantidad * producto.precio_venta).toFixed(2)}</Text>
            </View>
          ))} 

          <View style={styles.separator} />

          {/* Totales */}
          <View style={styles.totalsSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalAmount}>    S/{descuento > 0 ? (total + parseFloat(descuento)).toFixed(2) : total.toFixed(2)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Descuento:</Text>
              <Text style={styles.totalAmount}>   -S/{descuento > 0 ? parseFloat(descuento).toFixed(2) : '0.00'}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmountFinal}>S/{total.toFixed(2)}</Text>
            </View>
          </View>

          <Text style={styles.timestamp}>{timestamp}</Text>
          </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionButton} onPress={handleGeneratePDF}>
        <Feather name="share-2" size={20} color="#211132" />
        <Text style={styles.actionText}>Compartir</Text>
        </TouchableOpacity>


        
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  businessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    marginRight: 12,
  },
  businessInfoContainer: {
    flex: 1,
  },
  businessName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#211132',
    textTransform: 'uppercase',
  },
  ticketContainer: {
    flex: 1,
    padding: 16,
  },
  ticketContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  businessInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600',
  },
  receiptNumber: {
    fontSize: 14,
    color: '#666',
  },
  businessAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  clientInfo: {
    marginBottom: 16,
  },
  clientName: {
    fontSize: 14,
    fontWeight: '600',
  },
  clientID: {
    fontSize: 12,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  itemsHeader: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemQuantity: {
    width: 30,
    fontSize: 14,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalsSection: {
    marginTop: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemUnitPrice: {
    fontSize: 14,
    width: 70,
    textAlign: 'right',
  },
  itemTotalPrice: {
    fontSize: 14,
    fontWeight: '500',
    width: 70,
    textAlign: 'right',
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalAmountFinal:{
    fontSize: 24,
    fontWeight: 'bold',

  },
  paymentLabel: {
    fontSize: 14,
    color: '#666',
  },
  paymentAmount: {
    fontSize: 14,
    color: '#666',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 12,
    color: '#211132',
    marginTop: 4,
  },
});

export default TicketView;