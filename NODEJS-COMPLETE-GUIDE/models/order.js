const Sequelize = require('sequelize');

const sequelize = require('../util/database');

//http://docs.sequelizejs.com/manual/
//https://sequelize.org/v7/
const Order = sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = Order;