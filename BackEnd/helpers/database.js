// database.js
/* global process */
require('dotenv').config();
const Sequelize = require('sequelize');

// Crear una instancia de Sequelize
const sequelize = new Sequelize(process.env.NAME_BD, process.env.USER_BD, process.env.PASSWORD_BD, {
  host: process.env.HOST_BD, // o la dirección de tu servidor de base de datos
  dialect: process.env.DIALECT_BD,
  logging: false,
});

// Probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida con éxito.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
};

testConnection();

module.exports = sequelize;
