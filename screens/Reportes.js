import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { obtenerVentas } from '../database';
import { useFocusEffect } from '@react-navigation/native';
import VentaCard from '../components/VentaCard';
import EmptyState from '../components/EmptyState';
import FilterTabs from '../components/FilterTabs';
import { obtenerDetallesVenta, obtenerProductoPorId } from '../database';
const Reportes = () => {
  const { showToast } = useToast();
  const [ventas, setVentas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterInterval, setFilterInterval] = useState('Día');
  const [totalSalesAmount, setTotalSalesAmount] = useState(0);
  const [filteredVentas, setFilteredVentas] = useState([]);
  const [totalProfits, setTotalProfits] = useState(0);

  const calcularFechaInicio = (intervalo, fechaPersonalizada = null) => {
    if (fechaPersonalizada) {
      return new Date(fechaPersonalizada);
    }

    const hoy = new Date();
    switch (intervalo) {
      case 'Día':
        return new Date(hoy.setHours(0, 0, 0, 0));
      case 'Semana':
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(hoy.getDate() - 7);
        return inicioSemana;
      case 'Mes':
        const inicioMes = new Date(hoy);
        inicioMes.setDate(hoy.getDate() - 30);
        return inicioMes;
      default:
        return new Date(hoy.setHours(0, 0, 0, 0));
    }
  };

  const cargarVentas = async (filtro = filterInterval, rangoPersonalizado = null) => {
    setIsLoading(true);
    try {
      const ventasObtenidas = await obtenerVentas();
      let fechaInicio = filtro === 'Personalizado' && rangoPersonalizado
        ? new Date(rangoPersonalizado.startDate)
        : calcularFechaInicio(filtro);
      let fechaFin = filtro === 'Personalizado' && rangoPersonalizado
        ? new Date(rangoPersonalizado.endDate)
        : new Date();

      // Filtrar ventas dentro del rango de fechas
      const ventasFiltradas = ventasObtenidas.filter(venta => {
        const fechaVenta = new Date(venta.Fecha_venta);
        return fechaVenta >= fechaInicio && fechaVenta <= fechaFin;
      });

      // Calcular el total de ventas y ganancias
      let totalVentas = 0;
      let totalGanancias = 0;

      for (let venta of ventasFiltradas) {
        const detallesVenta = await obtenerDetallesVenta(venta.Venta_id);
        let gananciaVenta = 0;

        for (let detalle of detallesVenta) {
          const producto = await obtenerProductoPorId(detalle.Producto_id); // Obtener información del producto
          const precioCompra = parseFloat(producto.precio_compra) || 0;
          const precioVenta = parseFloat(detalle.precio_unitario) || 0;
          const cantidad = parseInt(detalle.cantidad) || 0;

          const gananciaProducto = (precioVenta - precioCompra) * cantidad;
          gananciaVenta += gananciaProducto;
        }

        // Sumar total y ganancias por cada venta
        totalVentas += parseFloat(venta.Total) || 0;
        totalGanancias += gananciaVenta;
      }

      ventasFiltradas.sort((a, b) => new Date(b.Fecha_venta) - new Date(a.Fecha_venta));

      // Actualizar los estados con las ventas filtradas, total y ganancias
      setVentas(ventasFiltradas);
      setFilteredVentas(ventasFiltradas);
      setTotalSalesAmount(totalVentas);
      setTotalProfits(totalGanancias); // Nuevo estado para ganancias
    } catch (error) {
      console.error('Error al cargar ventas:', error);
      showToast('Error al cargar las ventas', 'error');
    } finally {
      setIsLoading(false);
    }
  };



  const handleFilterChange = (filtro, rangoFechas = null) => {
    setFilterInterval(filtro);
    cargarVentas(filtro, rangoFechas);
  };
  useEffect(() => {
    cargarVentas();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      cargarVentas();
    }, [filterInterval])
  );

  const handleReimprimirBoleta = (ventaId) => {
    showToast(`Boleta de la venta ${ventaId} reimpresa`, 'success');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Reportes de Ventas</Text>

      <FilterTabs
        onFilterChange={handleFilterChange}
        filteredSalesCount={filteredVentas.length}  // Pasar el conteo de ventas filtradas

      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Cargando ventas...</Text>
        </View>
      ) : ventas.length === 0 ? (
        <EmptyState
          title="No hay ventas disponibles"
          description="No hay ventas registradas en este momento. Intenta cambiar el filtro o verifica más tarde."
          buttonText="Actualizar"
          onRefresh={() => cargarVentas(filterInterval)}
        />
      ) : (
        <ScrollView>
          <View style={styles.totalsContainer}>
            <View style={styles.totalAmountContainer}>
              <Text style={styles.totalAmountLabel}>TOTAL:</Text>
              <Text style={styles.totalAmountValue}>S/ {totalSalesAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.profitsContainer}>
              <Text style={styles.profitsLabel}>GANANCIAS:</Text>
              <Text style={styles.profitsValue}>S/ {totalProfits.toFixed(2)}</Text>
            </View>
          </View>

          {ventas.map((venta) => (
            <VentaCard
              key={venta.Venta_id}
              venta={venta}
              onReimprimir={handleReimprimirBoleta}
            />
          ))}
        </ScrollView>
      )}
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  filterButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 5,
  },
  activeFilterButton: {
    backgroundColor: '#6200EE',
  },
  filterButtonText: {
    color: '#333',
  },
  activeFilterButtonText: {
    color: '#FFF',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
    color: '#6200EE',
  },
  totalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  totalAmountContainer: {
    backgroundColor: '#480d87',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  totalAmountLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalAmountValue: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  profitsContainer: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  profitsLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  profitsValue: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default Reportes;
