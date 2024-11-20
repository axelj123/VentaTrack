import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BarChart } from 'react-native-chart-kit';
import { Feather } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import { useToast } from '../components/ToastContext';
import { obtenerVentas, obtenerDetallesVenta, obtenerProductoPorId } from '../database';
import { useFocusEffect } from '@react-navigation/native';
import ModernBarChart from '../components/ModernBarchart';

const screenWidth = Dimensions.get('window').width;

const formatearFecha = (fecha) => {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit',
    month: 'short'
  });
};

const procesarGananciasPorMes = async (ventas, selectedMonth) => {
  try {
    if (!Array.isArray(ventas)) {
      console.error('Las ventas deben ser un array');
      return {
        labels: [],
        datasets: [{ data: [] }]
      };
    }

    // Filtrar ventas del mes seleccionado
    const ventasDelMes = ventas.filter(venta => {
      const fechaVenta = new Date(venta.Fecha_venta);
      return fechaVenta.getMonth() + 1 === selectedMonth;
    });

    // Obtener el año actual
    const año = new Date().getFullYear();

    // Crear estructura para acumular ganancias por día
    const gananciasPorDia = {};
    const ultimoDiaMes = new Date(año, selectedMonth, 0).getDate();
    for (let dia = 1; dia <= ultimoDiaMes; dia++) {
      const fecha = new Date(año, selectedMonth - 1, dia);
      gananciasPorDia[formatearFecha(fecha)] = 0;
    }

    // Calcular las ganancias para cada día
    for (const venta of ventasDelMes) {
      const detallesVenta = await obtenerDetallesVenta(venta.Venta_id);

      let gananciasVenta = 0;
      for (const detalle of detallesVenta) {
        const producto = await obtenerProductoPorId(detalle.Producto_id);
        const precioCompra = parseFloat(producto.precio_compra) || 0;
        const precioVenta = parseFloat(detalle.precio_unitario) || 0;
        const cantidad = parseInt(detalle.cantidad) || 0;

        // Calcular ganancia para cada producto
        gananciasVenta += (precioVenta - precioCompra) * cantidad;
      }

      // Sumar ganancias al día correspondiente
      const fechaFormateada = formatearFecha(venta.Fecha_venta);
      gananciasPorDia[fechaFormateada] = (gananciasPorDia[fechaFormateada] || 0) + gananciasVenta;
    }

    return {
      labels: Object.keys(gananciasPorDia),
      datasets: [{
        data: Object.values(gananciasPorDia).map(valor => Number(valor.toFixed(2)))
      }]
    };
  } catch (error) {
    console.error('Error al procesar ganancias por mes:', error);
    return {
      labels: [],
      datasets: [{ data: [] }]
    };
  }
};


const procesarGananciasPorDia = async (ventas) => {
  try {
    if (!Array.isArray(ventas)) {
      return {
        labels: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }]
      };
    }

    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const gananciasPorDia = new Array(7).fill(0);

    for (const venta of ventas) {
      const fechaVenta = new Date(venta.Fecha_venta);
      const dia = fechaVenta.getDay();

      const detallesVenta = await obtenerDetallesVenta(venta.Venta_id);
      for (const detalle of detallesVenta) {
        const producto = await obtenerProductoPorId(detalle.Producto_id);
        const precioCompra = parseFloat(producto.precio_compra) || 0;
        const precioVenta = parseFloat(detalle.precio_unitario) || 0;
        const cantidad = parseInt(detalle.cantidad) || 0;

        // Calcular ganancia para cada producto y sumarla al día correspondiente
        gananciasPorDia[dia] += (precioVenta - precioCompra) * cantidad;
      }
    }

    return {
      labels: diasSemana,
      datasets: [{
        data: gananciasPorDia.map(valor => Number(valor.toFixed(2)))
      }]
    };
  } catch (error) {
    console.error('Error al procesar ganancias por día:', error);
    return {
      labels: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }]
    };
  }
};


const Home = ({ navigation }) => {
  const [dateFilter, setDateFilter] = useState("Hoy");
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalSalesAmount, setTotalSalesAmount] = useState(0);
  const [historicalSalesAmount, setHistoricalSalesAmount] = useState(0);
  const [totalProductos, setTotalProductos] = useState(0);
  const [totalProfits, setTotalProfits] = useState(0);
  const [userName, setUserName] = useState("");
  const [chartFilter, setChartFilter] = useState('Semanal');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);


  const [datosGrafica, setDatosGrafica] = useState({
    labels: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }]
  });

  const db = useSQLiteContext();
  const { showToast } = useToast();

  useEffect(() => {
    fetchUserName();
    fetchClientes();
    cargarVentasHistoricas();
    fetchProductos();
    cargarVentas(dateFilter);
  }, [dateFilter]);

  useEffect(() => {
    obtenerDatosGrafica();
  }, [chartFilter, selectedMonth]);

  useFocusEffect(
    React.useCallback(() => {
      cargarVentas(dateFilter);
      fetchClientes();
      fetchProductos();
      obtenerDatosGrafica
    }, [dateFilter])
  );

  const obtenerDatosGrafica = async () => {
    try {
      const ventasObtenidas = await obtenerVentas();
  
      if (chartFilter === 'Semanal') {
        const datosSemanales = await procesarGananciasPorDia(ventasObtenidas);
        setDatosGrafica(datosSemanales);
      } else {
        const datosMensuales = await procesarGananciasPorMes(ventasObtenidas, selectedMonth);
        setDatosGrafica(datosMensuales);
      }
    } catch (error) {
      console.error('Error al obtener datos para la gráfica:', error);
      showToast('Error al cargar datos de la gráfica', 'error');
    }
  };
  

  const fetchClientes = async () => {
    try {
      const result = await db.getAllAsync(`SELECT COUNT(*) as totalClientes FROM Cliente`);
      setTotalClientes(result?.[0]?.totalClientes || 0);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      showToast('Error al obtener clientes', 'error');
    }
  };

  const fetchUserName = async () => {
    try {
      const result = await db.getAllAsync(`SELECT nombre_completo FROM Usuario LIMIT 1`);
      const fullName = result?.[0]?.nombre_completo || "Usuario";
      const firstTwoWords = fullName.split(" ").slice(0, 2).join(" ");
      setUserName(firstTwoWords);
    } catch (error) {
      console.error("Error al obtener el nombre del usuario:", error);
      setUserName("Usuario");
    }
  };

  const fetchProductos = async () => {
    try {
      const result = await db.getAllAsync(`SELECT COUNT(*) as totalProductos FROM Productos`);
      setTotalProductos(result?.[0]?.totalProductos || 0);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      showToast('Error al obtener productos', 'error');
    }
  };

  const calcularFechaInicio = (intervalo) => {
    const hoy = new Date();
    switch (intervalo) {
      case 'Hoy':
        return new Date(hoy.setHours(0, 0, 0, 0));
      case 'Este Mes':
        return new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      case 'Último Año':
        return new Date(hoy.getFullYear() - 1, hoy.getMonth(), hoy.getDate());
      default:
        return new Date(hoy.setHours(0, 0, 0, 0));
    }
  };

  const cargarVentasHistoricas = async () => {
    try {
      const ventasObtenidas = await obtenerVentas();
      const totalHistorico = ventasObtenidas.reduce((total, venta) => 
        total + (parseFloat(venta.Total) || 0), 0);
      setHistoricalSalesAmount(totalHistorico);
    } catch (error) {
      console.error('Error al cargar las ventas históricas:', error);
      showToast('Error al cargar las ganancias históricas', 'error');
    }
  };

  const cargarVentas = async (filtro = dateFilter) => {
    try {
      const ventasObtenidas = await obtenerVentas();
      const fechaInicio = calcularFechaInicio(filtro);
      const fechaFin = new Date();

      const ventasFiltradas = ventasObtenidas.filter(venta => {
        const fechaVenta = new Date(venta.Fecha_venta);
        return fechaVenta >= fechaInicio && fechaVenta <= fechaFin;
      });

      let totalVentas = 0;
      let totalGanancias = 0;

      for (const venta of ventasFiltradas) {
        const detallesVenta = await obtenerDetallesVenta(venta.Venta_id);
        
        for (const detalle of detallesVenta) {
          const producto = await obtenerProductoPorId(detalle.Producto_id);
          const precioCompra = parseFloat(producto.precio_compra) || 0;
          const precioVenta = parseFloat(detalle.precio_unitario) || 0;
          const cantidad = parseInt(detalle.cantidad) || 0;

          totalGanancias += (precioVenta - precioCompra) * cantidad;
        }

        totalVentas += parseFloat(venta.Total) || 0;
      }

      setTotalSalesAmount(totalVentas);
      setTotalProfits(totalGanancias);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
      showToast('Error al cargar las ventas', 'error');
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      {/* Encabezado de bienvenida con icono de notificación */}
      <View style={styles.headerSection}>
        <Text style={styles.greetingText}>¡Hola, {userName}!</Text>
        <TouchableOpacity style={styles.notificationIcon} onPress={() => navigation.navigate('Notificaciones')}>
          <Feather name="bell" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Sección de Ganancias Totales */}
      <View style={styles.totalEarningsSection}>
        <Text style={styles.totalEarningsLabel}>Ganancias Totales</Text>
        <Text style={styles.totalEarningsValue}>{`S/. ${totalProfits}`}</Text>
      </View>

      {/* Filtro de fecha */}
      <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>Resumen de Ganancias</Text>
        <Picker
          selectedValue={dateFilter}
          style={styles.pickerStyle}
          onValueChange={(itemValue) => setDateFilter(itemValue)}
        >
          <Picker.Item label="Hoy" value="Hoy" />
          <Picker.Item label="Este Mes" value="Este Mes" />
          <Picker.Item label="Último Año" value="Último Año" />
        </Picker>
      </View>

      {/* Sección de métricas */}
      <View style={styles.metricsSection}>
        <MetricCard title={`Ganancias ${dateFilter}`} value={`S/. ${totalProfits.toFixed(2)}`} color="#5300a9" icon="trending-up" />
        <MetricCard title="Total Productos" value={totalProductos.toString()} color="#4e059a" icon="box" />
        <MetricCard title="Total Clientes" value={totalClientes.toString()} color="#3c1664" icon="users" />
        <MetricCard title="Producto Más Vendido" value="0" color="#7228be" icon="star" />
      </View>

      {/* Botones de navegación */}
      <Text style={styles.navigationTitle}>Navega a Secciones</Text>
      <View style={styles.navigationSection}>
        <NavButton title="Productos" icon="box" color="#3c0475" onPress={() => navigation.navigate('Inventario')} />
        <NavButton title="Clientes" icon="users" color="#ee9606" onPress={() => navigation.navigate('Clientes')}
        />
        <NavButton title="Ventas" icon="dollar-sign" color="#1ABC9C" onPress={() => navigation.navigate('Reportes')} />
      </View>

      {/* Gráfico de barras de ganancias por día */}
        <Text style={styles.chartTitle}>Estadísticas de Ganancias</Text>
        <ModernBarChart 
        ventas={datosGrafica}
        chartFilter={chartFilter}
        selectedMonth={selectedMonth}
        onFilterChange={setChartFilter}
        onMonthChange={setSelectedMonth}
      />
    </ScrollView>
  );
};

// Componente para mostrar las métricas
const MetricCard = ({ title, value, color, icon }) => (
  <View style={[styles.metricCardStyle, { backgroundColor: color }]}>
    <Feather name={icon} size={24} color="#fff" />
    <Text style={styles.metricCardTitle}>{title}</Text>
    <Text style={styles.metricCardValue}>{value}</Text>
  </View>
);

// Componente para los botones de navegación
const NavButton = ({ title, icon, color, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[styles.navButtonStyle, { backgroundColor: color }]}>
    <Feather name={icon} size={24} color="#fff" />
    <Text style={styles.navButtonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  greetingText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationIcon: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
  },
  dateText: {
    fontSize: 14,
    color: '#888',
  },
  totalEarningsSection: {
    paddingVertical: 30,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#6200EE', // Color oscuro para destacar
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  totalEarningsLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
  },
  totalEarningsValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pickerStyle: {
    height: 40,
    width: 150,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  metricsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCardStyle: {
    width: '45%',
    aspectRatio: 1.4,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  metricCardTitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
    textAlign: 'center',
  },
  metricCardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  navigationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 30,
    marginBottom: 15,
  },
  navigationSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  navButtonStyle: {
    width: '30%',
    height: 70,
    borderRadius: 15,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  chartContainer: {
    marginTop: 24,
    paddingHorizontal: 4,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,

  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default Home;
