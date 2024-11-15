import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'VentasDB.db';


// Función para obtener la ruta de la base de datos
const getDatabasePath = () => {
  if (!FileSystem || !FileSystem.documentDirectory) {
    throw new Error('FileSystem no está disponible');
  }
  return `${FileSystem.documentDirectory}SQLite/${DATABASE_NAME}`;
};
// Función para abrir la base de datos
export const getDBConnection = async () => {
  return await SQLite.openDatabaseAsync(DATABASE_NAME); // Usar openDatabaseAsync
};
// Función para eliminar la base de datos
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


// Función para crear las tablas
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
      descripcion TEXT,
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
      Fecha_venta TEXT DEFAULT CURRENT_TIMESTAMP,
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


  ];

  try {
    // Crear tablas
    for (const table of tables) {
      await db.execAsync(table);
      console.log(`Tabla creada: ${table.split(' ')[2]}`); // Muestra el nombre de la tabla creada
    }


    // Insertar datos iniciales
    await db.runAsync(
      `INSERT OR IGNORE INTO Tipo_Venta (nombre) VALUES ('Nacional'), ('Internacional')`
    );
    console.log("Datos insertados en Tipo_Venta");

    await db.runAsync(
      `INSERT OR IGNORE INTO Categoria_Producto (nombre) 
       VALUES ('Te'), ('Cafes'), ('energizantes'), ('Proteinas'), ('Aseo Personal')`
    );
    console.log("Datos insertados en Categoria_Producto");

    await db.runAsync(
      `INSERT OR IGNORE INTO Courier (nombre) 
       VALUES ('Olva Courier'), ('In Drive'), ('Shalom'), ('Vifasa'), ('Frapessa'), ('Otros')`
    );
    console.log("Datos insertados en Courier");

    await db.runAsync(
      `INSERT OR IGNORE INTO Cliente (dni, pais, nombre_completo, email, telefono, direccion)
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
    `
    );

    console.log("Datos insertados en Cliente");
  } catch (error) {
    console.error("Error al crear tablas o insertar datos:", error);
    throw error;
  }
};
export const handleSave = async (formData, selectedImage, Producto_id, currentImage) => {
  try {
    console.log("Guardando producto con los siguientes datos:", {
      formData,
      selectedImage,
      Producto_id,
      currentImage
    });

    const db = await getDBConnection();

    // Determinar qué imagen usar
    let imageToSave;
    if (selectedImage) {
      // Si hay una nueva imagen seleccionada, usar esa
      imageToSave = selectedImage;
    } else if (currentImage && typeof currentImage === 'object' && currentImage.uri) {
      // Si currentImage es un objeto con uri (formato React Native Image source)
      imageToSave = currentImage.uri;
    } else if (currentImage) {
      // Si currentImage es directamente un string con la URI
      imageToSave = currentImage;
    } else {
      // Si no hay ninguna imagen
      imageToSave = '';
    }

    console.log("Imagen que se guardará:", imageToSave);

    // Realizar la actualización en la base de datos
    const result = await db.runAsync(
      `UPDATE Productos SET 
        nombre = ?, 
        descripcion = ?, 
        precio_venta = ?, 
        cantidad = ?, 
        imagen = ? 
      WHERE Producto_id = ?`,
      [
        formData.title,
        formData.description,
        parseFloat(formData.price),
        parseInt(formData.stock),
        imageToSave,
        Producto_id
      ]
    );

    console.log("Resultado de la actualización:", result);

    if (result.changes === 0) {
      console.log("No se encontró el producto con el id especificado");
      return false;
    }

    console.log("Producto guardado con éxito");
    return true;
  } catch (error) {
    console.error("Error al guardar el producto:", error);
    return false;
  }
};
export const eliminarProducto = async (Producto_id) => {
  try {
    const db = await getDBConnection();

    const result = await db.runAsync(
      `DELETE FROM Productos WHERE Producto_id = ?`,
      [Producto_id]
    );

    if (result.changes === 0) {
      console.log("No se encontró el producto con el id especificado.");
      return false; // No se encontró el producto o no hubo cambios
    }

    console.log("Producto eliminado con éxito.");
    return true; // Devuelve true si la operación fue exitosa
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    return false; // Devuelve false si ocurrió un error
  }
};
// Función para consultar datos
export const consultarDatos = async (db, tableName) => {
  try {
    const result = await db.getAllAsync(`SELECT * FROM ${tableName}`);
    const datos = result || []; // Manejo seguro de resultados
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
      const detallesVenta = result.map((row) => row); // Acceder a los resultados
      console.log(`Detalles de venta (ID ${ventaId}):`, detallesVenta);
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

// Función para obtener información de un producto por su ID
export const obtenerProductoPorId = async (productoId) => {
  try {
    const db = await getDBConnection();
    const query = `SELECT * FROM Productos WHERE Producto_id = ?`;
    const result = await db.getAllAsync(query, [productoId]);

    if (result && result.length > 0) {
      const producto = result[0]; // Acceder al primer resultado
      console.log(`Producto (ID ${productoId}):`, producto);
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

// Funciones CRUD para Usuario
export const createUsuario = async (db, usuario) => {
  try {
    const result = await db.runAsync(
      'INSERT INTO Usuario (nombre_completo, email, contraseña) VALUES (?, ?, ?)',
      [usuario.nombre_completo, usuario.email, usuario.contraseña]
    );
    return result.lastInsertRowId; // Obtiene el ID del último registro insertado
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};

export const getUsuarios = async (db) => {
  try {
    const result = await db.getAllAsync('SELECT * FROM Usuario');
    return result || [];
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

// Función para crear un producto
export const createProducto = async (db, producto) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO Productos (
        nombre, descripcion, precio_compra, precio_venta, cantidad, imagen, 
        fecha_ingreso, fecha_vencimiento, categoria_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        producto.nombre,
        producto.descripcion,
        parseFloat(producto.precio_compra),  // Convertir a número decimal
        parseFloat(producto.precio_venta),   // Convertir a número decimal
        parseInt(producto.cantidad),         // Convertir a número entero
        producto.imagen,
        producto.fecha_ingreso,
        producto.fecha_vencimiento,
        producto.categoria_id
      ]
    );
    return result.lastInsertRowId; // Obtiene el ID del último registro insertado
  } catch (error) {
    console.error("Error al crear producto:", error);
    throw error;
  }
};
export const obtenerVentas = async () => {
  try {
    const db = await getDBConnection();

    // Obtener todas las ventas
    const ventas = await db.getAllAsync(
      `SELECT v.*, c.nombre_completo as cliente_nombre, t.nombre as tipo_venta, co.nombre as courier_nombre
       FROM Venta v
       JOIN Cliente c ON v.Cliente_id = c.Cliente_id
       JOIN Tipo_Venta t ON v.tipoVenta_id = t.tipoVenta_id
       JOIN Courier co ON v.Courier_id = co.Courier_id`
    );
    console.log("Ventas obtenidas sin detalles:", ventas);

    // Obtener los detalles de cada venta
    for (let venta of ventas) {
      const detalles = await db.getAllAsync(
        `SELECT dv.*, p.nombre as producto_nombre
         FROM detalle_venta dv
         JOIN Productos p ON dv.Producto_id = p.Producto_id
         WHERE dv.Venta_id = ?`,
        [venta.Venta_id]
      );
      venta.detalles = detalles; // Agregar detalles de cada venta
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
    console.log("Productos obtenidos:", result); // Verifica que los productos se obtienen
    return result;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
};
export const listClientes = async (db) => {
  try {
    const result = await db.getAllAsync(`SELECT * FROM Cliente`)
    console.log("Clientes obtenidos", result);
    return result;
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    throw error;
  }
}

// database.js

export const registrarVenta = async (ventaData, detallesVenta) => {
  try {
    const db = await getDBConnection();

    // Inserta la venta en la tabla Venta
    const resultVenta = await db.runAsync(
      `INSERT INTO Venta (Cliente_id, Total, tipoVenta_id, Courier_id, descuento) VALUES (?, ?, ?, ?, ?)`,
      [
        ventaData.Cliente_id,
        ventaData.Total,
        ventaData.tipoVenta_id,
        ventaData.Courier_id,
        ventaData.descuento
      ]
    );

    const Venta_id = resultVenta.lastInsertRowId; // Obtiene el ID de la venta recién insertada

    // Inserta cada producto en la tabla detalle_venta
    for (const detalle of detallesVenta) {
      await db.runAsync(
        `INSERT INTO detalle_venta (Venta_id, Producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)`,
        [
          Venta_id,
          detalle.Producto_id,
          detalle.cantidad,
          detalle.precio_unitario,
          detalle.subtotal
        ]
      );
    }

    console.log("Venta registrada exitosamente.");
    return true;
  } catch (error) {
    console.error("Error al registrar la venta:", error);
    return false;
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

// Función para inicializar la base de datos
export const initDatabase = async () => {
  try {
    const db = await getDBConnection();
    console.log("Conexión a la base de datos establecida.");
    await createTables(db);

    // Verificar datos insertados
    await consultarDatos(db, 'Tipo_Venta');
    await consultarDatos(db, 'Categoria_Producto');
    await consultarDatos(db, 'Courier');
    await consultarDatos(db, 'Cliente');

    console.log("Base de datos inicializada correctamente");
    return db;
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
    throw new Error('Error al inicializar la base de datos');
  }
};

// Función para eliminar tablas
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
