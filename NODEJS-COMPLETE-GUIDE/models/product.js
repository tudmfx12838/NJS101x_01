const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: { //add relation with User, moi quan he ngam dinh duoc quan ly trong mongoose
    type: Schema.Types.ObjectId,
    ref: 'User',  //User is name of model whish was created ./models./user.js
    required: true
  }
});
//mongoose.model() dong vai tro ket noi mot schema
module.exports = mongoose.model('Product', productSchema);
//Sau khi add product thi trong MongoDb xuat hien collect "products", ly do la mongoose se lay model name ('Product')
//sau do chuyen thanh chu thuong va them 's', sau do dung ham collection('products') de tao mot collection



// const mongodb = require("mongodb");
// const getDb = require("../util/database").getDb;

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = userId;
//   }
//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       //existing _id => Update product
//       dbOp = db
//         .collection("products")
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOp = db.collection("products").insertOne(this);
//     }
//     return dbOp
//       .then(result => {
//         console.log(result);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find()
//       .toArray() //Yeu cau MongoDb tra ve mang cac du lieu
//       .then(products => {
//         // console.log(products);
//         return products;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   static findById(prodId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find({ _id: new mongodb.ObjectId(prodId) }) //MongoDB quan ly Id trong ObjectId
//       .next()
//       .then(product => {
//         console.log(product);
//         return product;
//       })
//       .catch((err) => console.log(err));
//   }

//   static deleteById(prodId){
//     const db = getDb();
//     return db
//     .collection("products")
//     .deleteOne({ _id: new mongodb.ObjectId(prodId) }) //MongoDB quan ly Id trong ObjectId
//     .then(result => {
//       console.log('Deleted Product!');
//       console.log(result);
//     })
//     .catch(err => console.log(err));
//   }
// }

// module.exports = Product;
