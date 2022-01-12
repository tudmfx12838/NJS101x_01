const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      { //Add relation with Product
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function(product) { //tao function bang ownerShema du xu ly logic
    //Check existing product in Cart
    //findIndex will return -1 if not found/not exist product
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: product._id, //Mongoose se tu boc _id trong new ObjectId(_id)
        quantity: newQuantity
      });
    }

    const updatedCart = {
      items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save(); //save() cua mongoose de update
    // const db = getDb();   //update thu cong khi khong dung Mongoose
    // return db
    //   .collection("users")
    //   .updateOne(
    //     { _id: new ObjectId(this._id) },
    //     { $set: { cart: updatedCart } }
    //   );
};

userSchema.methods.removeFromCart = function(productId) {
  //  const updatedCartItems = [...this.cart.items];
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
    // const db = getDb();
    // return db
    //   .collection("users")
    //   .updateOne(
    //     { _id: new ObjectId(this._id) },
    //     { $set: { cart: { items: updatedCartItems } } }
    //   );
}

userSchema.methods.clearCart = function(){
  this.cart.items = [];
  // this.cart = {items: []};
  return this.save();
}

module.exports = mongoose.model('User', userSchema);

// const mongodb = require("mongodb");
// const getDb = require("../util/database").getDb;
// const ObjectId = mongodb.ObjectId;

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart; // {items: []}
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   addToCart(product) {
//     //Check existing product in Cart
//     //findIndex will return -1 if not found/not exist product
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new ObjectId(product._id),
//         quantity: newQuantity
//       });
//     }

//     const updatedCart = {
//       items: updatedCartItems
//     };
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map((item) => {
//       return item.productId;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map(p => {
//           return {
//             ...p, quantity: this.cart.items.find(i => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity
//           };
//         });
//       });
//   }

//   deleteItemFromCart(productId) {
//     // const updatedCartItems = [...this.cart.items];
//     const updatedCartItems = this.cart.items.filter(item => {
//       return item.productId.toString() !== productId.toString();
//     });
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart().then(products => {
//       const order = {
//         items: products,
//         user: {
//           _id: new ObjectId(this._id),
//           name: this.name,
//           email: this.email
//         }
//       }
//       return db
//       .collection('orders')
//       .insertOne(order)
//     })
//     .then(result => {
//       this.cart  = {item: []};//clean cart after add order
//       return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: [] } } }
//       );
//     })
//   }

//   getOrders(){
//     const db = getDb();
//     return db
//       .collection('orders')
//       .find({'user._id': new ObjectId(this._id)})
//       .toArray();
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new ObjectId(userId) })
//       .then((user) => {
//         console.log(user);
//         return user;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }

// module.exports = User;
