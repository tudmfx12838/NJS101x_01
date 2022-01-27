const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.find() //ham find() su dung trong mongodb se khac voi find() goc trong JS. find() trong mongodb neu khong truyen dieu kien thi se tra ve toan bo du lieu
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId) //findById() bay gio la ham mac dinh co trong mongodb mongoose, chu khong phai do ta tao ra
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find() //ham find() su dung trong mongodb se khac voi find() goc trong JS
    //find() trong mongodb neu khong truyen dieu kien thi se tra ve toan bo du lieu
    .then((products) => {
      // console.log(products);
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        isAuthenticated: req.session.isLoggedIn,
        csrfToken: req.csrfToken() //duoc cung cap boi goi csrfProtection trong middleware app.js
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId") //truy van ref den product
    .then((user) => {
      console.log(user.cart.items);
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product); //addToCart minh tao trong user model bang Schema.methods
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart"); // Debugged here
    })
    .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId") //truy van ref den product
    .then((user) => {
      console.log(user.cart.items);
      const products = user.cart.items.map((i) => {
        return { product: { ...i.productId._doc }, quantity: i.quantity }; //Lab7.14 chi hien Id cua product, them ...i.productId._doc se cho lay ra toan bo du lieu theo Id cua product
      });
      const order = new Order({
        user: {
          name: req.user.name,
          email: req.user.email,
          userId: req.user, //khong can req.user._id ma Mongoose se tu dong chon
        },
        products: products,
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      console.log(orders);
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     pageTitle: 'Checkout'
//   });
// };
