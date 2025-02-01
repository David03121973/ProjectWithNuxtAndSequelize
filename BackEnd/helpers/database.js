/* global process */
require('dotenv').config();
const Sequelize = require('sequelize');

// Crear una instancia de Sequelize
const sequelize = new Sequelize(process.env.NAME_BD, process.env.USER_BD, process.env.PASSWORD_BD, {
  host: process.env.SUPABASE_URL, // Cambiado para usar la URL de Supabase
  dialect: process.env.DIALECT_BD,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Solo si tu base de datos requiere SSL
    }
  },
  logging: false,
});

// Probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos de Supabase establecida con éxito.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos de Supabase:', error);
  }
};

testConnection();

module.exports = sequelize;