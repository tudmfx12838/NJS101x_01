// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: '123456'
// });

// module.exports = pool.promise();

// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('node-complete', 'root', '123456', {
//     dialect: 'mysql',
//     host: 'localhost'
// });

// module.exports = sequelize;

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://admin:yYoPp04jYzN8lHf7@cluster0.gqluc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(client => {
        console.log('Connected!!!');
        callback(client);
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = mongoConnect;
