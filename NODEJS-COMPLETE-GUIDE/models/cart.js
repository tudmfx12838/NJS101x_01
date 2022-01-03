const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, productPrice){
        //Fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if(!err){
                cart = JSON.parse(fileContent);
            }
        
        //Analyze the cart => find existing product
        const existingProductIndex = cart.products.findIndex(
            prod => prod.id === id
        );
        const existingProduct = cart.products[existingProductIndex];
        let updatedProduct;
        //Add new product/ increate quantity
        if(existingProduct){//has update
            updatedProduct = {...existingProduct};
            updatedProduct.qty = updatedProduct.qty + 1;
            cart.products = [...cart.products];
            cart.products[existingProductIndex] = updatedProduct;
        }else{//no update and add new
            updatedProduct = { id: id, qty: 1 };
            cart.products = [...cart.products, updatedProduct];
        }
        cart.totalPrice = cart.totalPrice + +productPrice;
        fs.writeFile(p, JSON.stringify(cart), err => {
            console.log(err);
        });
       
    });
    }

    static deleteProduct(id, productPrice){
        fs.readFile(p, (err, fileContent) => {
            if(!err){
                return
            }
            
            const updateCart = {...JSON.parse(fileContent)};
            const product = updateCart.products.findIndex(prod => prod.id ===id);
            const productQty = product.qty;
            updateCart.products = updateCart.products.filter(prod => prod.id !== id);
            updateCart.totalPrice = updateCart.totalPrice - productPrice * productQty;
            
            fs.writeFile(p, JSON.stringify(updateCart), err => {
                console.log(err);
            });
        });  
    }
};