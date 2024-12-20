//database.js
import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'VentasDB.db';



const getDatabasePath = () => {
  if (!FileSystem || !FileSystem.documentDirectory) {
    throw new Error('FileSystem no está disponible');
  }
  return `${FileSystem.documentDirectory}SQLite/${DATABASE_NAME}`;
};

export const getDBConnection = async () => {
  try {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    return db;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw error;
  }
};


export const deleteDatabase = async () => {
  try {
    const dbPath = getDatabasePath();
    const { exists } = await FileSystem.getInfoAsync(dbPath);

    if (exists) {
      await FileSystem.deleteAsync(dbPath, { idempotent: true });
      console.log('Base de datos eliminada con éxito');
      return true;
    } else {
      console.log('La base de datos no existe');
      return false;
    }
  } catch (error) {
    console.error('Error al eliminar la base de datos:', error);
    throw error;
  }
};



export const createTables = async (db) => {
  const tables = [
    // Tabla Usuario
    `CREATE TABLE IF NOT EXISTS Usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_completo TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      contraseña TEXT NOT NULL
    )`,

    // Tabla Empresa
    `CREATE TABLE IF NOT EXISTS Empresa (
      Empresa_id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      direccion TEXT,
      telefono INTEGER,
      correo_contacto TEXT,
      ruc INTEGER UNIQUE
    )`,

    // Tabla Categoria_Producto
    `CREATE TABLE IF NOT EXISTS Categoria_Producto (
      categoria_id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL
    )`,

    // Tabla Productos
    `CREATE TABLE IF NOT EXISTS Productos (
      Producto_id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
       precio_compra DECIMAL(10,2) NOT NULL,
       precio_venta DECIMAL(10,2) NOT NULL,
      cantidad INTEGER DEFAULT 0,
      imagen TEXT,
      fecha_ingreso DATE,
      fecha_vencimiento DATE,
      categoria_id INTEGER,
      FOREIGN KEY (categoria_id) REFERENCES Categoria_Producto(categoria_id)
    )`,

    // Tabla Tipo_Venta
    `CREATE TABLE IF NOT EXISTS Tipo_Venta (
      tipoVenta_id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL
    )`,

    // Tabla Courier
    `CREATE TABLE IF NOT EXISTS Courier (
      Courier_id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL
    )`,
    // Tabla Cliente
    `CREATE TABLE IF NOT EXISTS Cliente (
    Cliente_id INTEGER PRIMARY KEY AUTOINCREMENT,
    dni INTEGER NOT NULL UNIQUE,
    pais TEXT,
    nombre_completo TEXT NOT NULL,
    email TEXT UNIQUE,
    telefono INTEGER,
    direccion TEXT
    )`,

    // Tabla Venta
    `CREATE TABLE IF NOT EXISTS Venta (
      Venta_id INTEGER PRIMARY KEY AUTOINCREMENT,
      Cliente_id INTEGER,
      Fecha_venta TEXT NOT NULL,
      Total DECIMAL(10,2) NOT NULL,
      tipoVenta_id INTEGER,
      Courier_id INTEGER,
      descuento DECIMAL(10,2) DEFAULT 0.00,
      FOREIGN KEY (tipoVenta_id) REFERENCES Tipo_Venta(tipoVenta_id),
      FOREIGN KEY (Courier_id) REFERENCES Courier(Courier_id),
      FOREIGN KEY (Cliente_id) REFERENCES Cliente(Cliente_id)
    )`,

    // Tabla detalle_venta
    `CREATE TABLE IF NOT EXISTS detalle_venta (
      Detalle_id INTEGER PRIMARY KEY AUTOINCREMENT,
      Venta_id INTEGER NOT NULL,
      Producto_id INTEGER NOT NULL,
      cantidad INTEGER NOT NULL,
      precio_unitario DECIMAL(10,2) NOT NULL,
      subtotal DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (Venta_id) REFERENCES Venta(Venta_id),
      FOREIGN KEY (Producto_id) REFERENCES Productos(Producto_id)
    )`,

    `CREATE TABLE IF NOT EXISTS Notificaciones (
    Notificacion_id INTEGER PRIMARY KEY AUTOINCREMENT,
    Usuario_id INTEGER NOT NULL, 
    titulo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_hora TEXT NOT NULL, 
    leida INTEGER DEFAULT 0, 
    FOREIGN KEY (Usuario_id) REFERENCES Usuario(id)
);`,

  ];
  try {
    for (const table of tables) {
      await db.execAsync(table);
      console.log(`Tabla creada: ${table.split(' ')[2]}`);
    }


    await insertarDatosIniciales(db);

  } catch (error) {
    console.error("Error al crear tablas o insertar datos:", error);
    throw error;
  }
};
const insertarDatosIniciales = async (db) => {
  try {

    const tiposVenta = await db.getAllAsync('SELECT * FROM Tipo_Venta');
    if (tiposVenta.length === 0) {
      await db.runAsync(`INSERT INTO Tipo_Venta (nombre) VALUES ('Nacional'), ('Internacional')`);
      console.log("Datos insertados en Tipo_Venta");
    }


    const categoriasProducto = await db.getAllAsync('SELECT * FROM Categoria_Producto');
    if (categoriasProducto.length === 0) {
      await db.runAsync(`INSERT INTO Categoria_Producto (nombre) VALUES ('Te'), ('Cafes'), ('Energizantes'), ('Proteinas'), ('Aseo Personal')`);
      console.log("Datos insertados en Categoria_Producto");
    }


    const couriers = await db.getAllAsync('SELECT * FROM Courier');
    if (couriers.length === 0) {
      await db.runAsync(`INSERT INTO Courier (nombre) VALUES ('Olva Courier'), ('In Drive'), ('Shalom'), ('Vifasa'), ('Frapessa'), ('Otros')`);
      console.log("Datos insertados en Courier");
    }


    const clientes = await db.getAllAsync('SELECT * FROM Cliente');
    if (clientes.length === 0) {
      await db.runAsync(`INSERT INTO Cliente (dni, pais, nombre_completo, email, telefono, direccion)
        VALUES
       (123456789, 'Chile', 'Maria García', 'maria.garcia@example.com', 999999999, 'Calle Primavera 25, Santiago, Chile'),
      (987654321, 'México', 'John Doe', 'john.doe@example.com', 123123123, '123 Elm Street, Ciudad de México, México'),
      (112233445, 'Argentina', 'Marta López', 'marta.lopez@example.com', 555555555, 'Av. de Mayo 1000, Buenos Aires, Argentina'),
      (998877666, 'Colombia', 'David Smith', 'david.smith@example.com', 222222222, '456 Maple Ave, Bogotá, Colombia'),
      (556677890, 'Perú', 'Isabella Rossi', 'isabella.rossi@example.com', 777777777, 'Via Roma 10, Lima, Perú'),
      (667788991, 'Brasil', 'Carlos Silva', 'carlos.silva@example.com', 333333333, 'Rua das Flores 123, São Paulo, Brasil'),
      (998877667, 'Venezuela', 'José Pérez', 'jose.perez@example.com', 444444444, 'Avenida Bolívar 400, Caracas, Venezuela'),
      (223344557, 'Ecuador', 'Ana Martínez', 'ana.martinez@example.com', 555666777, 'Calle Sucre 45, Quito, Ecuador'),
      (123443212, 'Uruguay', 'Luis Gómez', 'luis.gomez@example.com', 111222333, 'Calle 18 de Julio 500, Montevideo, Uruguay'),
      (334455668, 'Paraguay', 'Raúl Fernández', 'raul.fernandez@example.com', 888999000, 'Avenida España 15, Asunción, Paraguay');
    `);
      console.log("Datos insertados en Cliente");
    }
  } catch (error) {
    console.error("Error al insertar datos iniciales:", error);
  }
};


export const handleSaveCliente = async (db, formData, Cliente_id) => {
  try {
    console.log("Guardando cliente con los siguientes datos:", {
      formData,
      Cliente_id
    });

    const result = await db.runAsync(
      `UPDATE Cliente SET 
        dni = ?, 
        pais = ?, 
        nombre_completo = ?, 
        email = ?, 
        telefono = ?, 
        direccion = ? 
      WHERE Cliente_id = ?`,
      [
        parseInt(formData.dni),
        formData.pais,
        formData.nombre_completo,
        formData.email,
        parseInt(formData.telefono),
        formData.direccion,
        Cliente_id
      ]
    );


    if (result.changes === 0) {
      console.log("No se encontró el cliente con el id especificado");
      return false;
    }

    console.log("Cliente guardado con éxito");
    return true;
  } catch (error) {
    console.error("Error al guardar el cliente:", error);
    return false;
  }
};
export const handleSaveEmpresa = async (db, formData, Empresa_id) => {
  try {
   {
      formData,
      Empresa_id
    }

    const dataToUpdate = {
      nombre: formData.nombre || null, 
      direccion: formData.direccion || null,
      telefono: formData.telefono ? parseInt(formData.telefono) : null, 
      ruc: formData.ruc ? parseInt(formData.ruc) : null,
      correo_contacto: formData.correo_contacto || null,
    };

    if (!Empresa_id) {
      console.error("El ID de la empresa es inválido o no está definido.");
      return false;
    }


    const result = await db.runAsync(
      `UPDATE Empresa SET 
        nombre = ?, 
        direccion = ?, 
        telefono = ?, 
        ruc = ?, 
        correo_contacto = ? 
      WHERE Empresa_id = ?`,
      [
        dataToUpdate.nombre,
        dataToUpdate.direccion,
        dataToUpdate.telefono,
        dataToUpdate.ruc,
        dataToUpdate.correo_contacto,
        Empresa_id,
      ]
    );


    if (result.changes === 0) {
      console.log("No se encontró la empresa con el ID especificado.");
      return false;
    }

    console.log("Empresa guardada con éxito.");
    return true;
  } catch (error) {
    console.error("Error al guardar los datos de la empresa:", error);
    return false;
  }
};


export const guardarNotificacion = async (db, formNotification) => {
  try {
    console.log("Guardando notificación con los siguientes datos:", formNotification);

    const result = await db.runAsync(
      `
      INSERT INTO Notificaciones (Usuario_id, titulo, descripcion, fecha_hora)
      VALUES (?, ?, ?, ?);
      `,
      [
        formNotification.Usuario_id, 
        formNotification.title, 
        formNotification.description, 
        new Date().toISOString() 
      ]
    );

    console.log("Resultado de la inserción:", result);

    if (result.insertId) {
      console.log("Notificación guardada con éxito con ID:", result.insertId);
      return true;
    } else {
      console.log("No se pudo guardar la notificación");
      return false;
    }
  } catch (error) {
    console.error("Error al guardar la notificación:", error);
    return false;
  }
};

export const handleSave = async (db, formData, selectedImage, Producto_id, currentImage) => {
  try {
    {
    formData,
      selectedImage,
      Producto_id,
      currentImage
    };


    let imageToSave;
    if (selectedImage) {
      imageToSave = selectedImage;
    } else if (currentImage && typeof currentImage === 'object' && currentImage.uri) {
      imageToSave = currentImage.uri;
    } else if (currentImage) {
      imageToSave = currentImage;
    } else {
      imageToSave = '';
    }


    const result = await db.runAsync(
      `UPDATE Productos SET 
        nombre = ?, 
        descripcion = ?, 
        precio_venta = ?, 
        precio_compra=?,
        cantidad = ?, 
        imagen = ? 
      WHERE Producto_id = ?`,
      [
        formData.title,
        formData.description,
        parseFloat(formData.price),
        parseFloat(formData.purchasePrice),
        parseInt(formData.stock),
        imageToSave,
        Producto_id
      ]
    );


    if (result.changes === 0) {
      console.log("No se encontró el producto con el id especificado");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error al guardar el producto:", error);
    return false;
  }
};

export const eliminarProducto = async (db, Producto_id) => {
  try {

    const result = await db.runAsync(
      `DELETE FROM Productos WHERE Producto_id = ?`,
      [Producto_id]
    );

    if (result.changes === 0) {
      console.log("No se encontró el producto con el id especificado.");
      return false; 
    }

    console.log("Producto eliminado con éxito.");
    return true;
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    return false; 
  }
};
export const consultarDatos = async (db, tableName) => {
  try {
    const result = await db.getAllAsync(`SELECT * FROM ${tableName}`);
    const datos = result || []; 
    console.log(`Datos en ${tableName}:`, datos);
    return datos;
  } catch (error) {
    console.error(`Error consultando ${tableName}:`, error);
    throw error;
  }
};
export const obtenerDetallesVenta = async (ventaId) => {
  try {
    const db = await getDBConnection();
    const query = `SELECT * FROM detalle_venta WHERE Venta_id = ?`;
    const result = await db.getAllAsync(query, [ventaId]);

    if (result && result.length > 0) {
      const detallesVenta = result.map((row) => row); 
      return detallesVenta;
    } else {
      console.log("No se encontraron detalles para la venta ID:", ventaId);
      return [];
    }
  } catch (error) {
    console.error("Error al obtener detalles de la venta:", error);
    throw error;
  }
};
export const obtenerHoraYfecha = async () => {
  try {
    console.log("Intentando obtener conexión a la base de datos...");
    const db = await getDBConnection();
    console.log("Conexión a la base de datos obtenida:", db);

    const query = "SELECT datetime('now', 'localtime') AS Fecha_actual";
    console.log("Ejecutando la consulta:", query);

    const result = await db.getAllAsync(query);
    console.log("Resultado de la consulta:", result);

    if (result && result.length > 0) {
      const fechaActual = result[0].Fecha_actual;
      console.log("Fecha y hora actual obtenida:", fechaActual);
      Alert.alert("Fecha y Hora Actual de SQLite", `Fecha obtenida: ${fechaActual}`);
    } else {
      console.log("No se obtuvo ninguna fecha. El resultado está vacío.");
    }
  } catch (error) {
    console.error("Error al obtener la fecha y hora actual:", error);
    Alert.alert("Error", "No se pudo obtener la fecha y hora actual");
  }
};
export const obtenerProductoPorId = async (productoId) => {
  try {
    const db = await getDBConnection();
    const query = `SELECT * FROM Productos WHERE Producto_id = ?`;
    const result = await db.getAllAsync(query, [productoId]);

    if (result && result.length > 0) {
      const producto = result[0]; 
      return producto;
    } else {
      console.log("No se encontró el producto con ID:", productoId);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener producto:", error);
    throw error;
  }
};
export const obtenerCantidadYVerificarStock = async (productoId, limiteStock = 5) => {
  try {
    const db = await getDBConnection();
    const query = `SELECT cantidad, nombre FROM Productos WHERE Producto_id = ?`;
    const result = await db.getAllAsync(query, [productoId]);

    if (result && result.length > 0) {
      const producto = result[0]; 
      if (producto.cantidad <= limiteStock) {
        console.log(`⚠️ El stock de "${producto.nombre}" es bajo (${producto.cantidad} unidades).`);
        await enviarNotificacionStockBajo(producto); 
      } else {
        console.log(`El stock de "${producto.nombre}" es suficiente (${producto.cantidad} unidades).`);
      }

      return producto;
    } else {
      console.log("No se encontró el producto con ID:", productoId);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener producto:", error);
    throw error;
  }
};
const enviarNotificacionStockBajo = async (producto) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '⚠️ Stock Bajo',
      body: `El stock de "${producto.nombre}" es de ${producto.cantidad} unidades.`,
      data: { productoId: producto.Producto_id }, 
    },
    trigger: null, 
  });
};

export const createUsuario = async (db, usuario) => {
  try {
    const result = await db.runAsync(
      'INSERT INTO Usuario (nombre_completo, email, contraseña) VALUES (?, ?, ?)',
      [usuario.nombre_completo, usuario.email, usuario.contraseña]
    );
    return result.lastInsertRowId; 
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};

export const createEmpresa = async (db, empresa) => {
  try {
    const result = await db.runAsync(
      'INSERT INTO Empresa (nombre, direccion, telefono,correo_contacto,ruc) VALUES (?, ?, ?, ?, ?)',
      [empresa.nombre, empresa.direccion, empresa.telefono, empresa.correo_contacto, empresa.ruc]
    );
    return result.lastInsertRowId; 
  } catch (error) {
    console.error("Error al crear a la empresa:", error);
    throw error;
  }
};

export const registrarCliente = async (db, cliente) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO Cliente (dni, nombre_completo, pais, email, telefono, direccion)
           VALUES (?, ?, ?, ?, ?, ?)`,
      [cliente.dni, cliente.nombre_completo, cliente.pais, cliente.email, cliente.telefono, cliente.direccion]
    );
    if (result.lastInsertRowId) {
      return result.lastInsertRowId; 
    } else {
      throw new Error("No se pudo obtener el ID del cliente recién creado.");
    }
  } catch (error) {
    console.error("Error al registrar el cliente:", error);
    throw error;
  }
};


export const getUsuario = async (db) => {
  try {
    const result = await db.getAllAsync('SELECT * FROM Usuario');

    return result;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};
export const getEmpresa = async (db) => {
  try {
    const result = await db.getAllAsync('SELECT * FROM Empresa');

    return result;
  } catch (error) {
    console.error('Error al obtener la empresa:', error);
    throw error;
  }
};

export const getProductoMasVendido = async (db) => {
  try {
    const query = `
      SELECT d.Producto_id, p.Nombre, SUM(d.cantidad) AS total_vendido
      FROM detalle_venta d
      JOIN Productos p ON d.Producto_id = p.Producto_id
      GROUP BY d.Producto_id
      ORDER BY total_vendido DESC
      LIMIT 1;
    `;
    
    const result = await db.getAllAsync(query);
    
    if (result && result.length > 0) {

      return result[0]; 
    } else {

      return null; 
    }
  } catch (error) {
    console.error('Error al obtener el producto más vendido:', error);
    throw error;
  }
};

export const createProducto = async (db, producto) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO Productos (nombre, descripcion, precio_compra, precio_venta, cantidad, imagen, fecha_ingreso, fecha_vencimiento, categoria_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        producto.nombre,
        producto.descripcion,
        parseFloat(producto.precio_compra),
        parseFloat(producto.precio_venta),
        parseInt(producto.cantidad),
        producto.imagen,
        producto.fecha_ingreso,
        producto.fecha_vencimiento,
        producto.categoria_id,
      ]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Error al crear producto:", error);
    throw error;
  }
};

export const obtenerVentas = async () => {
  try {
    const db = await getDBConnection();

    const ventas = await db.getAllAsync(
      `SELECT v.*, c.nombre_completo as cliente_nombre, t.nombre as tipo_venta, co.nombre as courier_nombre
       FROM Venta v
       JOIN Cliente c ON v.Cliente_id = c.Cliente_id
       JOIN Tipo_Venta t ON v.tipoVenta_id = t.tipoVenta_id
       JOIN Courier co ON v.Courier_id = co.Courier_id`
    );

    for (let venta of ventas) {
      const detalles = await db.getAllAsync(
        `SELECT dv.*, p.nombre as producto_nombre
         FROM detalle_venta dv
         JOIN Productos p ON dv.Producto_id = p.Producto_id
         WHERE dv.Venta_id = ?`,
        [venta.Venta_id]
      );
      venta.detalles = detalles; 
    }

    return ventas;
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    throw error;
  }
};

export const listaProducto = async (db) => {
  try {
    const result = await db.getAllAsync(`SELECT * FROM Productos`);
    return result;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
};
export const listClientes = async (db) => {
  try {
    const result = await db.getAllAsync(`SELECT * FROM Cliente`)
    return result;
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    throw error;
  }
}


export const registrarVenta = async (db, ventaData, detallesVenta) => {
  try {
    const fechaLocalQuery = await db.getAllAsync(
      "SELECT datetime('now', 'localtime') AS Fecha_actual"
    );
    const Fecha_venta = fechaLocalQuery[0].Fecha_actual;

    const resultVenta = await db.runAsync(
      `INSERT INTO Venta (Cliente_id, Fecha_venta, Total, tipoVenta_id, Courier_id, descuento) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        ventaData.Cliente_id,
        Fecha_venta, 
        ventaData.Total,
        ventaData.tipoVenta_id,
        ventaData.Courier_id,
        ventaData.descuento,
      ]
    );

    const Venta_id = resultVenta.lastInsertRowId; 

    for (const detalle of detallesVenta) {
      await db.runAsync(
        `INSERT INTO detalle_venta (Venta_id, Producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)`,
        [
          Venta_id,
          detalle.Producto_id,
          detalle.cantidad,
          detalle.precio_unitario,
          detalle.subtotal,
        ]
      );

      const updateStockResult = await db.runAsync(
        `UPDATE Productos
         SET cantidad = cantidad - ?
         WHERE Producto_id = ? AND cantidad >= ?`,
        [
          detalle.cantidad,
          detalle.Producto_id, 
          detalle.cantidad,
        ]
      );

      if (updateStockResult.rowsAffected === 0) {
        throw new Error(
          `Stock insuficiente para el producto con ID ${detalle.Producto_id}`
        );
      }
    }

    console.log("Venta registrada exitosamente con hora local.");
    return { 
      success: true, 
      ventaId: Venta_id, 
      timestamp: Fecha_venta 
    };
  } catch (error) {
    console.error("Error al registrar la venta:", error);
    return { success: false }; 
  }
};

export const getCriticalNotifications = async (db) => {
  try {
    const result = await db.getAllAsync(
      `SELECT p.Producto_id, p.nombre AS product_name, p.cantidad AS stock
       FROM Productos p
       WHERE p.cantidad < 7` 
    );

    return result || [];
  } catch (error) {
    console.error("Error al obtener notificaciones críticas:", error);
    throw error;
  }
};




export const getProductos = async (db) => {
  try {
    const result = await db.getAllAsync(
      `SELECT p.*, c.nombre as categoria_nombre 
       FROM Productos p 
       LEFT JOIN Categoria_Producto c ON p.categoria_id = c.categoria_id`
    );
    return result || [];
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
};
export const getCourier =async (db) => {
  try {
    const result = await db.getAllAsync(
      `SELECT * FROM Courier`
    );
    return result || [];
  } catch (error) {
    console.error("Error al obtener couriers:", error);
    throw error;
  }
};



export const initDatabase = async (db) => {
  try {
    console.log("Conexión a la base de datos establecida.");

    await db.execAsync('PRAGMA journal_mode = WAL;');

    await createTables(db);

    console.log("Base de datos inicializada correctamente");
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
    throw new Error('Error al inicializar la base de datos');
  }
};

export const dropTables = async (db) => {
  const tables = [
    'detalle_venta',
    'Venta',
    'Courier',
    'Tipo_Venta',
    'Productos',
    'Categoria_Producto',
    'Empresa',
    'Usuario'
  ];
 
  try {
    for (const table of tables) {
      await db.runAsync(`DROP TABLE IF EXISTS ${table}`);
      console.log(`Tabla ${table} eliminada`);
    }
    console.log("Todas las tablas eliminadas exitosamente");
  } catch (error) {
    console.error("Error al eliminar tablas:", error);
    throw error;
  }

};
