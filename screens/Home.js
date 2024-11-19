import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BarChart } from 'react-native-chart-kit';
import { Feather } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import { useToast } from '../components/ToastContext';
import { obtenerVentas, obtenerDetallesVenta, obtenerProductoPorId } from '../database';

const screenWidth = Dimensions.get('window').width;

const Home = ({ navigation }) => {
  const [dateFilter, setDateFilter] = useState("Hoy");
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalSalesAmount, setTotalSalesAmount] = useState(0);
  const [historicalSalesAmount, setHistoricalSalesAmount] = useState(0); // Total histórico
  const [totalProductos, setTotalProductos] = useState(0);
  const [totalProfits, setTotalProfits] = useState(0);
  const [userName,setUserName]=useState("");
  const db = useSQLiteContext();
  const { showToast } = useToast();

  const chartConfig = {
    backgroundGradientFrom: "#f5f5f5",
    backgroundGradientTo: "#f5f5f5",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 0.5,
  };

  useEffect(() => {
    fetchUserName();
    fetchProductos();
    cargarVentasHistoricas();
    fetchClientes();
    cargarVentas(dateFilter); // Cargar ventas según el filtro inicial
  }, [dateFilter]);

  const fetchClientes = async () => {
    try {
      const result = await db.getAllAsync(`SELECT COUNT(*) as totalClientes FROM Cliente`);
      if (result && result.length > 0) {
        const totalClientes = result[0]?.totalClientes || 0;
        setTotalClientes(totalClientes);
      } else {
        setTotalClientes(0);
      }
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  const fetchUserName = async () => {
    try {
      const result = await db.getAllAsync(`SELECT nombre_completo FROM Usuario LIMIT 1`); // Ajusta esta consulta según tu lógica de autenticación
      if (result && result.length > 0) {
        const fullName = result[0]?.nombre_completo || "Usuario";
        // Obtener solo las dos primeras palabras del nombre
        const firstTwoWords = fullName.split(" ").slice(0, 2).join(" ");
        setUserName(firstTwoWords);

      } else {
        setUserName("Usuario");
      }
    } catch (error) {
      console.error("Error al obtener el nombre del usuario:", error);
    }
  };

  const fetchProductos = async () => {
    try {
      const result = await db.getAllAsync(`SELECT COUNT(*) as totalProductos FROM Productos`);
      if (result && result.length > 0) {
        const totalProductos = result[0]?.totalProductos || 0;
        setTotalProductos(totalProductos);
      } else {
        setTotalProductos(0);
      }
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };
  const calcularFechaInicio = (intervalo) => {
    const hoy = new Date();
    switch (intervalo) {
      case 'Hoy':
        return new Date(hoy.setHours(0, 0, 0, 0));
      case 'Este Mes':
        const inicioMes = new Date(hoy);
        inicioMes.setDate(hoy.getDate() - 30);
        return inicioMes;
      case 'Último Año':
        const inicioAno = new Date(hoy);
        inicioAno.setFullYear(hoy.getFullYear() - 1);
        return inicioAno;
      default:
        return new Date(hoy.setHours(0, 0, 0, 0));
    }
  };
  const cargarVentasHistoricas = async () => {
    try {
      const ventasObtenidas = await obtenerVentas();
      let totalHistorico = 0;

      for (let venta of ventasObtenidas) {
        totalHistorico += parseFloat(venta.Total) || 0;
      }

      setHistoricalSalesAmount(totalHistorico); // Guardar las ganancias totales históricas
    } catch (error) {
      console.error('Error al cargar las ventas históricas:', error);
      showToast('Error al cargar las ganancias históricas', 'error');
    }
  };
  const cargarVentas = async (filtro) => {
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

      for (let venta of ventasFiltradas) {
        const detallesVenta = await obtenerDetallesVenta(venta.Venta_id);
        let gananciaVenta = 0;

        for (let detalle of detallesVenta) {
          const producto = await obtenerProductoPorId(detalle.Producto_id);
          const precioCompra = parseFloat(producto.precio_compra) || 0;
          const precioVenta = parseFloat(detalle.precio_unitario) || 0;
          const cantidad = parseInt(detalle.cantidad) || 0;

          const gananciaProducto = (precioVenta - precioCompra) * cantidad;
          gananciaVenta += gananciaProducto;
        }

        totalVentas += parseFloat(venta.Total) || 0;
        totalGanancias += gananciaVenta;
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
        <Text style={styles.totalEarningsValue}>{`S/. ${historicalSalesAmount.toFixed(2)}`}</Text>
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
      <BarChart
        data={{
          labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
          datasets: [{ data: [200, 500, 300, 800, 1200, 600, 1000] }]
        }}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        style={styles.chartStyle}
        yAxisSuffix=" S/."
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
    backgroundColor: 'white',
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
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 30,
    marginBottom: 15,
  },
  chartStyle: {
    marginVertical: 20,
    borderRadius: 10,
  },
});

export default Home;
