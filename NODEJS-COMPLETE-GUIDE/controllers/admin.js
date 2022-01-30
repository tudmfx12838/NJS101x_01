const Product = require("../models/product");

const { validationResult } = require("express-validator");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const errors = validationResult(req);
  if (!errors.isEmpty()) { //catched error
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

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
        hasError: false,
        errorMessage: null,
        validationErrors: []
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

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDescription,
        _id: prodId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  Product.findById(prodId)
    .then((product) => {
      if (prodId.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }

      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.imageUrl = updatedImageUrl;
      return product
            .save()
            .then((result) => {
              console.log("Updated Product");
              res.redirect("/admin/products");
            }); //Ham save nay cua mongoose
    })

    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find({userId: req.user._id}) //ham find() su dung trong mongodb se khac voi find() goc trong JS. find() trong mongodb neu khong truyen dieu kien thi se tra ve toan bo du lieu
    // .select('title price -_id') //select trong key muon lay ra, va bo ra nhung key sau dau '-'
    // .populate('userId', 'name') // populate se lay toan bo du lieu tu collection khac co quan he theo userId truyen vao
    .then((products) => {
      console.log(products);
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.deleteOne({_id: prodId, userId: req.user._id})//Ham findByIdAndRemove cua Mongoose
    .then(() => {
      console.log("Destroyed Product");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
