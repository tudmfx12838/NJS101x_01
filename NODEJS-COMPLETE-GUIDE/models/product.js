const Sequelize = require('sequelize');

const sequelize = require('../util/database');

//http://docs.sequelizejs.com/manual/
//https://sequelize.org/v7/
const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrements: true,
    allowNull: false,
    primaryKey: true
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Product;