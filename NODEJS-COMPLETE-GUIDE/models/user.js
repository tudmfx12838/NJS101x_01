const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {item: []}
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    //Check existing product in Cart
    //findIndex will return -1 if not found/not exist product
    const cartProductIndex = this.cart.item.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    const newQuantity = 1;
    const updateCartItems = [...this.cart.item];
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.item[cartProductIndex].quantity + 1;
      updateCartItems[cartProductIndex] = newQuantity;
    } else {
      updateCartItems.push({
        item: [
          {
            productId: new mongodb.ObjectId(product._id),
            quantity: newQuantity,
          },
        ],
      });
    }

    const updateCart = {
      item: updateCartItems,
    };
    const db = getDb();
    db.collection("users").updateOne(
      { _id: new mongodb.ObjectId(this._id) },
      { $set: { cart: updateCart } }
    );
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = User;
