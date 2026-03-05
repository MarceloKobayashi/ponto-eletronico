// Configuração do banco de dados postgres
const { Sequelize } = require("sequelize");
require('dotenv').config();

//database | username | password | option {host | dialect}
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'postgres'
});

//Colocar o na lista de módulos exportados o 'sequelize'
module.exports = sequelize;
