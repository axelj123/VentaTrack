import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { obtenerVentas } from '../database';
import { useFocusEffect } from '@react-navigation/native';
import VentaCard from '../components/VentaCard';
import EmptyState from '../components/EmptyState';
import FilterTabs from '../components/FilterTabs';
import { obtenerDetallesVenta, obtenerProductoPorId } from '../database';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Feather } from '@expo/vector-icons';
const Reportes = ({ navigation }) => {
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

      ventasFiltradas.sort((a, b) => new Date(b.Fecha_venta) - new Date(a.Fecha_venta));

      setVentas(ventasFiltradas);
      setFilteredVentas(ventasFiltradas);
      setTotalSalesAmount(totalVentas);
      setTotalProfits(totalGanancias);
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
  const handleDownloadPDF = async () => {
    try {
      // Utilizar las ventas filtradas ya disponibles (filteredVentas)
      const salesData = await Promise.all(filteredVentas.map(async (sale) => {
        const saleDetails = await obtenerDetallesVenta(sale.Venta_id); // Detalles de la venta (productos)
  
        const saleWithProducts = await Promise.all(saleDetails.map(async (detalle) => {
          const producto = await obtenerProductoPorId(detalle.Producto_id); // Obtenemos el producto
  
          if (!producto) {
            console.error(`Producto con ID ${detalle.Producto_id} no encontrado.`);
            return null; // Omite el producto si no existe
          }
  
          const precioCompra = parseFloat(producto.precio_compra) || 0;
          const precioVenta = parseFloat(detalle.precio_unitario) || 0;
          const cantidad = parseInt(detalle.cantidad) || 0;
          const gananciaProducto = (precioVenta - precioCompra) * cantidad;
  
          return {
            producto: producto.nombre,
            cantidad: cantidad,
            precioUnitario: precioVenta,
            total: precioVenta * cantidad,
            ganancia: gananciaProducto
          };
        }));
  
        // Filtrar productos nulos
        const validProducts = saleWithProducts.filter(producto => producto !== null);
  
        const totalVenta = validProducts.reduce((total, product) => total + product.total, 0);
        const totalGanancia = validProducts.reduce((total, product) => total + product.ganancia, 0);
  
        return {
          id: sale.Venta_id,
          fecha: sale.Fecha_venta,
          productos: validProducts,
          totalVenta: totalVenta,
          totalGanancia: totalGanancia
        };
      }));
  
      const validSalesData = salesData.filter(sale => sale.productos.length > 0);
  
      validSalesData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  
      const totalSales = validSalesData.reduce((total, sale) => total + sale.totalVenta, 0);
      const totalProfit = validSalesData.reduce((total, sale) => total + sale.totalGanancia, 0);
      const totalSalesCount = validSalesData.length;
  
      const htmlContent = `
         <html>
          <head>
            <meta charset="UTF-8">
            <title>Reporte de Ventas</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
              }
  
              .container {
                max-width: 800px;
                margin: 0 auto;
                padding: 30px;
              }
  
              .header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 30px;
              }
  
              .header img {
                height: 50px;
              }
  
              h1 {
                text-align: center;
                margin-bottom: 20px;
              }
  
              .summary {
                display: flex;
                justify-content: space-between;
                margin-bottom: 30px;
                font-weight: bold;
              }
  
              .summary p {
                margin: 0;
              }
  
              table {
                width: 100%;
                border: 1px solid #000;
                margin-top: 20px;
              }
  
              th, td {
                padding: 12px;
                text-align: left;
                border: 1px solid #000;
              }
  
              th {
                background-color: #f2f2f2;
                font-weight: bold;
              }
  
              td {
                font-weight: normal;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Reporte de Ventas</h1>
              </div>
              <div class="summary">
                <p>Período: ${filterInterval}</p>
                <p>Total Ventas: S/ ${totalSales.toFixed(2)}</p>
                <p>Total Ganancias: S/ ${totalProfit.toFixed(2)}</p>
                <p>Total de Ventas: ${totalSalesCount}</p>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>ID Venta</th>
                    <th>Fecha</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Total</th>
                    <th>Ganancia</th>
                  </tr>
                </thead>
                <tbody>
                  ${validSalesData.map(sale => `
                    ${sale.productos.map(product => `
                      <tr>
                        <td>${sale.id}</td>
                        <td>${new Date(sale.fecha).toLocaleString()}</td>
                        <td>${product.producto}</td>
                        <td>${product.cantidad}</td>
                        <td>S/ ${product.precioUnitario.toFixed(2)}</td>
                        <td>S/ ${product.total.toFixed(2)}</td>
                        <td>S/ ${product.ganancia.toFixed(2)}</td>
                      </tr>
                    `).join('')}
                  `).join('')}
                </tbody>
              </table>
            </div>
          </body>
        </html>
      `;
  
      // Generate and share the PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false
      });
      await Sharing.shareAsync(uri);
  
      showToast('Reporte PDF generado y compartido exitosamente!', 'success');
    } catch (error) {
      console.error('Error al generar o compartir el PDF:', error);
      showToast('Hubo un error al generar o compartir el reporte PDF', 'error');
    }
  };
  
  const handleVerBoleta = (venta) => {
    navigation.navigate('TicketView', {
      total: venta.Total,
      descuento: venta.descuento,
      items: venta.detalles.map(detalle => ({
        Producto_id: detalle.Producto_id,
        cantidad: detalle.cantidad,
        precio_venta: detalle.precio_unitario
      })),
      clienteId: venta.Cliente_id,
      ventaId: venta.Venta_id,
      timestamp: venta.Fecha_venta
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Reportes de Ventas</Text>

      <FilterTabs
        onFilterChange={handleFilterChange}
        filteredSalesCount={filteredVentas.length}

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
          <View style={styles.containerDownload}>
          <TouchableOpacity style={styles.btnDownload} onPress={handleDownloadPDF}>
            <Feather name="download" size={20} color="#fff" style={styles.icon} />
            </TouchableOpacity>

          </View>
         

          {ventas.map((venta) => (
            <VentaCard
              key={venta.Venta_id}
              venta={venta}
              onReimprimir={handleVerBoleta}
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
  containerDownload:{
    flex:1,
    alignItems:'center'
  },
btnDownload: {
  backgroundColor:'#3c19db',
  width:'20%',
  padding: 5, 
  borderRadius: 8,
  marginBottom: 12,
  alignItems: 'center', 
  justifyContent: 'center', 
},
textDownload: {
  color: '#000', 
  fontSize: 14,
  fontWeight: 'bold' 
  
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
