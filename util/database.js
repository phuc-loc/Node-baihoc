const Sequelize = require('sequelize');

const sequelize = new Sequelize('note-complete', 'root', '12345678', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;