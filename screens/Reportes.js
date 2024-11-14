import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../components/ToastContext';
import { obtenerVentas } from '../database';
import { useFocusEffect } from '@react-navigation/native';
import VentaCard from '../components/VentaCard';

const Reportes = () => {
  const { showToast } = useToast();
  const [ventas, setVentas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const cargarVentas = async () => {
    setIsLoading(true);
    try {
      const ventasObtenidas = await obtenerVentas();
      setVentas(ventasObtenidas);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
      showToast('Error al cargar las ventas', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Solo actualizamos si el componente ya está montado
      // para evitar doble carga inicial
      const updateData = async () => {
        await cargarVentas();
      };
      updateData();

      return () => {
        // Cleanup si es necesario
      };
    }, [])
  );

  const handleReimprimirBoleta = (ventaId) => {
    showToast(`Boleta de la venta ${ventaId} reimpresa`, 'success');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Reportes de Ventas</Text>
      {ventas.map((venta) => (
        <VentaCard
          key={venta.Venta_id}
          venta={venta}
          onReimprimir={handleReimprimirBoleta}
        />
      ))}
    </ScrollView>
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
  
});

export default Reportes;