const Sequelize = require('sequelize');

const sequelize = require('../util/database');

//http://docs.sequelizejs.com/manual/
//https://sequelize.org/v7/
const OrderItem = sequelize.define('orderItem', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity: Sequelize.INTEGER
});

module.exports = OrderItem;