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
  // const product = new Product(null, title, imageUrl, description, price);
  // product
  //   .save()
  //   .then(()=>{
  //     res.redirect('/');
  //   })
  //   .catch(err => console.log(err));

  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description
  })
    .then(result => {
      //console.log(result);
      console.log('Created Product');
      res.redirect('/');
    })
    .catch(err =>{
       console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product
    .findAll()
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
  Product.findById(prodId, product =>{
    if(!product){
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updateTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updateImageUrl = req.body.imageUrl;
  const updateDescription = req.body.description;
  const updatedProduct = new Product(prodId, 
                                    updateTitle, 
                                    updateImageUrl,
                                    updateDescription,
                                    updatedPrice);
  updatedProduct.save();
  res.redirect('/admin/products');                   
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect('/admin/products');
};