import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';

const VentaExitosa = ({ route, navigation }) => {
  const { total } = route.params;
  const scaleValue = new Animated.Value(0);
  const fadeValue = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Success Animation */}
        <Animated.View style={[
          styles.successCircle,
          {
            transform: [{ scale: scaleValue }],
          }
        ]}>
          <View style={styles.checkContainer}>
            <FontAwesome name="check" size={40} color="#ffffff" />
          </View>
        </Animated.View>

        {/* Content */}
        <Animated.View style={{ opacity: fadeValue, width: '100%', alignItems: 'center' }}>
          <Text style={styles.title}>¡Venta Registrada!</Text>
          <Text style={styles.subtitle}>Transacción completada con éxito</Text>
          
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <Text style={styles.amount}>{total.toFixed(2)}</Text>
          </View>

          <TouchableOpacity 
  style={styles.ticketButton}
  onPress={() => 
    navigation.navigate('TicketView', {
      total: total,
      descuento: route.params.descuento, // Incluye el descuento

      items: route.params.items.map(item => ({
        Producto_id: item.id, 
        
        cantidad: item.quantity, 
        
      })),
      clienteId: route.params.cliente.Cliente_id, 
      ventaId: route.params.ventaId,     
      timestamp: route.params.timestamp       
    })
  
  
  }
>
  <Feather name="send" size={20} color="#211132" />
  <Text style={styles.ticketButtonText}>Ver o enviar ticket</Text>
</TouchableOpacity>



          <TouchableOpacity 
            style={styles.newSaleButton}
            onPress={() => navigation.navigate('VentaProducto')} // Asegúrate de tener esta pantalla
          >
            <Feather name="shopping-bag" size={20} color="#ffffff" style={styles.buttonIcon} />
            <Text style={styles.newSaleButtonText}>Empezar nueva venta</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  checkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#211132',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  currencySymbol: {
    fontSize: 28,
    fontWeight: '600',
    color: '#211132',
    marginTop: 12,
  },
  amount: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#211132',
  },
  ticketButton: {
    width: '100%',
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#211132',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  ticketButtonText: {
    color: '#211132',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  newSaleButton: {
    width: '100%',
    backgroundColor: '#211132',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newSaleButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default VentaExitosa;