import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'VentasDB.db';

// Función para abrir la base de datos
export const getDBConnection = async () => {
  return await SQLite.openDatabaseAsync(DATABASE_NAME); // Usar openDatabaseAsync
};
// Función para eliminar la base de datos
export const deleteDatabase = async () => {
  const path = `${FileSystem.documentDirectory}${DATABASE_NAME}`;
  await FileSystem.deleteAsync(path, { idempotent: true });
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
      precio DECIMAL(10,2) NOT NULL,
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

    // Tabla Comision_Producto
    `CREATE TABLE IF NOT EXISTS Comision_Producto (
      Comision_id INTEGER PRIMARY KEY AUTOINCREMENT,
      Producto_id INTEGER NOT NULL,
      porcentaje_comision DECIMAL(5,2) NOT NULL,
      FOREIGN KEY (Producto_id) REFERENCES Productos(Producto_id)
    )`
  ];

  try {
    // Crear tablas
    for (const table of tables) {
      await db.execAsync(table);
      console.log(`Tabla creada: ${table.split(' ')[2]}`); // Muestra el nombre de la tabla creada
    }

    // Eliminar datos existentes
    await db.execAsync(`DELETE FROM Tipo_Venta`);
    await db.execAsync(`DELETE FROM Categoria_Producto`);
    await db.execAsync(`DELETE FROM Courier`);

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

  } catch (error) {
    console.error("Error al crear tablas o insertar datos:", error);
    throw error;
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

// Funciones CRUD para Productos
export const createProducto = async (db, producto) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO Productos (
        nombre, descripcion, precio, cantidad, imagen, 
        fecha_ingreso, fecha_vencimiento, categoria_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        producto.nombre,
        producto.descripcion,
        producto.precio,
        producto.cantidad,
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
