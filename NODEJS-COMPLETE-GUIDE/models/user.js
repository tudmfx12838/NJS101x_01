const Sequelize = require('sequelize');

const sequelize = require('../util/database');

//http://docs.sequelizejs.com/manual/
//https://sequelize.org/v7/

const User = sequelize.define('user',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING
});

module.exports = User;