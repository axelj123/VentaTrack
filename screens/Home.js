import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BarChart } from 'react-native-chart-kit';
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const Home = ({ navigation }) => {
  const [dateFilter, setDateFilter] = useState("Hoy");

  const chartConfig = {
    backgroundGradientFrom: "#f5f5f5",
    backgroundGradientTo: "#f5f5f5",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 0.5,
  };

  return (
    <ScrollView style={styles.container}>
      {/* Encabezado de bienvenida con icono de notificación */}
      <View style={styles.headerSection}>
        <Text style={styles.greetingText}>¡Hola, Usuario!</Text>
        <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
        <TouchableOpacity style={styles.notificationIcon}  onPress={() => navigation.navigate('Notificaciones')}>
          <Feather name="bell" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Sección de Ganancias Totales */}
      <View style={styles.totalEarningsSection}>
        <Text style={styles.totalEarningsLabel}>Ganancias Totales</Text>
        <Text style={styles.totalEarningsValue}>S/. 8600.00</Text>
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
        <MetricCard title={`Ganancias ${dateFilter}`} value="S/. 0.00" color="#5300a9" icon="trending-up" />
        <MetricCard title="Total Productos" value="0" color="#4e059a" icon="box" />
        <MetricCard title="Total Clientes" value="0" color="#3c1664" icon="users" />
        <MetricCard title="Producto Más Vendido" value="Producto A" color="#7228be" icon="star" />
      </View>

      {/* Botones de navegación */}
      <Text style={styles.navigationTitle}>Navega a Secciones</Text>
      <View style={styles.navigationSection}>
        <NavButton title="Productos" icon="box" color="#3c0475" />
        <NavButton title="Clientes" icon="users" color="#ee9606" />
        <NavButton title="Ventas" icon="dollar-sign" color="#1ABC9C" />
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
const NavButton = ({ title, icon, color }) => (
  <TouchableOpacity style={[styles.navButtonStyle, { backgroundColor: color }]}>
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
