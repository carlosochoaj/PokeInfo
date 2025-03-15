const mysql = require('mysql2/promise');

let pool = null;

// Configuración de la base de datos
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'pokemon123', // Nuestra contraseña de MySQL
  database: 'PokemonDB'
};

// Inicialización de la Base de Datos
async function initializeDatabase() {
  try {
    console.log('Inicializando la conexión a la base de datos MySQL...');
    
    // Nos conectamos al servidor MySQL (sin seleccionar una base de datos)
    const rootConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    // Creamos la base de datos si no existe
    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await rootConnection.end();
    
    console.log(`La base de datos ${dbConfig.database} ha sido creada o ya existe`);
    
    // Nos conectamos a la base de datos que vamos a usar (la de Pokemon)
    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    // Creamos las tablas
    const connection = await pool.getConnection();
    
    // En esta tabla guardaremos la información de los Pokemons
    await connection.query(`
      CREATE TABLE IF NOT EXISTS pokemon (
        id INT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        height INT,
        weight INT,
        types TEXT,
        abilities TEXT,
        image_url TEXT
      )
    `);
    
    connection.release();
    console.log('Tablas creadas correctamente');
    
    return pool;
  } catch (err) {
    console.error('Error en la inicialización de la Base de Datos: ', err);
    throw err;
  }
}

// Función para obtener la conexión a la base de datos
async function getPool() {
  if (!pool) {
    await initializeDatabase();
  }
  return pool;
}

module.exports = {
  initializeDatabase,
  getPool,
  mysql
};