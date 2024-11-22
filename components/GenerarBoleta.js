import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import { Platform } from 'react-native';

export const generarBoleta = async (venta, detallesVenta) => {
    try {
        const total = parseFloat(venta.Total) || 0;
        const descuento = parseFloat(venta.descuento) || 0;
        const subtotal = total + descuento;

        const detallesValidados = (detallesVenta || []).map(detalle => ({
            cantidad: parseInt(detalle.cantidad) || 0,
            descripcion: detalle.descripcion || 'N/A',
            precio_unitario: parseFloat(detalle.precio_unitario) || 0
        }));
        const htmlContent = `
          <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      <style>
        @page {
          margin: 20px;
        }
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          font-size: 14px;
          width: 100%;
        }
        .boleta {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .empresa {
          font-size: 24px;
          font-weight: bold;
        }
        .recibo {
          font-size: 16px;
          color: #333;
        }
        .cliente {
          margin: 10px 0;
        }
        .producto-item {
          margin: 5px 0;
          display: flex;
          justify-content: space-between;
        }
        .cantidad {
          width: 30px;
          display: inline-block;
        }
        .totales {
          margin-top: 15px;
          text-align: right;
        }
        .total-row {
          margin: 5px 0;
        }
        .fecha {
          margin-top: 20px;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
        hr {
          border: none;
          border-top: 1px solid #ddd;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="boleta">
        <div class="header">
          <div class="empresa">Tiendas S.A.C</div>
          <div class="recibo">RECIBO #1</div>
        </div>
        <div style="font-size: 14px; color: #666; margin-bottom: 10px;">Mz. D LOTE 1 • +51 (910) 241-651</div>
        
        <hr>
        
        <div class="cliente">
          Cliente: ${venta.Cliente_id || 'John Doe'}<br>
          ID Cliente: ${venta.Cliente_id || '2'}
        </div>
        
        <div class="productos">
          <div style="margin-bottom: 10px;">Productos (${detallesValidados.length})</div>
          ${detallesValidados
            .map(
              (detalle) => `
                <div class="producto-item">
                  <span><span class="cantidad">${detalle.cantidad}x</span> ${detalle.descripcion}</span>
                  <span>$${(detalle.cantidad * detalle.precio_unitario).toFixed(2)}</span>
                </div>
              `
            )
            .join('')}
        </div>
        
        <hr>
        
        <div class="totales">
          <div class="total-row">
            Subtotal: $${subtotal.toFixed(2)}
          </div>
          <div class="total-row">
            Descuento: -$${descuento.toFixed(2)}
          </div>
          <div class="total-row" style="font-weight: bold;">
            Total: $${total.toFixed(2)}
          </div>
        </div>
        
        <div class="fecha">
          ${new Date().toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </body>
    </html>
        `;

        // Generar el PDF
        // Generar el PDF
        const { uri } = await Print.printToFileAsync({
            html: htmlContent,
            base64: false
        });
        // Crear un nombre de archivo único con timestamp
        const timestamp = new Date().getTime();
        const fileName = `recibo-${timestamp}.pdf`;
        const newPath = `${FileSystem.documentDirectory}${fileName}`;

        // Mover el archivo al directorio de documentos
        await FileSystem.moveAsync({
            from: uri,
            to: newPath
        });

        // Manejar la apertura del PDF según la plataforma
        if (Platform.OS === 'ios') {
            // En iOS, usar Sharing
            await Sharing.shareAsync(newPath);
        } else {
            // En Android, usar IntentLauncher
            const contentUri = await FileSystem.getContentUriAsync(newPath);
            await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                data: contentUri,
                flags: 1,
                type: 'application/pdf'
            });
        }

        return newPath; // Retornar la ruta del archivo para uso posterior

    } catch (error) {
        console.error('Error al generar la boleta:', error);
        throw new Error(`Error al generar PDF: ${error.message}`);
    }
};