const getDb = require('../util/database').getDb;

class Product {
  constructor(title, price, description, imageUrl){
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }
  svae(){
    const db = getDb();
    db.collection('product')
      .insertOne()
      .then(result => {

      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = Product;