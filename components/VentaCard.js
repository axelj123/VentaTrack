import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const VentaCard = ({ venta, onReimprimir }) => {
  const [expandido, setExpandido] = useState(false);
  const animacionAltura = useRef(new Animated.Value(0)).current;

  const toggleExpansion = () => {
    const toValue = expandido ? 0 : 1;
    setExpandido(!expandido);
    Animated.spring(animacionAltura, {
      toValue,
      useNativeDriver: false,
      friction: 8,
    }).start();
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <View style={styles.headerInfo}>
          <Text style={styles.ventaId}>Venta #{venta.Venta_id}</Text>
          <Text style={styles.fecha}>{venta.Fecha_venta}</Text>
        </View>
        <View style={styles.headerTotal}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>S/ {venta.Total}</Text>
        </View>
      </View>

      <View style={styles.basicInfo}>
        <View style={styles.infoRow}>
          <Icon name="person" size={16} color="#666" />
          <Text style={styles.infoText}>{venta.cliente_nombre}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="local-shipping" size={16} color="#666" />
          <Text style={styles.infoText}>{venta.courier_nombre}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="payment" size={16} color="#666" />
          <Text style={styles.infoText}>{venta.tipo_venta}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.expandButton} onPress={toggleExpansion}>
        <Text style={styles.expandButtonText}>
          {expandido ? 'Ocultar detalles' : 'Ver detalles'}
        </Text>
        <Icon
          name={expandido ? 'expand-less' : 'expand-more'}
          size={24}
          color="#6200EE"
        />
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.detallesContainer,
          {
            maxHeight: animacionAltura.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 500]
            }),
            opacity: animacionAltura
          }
        ]}
      >
        <View style={styles.divider} />
        {venta.detalles.map((detalle) => (
          <View key={detalle.Detalle_id} style={styles.detalleItem}>
            <View style={styles.detalleHeader}>
              <Text style={styles.productoNombre}>{detalle.producto_nombre}</Text>
              <Text style={styles.detalleSubtotal}>S/ {detalle.subtotal}</Text>
            </View>
            <View style={styles.detalleCantidad}>
              <Text style={styles.cantidadText}>
                {detalle.cantidad} x S/ {detalle.precio_unitario}
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.resumenContainer}>
          <View style={styles.resumenItem}>
            <Text style={styles.resumenLabel}>Subtotal:</Text>
            <Text style={styles.resumenValor}>S/ {venta.Total + venta.descuento}</Text>
          </View>
          <View style={styles.resumenItem}>
            <Text style={styles.resumenLabel}>Descuento:</Text>
            <Text style={styles.resumenValor}>- S/ {venta.descuento}</Text>
          </View>
          <View style={[styles.resumenItem, styles.totalItem]}>
            <Text style={styles.totalLabel}>Total Final:</Text>
            <Text style={styles.totalFinal}>S/ {venta.Total}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.reimprimirButton}
          onPress={() => onReimprimir(venta.Venta_id)}
        >
          <Icon name="print" size={18} color="#FFF" />
          <Text style={styles.reimprimirButtonText}>Reimprimir Boleta</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
      },
      headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 20,
        color: '#1a1a1a',
        textAlign: 'center',
      },
      cardContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
      },
      headerInfo: {
        flex: 1,
      },
      ventaId: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
      },
      fecha: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
      },
      headerTotal: {
        alignItems: 'flex-end',
      },
      totalLabel: {
        fontSize: 14,
        color: '#666',
      },
      totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6200EE',
      },
      basicInfo: {
        padding: 16,
        backgroundColor: '#fafafa',
      },
      infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
      },
      infoText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#444',
      },
      expandButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
      },
      expandButtonText: {
        color: '#6200EE',
        fontWeight: '600',
        marginRight: 8,
      },
      detallesContainer: {
        overflow: 'hidden',
      },
      divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginHorizontal: 16,
      },
      detalleItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
      },
      detalleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      productoNombre: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        flex: 1,
      },
      detalleSubtotal: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
      },
      detalleCantidad: {
        marginTop: 4,
      },
      cantidadText: {
        fontSize: 14,
        color: '#666',
      },
      resumenContainer: {
        padding: 16,
        backgroundColor: '#fafafa',
      },
      resumenItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
      },
      resumenLabel: {
        fontSize: 14,
        color: '#666',
      },
      resumenValor: {
        fontSize: 14,
        color: '#1a1a1a',
      },
      totalItem: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
      },
      totalFinal: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6200EE',
      },
      reimprimirButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6200EE',
        marginHorizontal: 16,
        marginVertical: 16,
        padding: 12,
        borderRadius: 8,
      },
      reimprimirButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
      },
    
});

export default VentaCard;
