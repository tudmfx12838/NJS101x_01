const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    })
    .then(result => {
      //console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err =>{
       console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  //Checking edit mode
  //http://localhost:3000/admin/edit-product/0.123214?edit=true
  const editMode = req.query.edit;
  if(!editMode){
    return res.redirect('/');
  }

  //get productId from url's params
  const prodId = req.params.productId;
  req.user.getProducts({where: {id: prodId}})
  // Product.findByPk(prodId)
    .then(products =>{
      const product = products[0];
      if(!product){
        return res.redirect('/');
      }

      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
      .catch(err => console.log(err)); 

};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updateTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updateImageUrl = req.body.imageUrl;
  const updateDescription = req.body.description;
  // const updatedProduct = new Product(prodId, 
  //                                   updateTitle, 
  //                                   updateImageUrl,
  //                                   updateDescription,
  //                                   updatedPrice);
  // updatedProduct.save();
  Product
    .findByPk(prodId)
    .then((product) => {
      product.title = updateTitle;
      product.price = updatedPrice;
      product.imageUrl = updateImageUrl;
      product.description = updateDescription;
      return product.save();
    })
    .then((result) => {
      console.log('Updated Product');
      res.redirect('/admin/products'); 
    })
    .catch(err => console.log(err));
                    
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product
    .findByPk(prodId)
    .then(product => {
      return product.destroy();
    })
    .then(() => {
      console.log('Destroyed Product');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err)); 
};