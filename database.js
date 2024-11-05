import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'VentasDB.db';

// Función para abrir la base de datos
export const getDBConnection = () => {
  return SQLite.openDatabaseAsync(DATABASE_NAME);
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
    );`,

    // Tabla Empresa
    `CREATE TABLE IF NOT EXISTS Empresa (
      Empresa_id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      direccion TEXT,
      telefono INTEGER,
      correo_contacto TEXT,
      descripcion TEXT,
      ruc INTEGER UNIQUE
    );`,

    // Tabla Categoria_Producto
    `CREATE TABLE IF NOT EXISTS Categoria_Producto (
      categoria_id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL
    );`,

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
    );`,

    // Tabla Tipo_Venta
    `CREATE TABLE IF NOT EXISTS Tipo_Venta (
      tipoVenta_id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL
    );`,

    // Tabla Courier
    `CREATE TABLE IF NOT EXISTS Courier (
      Courier_id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL
    );`,

    // Tabla Venta
    `CREATE TABLE IF NOT EXISTS Venta (
      Venta_id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero_documento TEXT NOT NULL,
      nombre_cliente TEXT NOT NULL,
      Fecha_venta TEXT DEFAULT CURRENT_TIMESTAMP,
      Total DECIMAL(10,2) NOT NULL,
      tipoVenta_id INTEGER,
      Courier_id INTEGER,
      descuento DECIMAL(10,2) DEFAULT 0.00,
      FOREIGN KEY (tipoVenta_id) REFERENCES Tipo_Venta(tipoVenta_id),
      FOREIGN KEY (Courier_id) REFERENCES Courier(Courier_id)
    );`,

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
    );`
  ];

  // Ejecutar la creación de las tablas
  for (const table of tables) {
    try {
      await db.execAsync(table);
      console.log("Tablas creadas correctamente");
    } catch (error) {
      console.error("Error al crear tabla:", error);
      throw error;
    }
  }

  // Insertar tipos de venta básicos
  try {
    await db.runAsync(
      `INSERT OR IGNORE INTO Tipo_Venta (tipoVenta_id, nombre) 
       VALUES (1, 'Nacional'), (2, 'Internacional')`
    );
    console.log("Tipos de venta iniciales insertados");
  } catch (error) {
    console.error("Error al insertar tipos de venta:", error);
    throw error;
  }
};

// Función para inicializar la base de datos
export const initDatabase = async () => {
  try {
    const db = await getDBConnection();
    console.log("Conexión a la base de datos establecida.");
    await createTables(db);
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

  for (const table of tables) {
    try {
      await db.runAsync(`DROP TABLE IF EXISTS ${table}`);
      console.log(`Tabla ${table} eliminada`);
    } catch (error) {
      console.error(`Error al eliminar tabla ${table}:`, error);
      throw error;
    }
  }
  console.log("Todas las tablas eliminadas exitosamente");
};
