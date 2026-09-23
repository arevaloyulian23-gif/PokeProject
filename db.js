const mysql = require('mysql2');
require('dotenv').config();

// Crear el pool o conexión con soporte SSL para Aiven
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false // Permite la conexión cifrada con Aiven
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Probar la conexión al iniciar la app
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error al conectar a la base de datos en Aiven:', err.message);
  } else {
    console.log('✅ Conectado exitosamente a MySQL en Aiven');
    connection.release();
  }
});

module.exports = pool.promise();