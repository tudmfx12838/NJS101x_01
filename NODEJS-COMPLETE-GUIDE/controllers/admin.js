const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  if(!req.session.isLoggedIn){
    return res.redirect('/login');
  }
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  product
    .save()
    .then((result) => {
      //console.log(result);
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  //Checking edit mode
  //http://localhost:3000/admin/edit-product/0.123214?edit=true
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  //get productId from url's params
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }

      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;

  Product.findById(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.imageUrl = updatedImageUrl;
      return product.save(); //Ham save nay cua mongoose
    })
    .then((result) => {
      console.log("Updated Product");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find() //ham find() su dung trong mongodb se khac voi find() goc trong JS. find() trong mongodb neu khong truyen dieu kien thi se tra ve toan bo du lieu
    // .select('title price -_id') //select trong key muon lay ra, va bo ra nhung key sau dau '-'
    // .populate('userId', 'name') // populate se lay toan bo du lieu tu collection khac co quan he theo userId truyen vao
    .then((products) => {
      console.log(products);
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findByIdAndRemove(prodId)//Ham findByIdAndRemove cua Mongoose
    .then(() => {
      console.log("Destroyed Product");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
