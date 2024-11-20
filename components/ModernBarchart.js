import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const ModernBarChart = ({ 
  ventas, 
  chartFilter, 
  selectedMonth, 
  onFilterChange, 
  onMonthChange,
  isLoading = false 
}) => {
  const [metrics, setMetrics] = useState({
    total: 0,
    promedio: 0,
    tendencia: 0,
    mejorDia: { valor: 0, fecha: '' }
  });

  // Memoizar la configuración del gráfico
  const chartConfig = useMemo(() => ({
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(60, 4, 117, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 },
    propsForBackgroundLines: {
      strokeDasharray: '',
      strokeWidth: 1,
      stroke: '#f0f0f0',
    },
    propsForLabels: {
      fontSize: 11,
      fontWeight: '500',
    },
    xAxisLabel: () => '',
    xLabelsOffset: 12,
    formatXLabel: (label) => label.length > 5 ? label.substring(0, 5) + '...' : label,
  }), []);

  // Memoizar el procesamiento de datos del gráfico
  const chartData = useMemo(() => {
    if (!ventas?.datasets?.[0]?.data?.length) return null;

    const processedLabels = ventas.labels.map((label, index) => {
      if (chartFilter === 'Mensual') {
        const day = parseInt(label.match(/\d+/)?.[0] || '0');
        return (day % 5 === 0 || day === 1 || day === parseInt(ventas.labels.length)) ? day.toString() : '';
      }
      return label;
    });

    return {
      labels: processedLabels,
      datasets: [{
        data: ventas.datasets[0].data.map(value => Number(value) || 0)
      }]
    };
  }, [ventas, chartFilter]);

  // Memoizar el cálculo de métricas
  const calculateMetrics = useCallback(() => {
    if (!ventas?.datasets?.[0]?.data?.length) return;

    const data = ventas.datasets[0].data.map(value => Number(value) || 0);
    const total = data.reduce((sum, val) => sum + val, 0);
    const promedio = total / data.length;
    const maxValue = Math.max(...data);
    const maxIndex = data.indexOf(maxValue);
    
    const lastValue = data[data.length - 1];
    const previousValue = data[data.length - 2] || lastValue;
    const tendencia = ((lastValue - previousValue) / previousValue) * 100;

    setMetrics({
      total: Number(total.toFixed(2)),
      promedio: Number(promedio.toFixed(2)),
      tendencia: Number(tendencia.toFixed(2)),
      mejorDia: {
        valor: maxValue,
        fecha: ventas.labels[maxIndex]
      }
    });
  }, [ventas]);

  // Actualizar métricas solo cuando cambian los datos relevantes
  useEffect(() => {
    calculateMetrics();
  }, [calculateMetrics]);

  // Componente de métrica memoizado
  const MetricCard = React.memo(({ title, value, subtitle, icon, color = "#3c0475" }) => (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <Feather name={icon} size={20} color={color} />
        <Text style={styles.metricTitle}>{title}</Text>
      </View>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
    </View>
  ));

  // Componentes renderizados condicionalmente
  const renderNoDataState = useCallback(() => (
    <View style={styles.noDataContainer}>
      <Feather name="bar-chart-2" size={48} color="#cccccc" />
      <Text style={styles.noDataTitle}>Sin datos disponibles</Text>
      <Text style={styles.noDataSubtitle}>
        No hay información para mostrar en el período seleccionado
      </Text>
    </View>
  ), []);

  const renderMetrics = useCallback(() => (
    <View style={styles.metricsContainer}>
      <View style={styles.metricRow}>
        <MetricCard
          title="Total del Período"
          value={`S/. ${metrics.total}`}
          icon="dollar-sign"
        />
        <MetricCard
          title="Promedio"
          value={`S/. ${metrics.promedio}`}
          icon="trending-up"
        />
      </View>
      <View style={styles.metricRow}>
        <MetricCard
          title="Tendencia"
          value={`${metrics.tendencia > 0 ? '+' : ''}${metrics.tendencia}%`}
          icon={metrics.tendencia >= 0 ? "trending-up" : "trending-down"}
          color={metrics.tendencia >= 0 ? "#10b981" : "#ef4444"}
        />
        <MetricCard
          title="Mejor Día"
          value={`S/. ${metrics.mejorDia.valor}`}
          subtitle={metrics.mejorDia.fecha}
          icon="award"
        />
      </View>
    </View>
  ), [metrics]);

  const renderChart = useCallback(() => {
    if (!chartData) return renderNoDataState();

    const ChartComponent = chartFilter === 'Mensual' ? LineChart : BarChart;
    
    return (
      <View style={styles.chartWrapper}>
        <ChartComponent
          data={chartData}
          width={screenWidth - 48}
          height={220}
          yAxisLabel="S/. "
          chartConfig={chartConfig}
          style={styles.chart}
          withInnerLines={true}
          withHorizontalLabels={true}
          withVerticalLabels={true}
          segments={5}
          bezier={chartFilter === 'Mensual'}
          showValuesOnTopOfBars={chartFilter === 'Semanal'}
        />
      </View>
    );
  }, [chartData, chartFilter, chartConfig]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3c0475" />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollViewContent}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {chartFilter === 'Semanal' ? 'Ventas Semanales' : 'Ventas Mensuales'}
          </Text>
          <View style={styles.filterContainer}>
            <TouchableOpacity 
              style={[styles.filterButton, chartFilter === 'Semanal' && styles.filterButtonActive]}
              onPress={() => onFilterChange('Semanal')}
            >
              <Text style={[styles.filterButtonText, chartFilter === 'Semanal' && styles.filterButtonTextActive]}>
                Semanal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, chartFilter === 'Mensual' && styles.filterButtonActive]}
              onPress={() => onFilterChange('Mensual')}
            >
              <Text style={[styles.filterButtonText, chartFilter === 'Mensual' && styles.filterButtonTextActive]}>
                Mensual
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {chartFilter === 'Mensual' && (
          <View style={styles.monthPickerContainer}>
            <Picker
              selectedValue={selectedMonth}
              style={styles.monthPicker}
              onValueChange={onMonthChange}
            >
              {[
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
              ].map((mes, index) => (
                <Picker.Item key={index} label={mes} value={index + 1} />
              ))}
            </Picker>
          </View>
        )}

        {renderMetrics()}
        
        <ScrollView 
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chartScrollViewContent}
        >
          {renderChart()}
        </ScrollView>
      </View>
    </ScrollView>
  );
};
const MetricCard = ({ title, value, subtitle, icon, color = "#3c0475" }) => (
  <View style={styles.metricCard}>
    <View style={styles.metricHeader}>
      <Feather name={icon} size={20} color={color} />
      <Text style={styles.metricTitle}>{title}</Text>
    </View>
    <Text style={[styles.metricValue, { color }]}>{value}</Text>
    {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 2,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  filterButtonActive: {
    backgroundColor: '#ffffff',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: '#3c0475',
    fontWeight: '500',
  },
  monthPickerContainer: {
    marginBottom: 16,
  },
  monthPicker: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    height: 45,
  },
  metricsContainer: {
    marginBottom: 20,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  metricSubtitle: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 4,
  },
  chartWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
  },
  chart: {
    borderRadius: 12,
    marginVertical: 8,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  noDataTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 12,
  },
  noDataSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
  },
  loadingContainer: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
});

export default React.memo(ModernBarChart);
