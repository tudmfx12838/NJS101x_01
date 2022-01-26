exports.getPageError = (req, res, next) => {
    console.log(req.url);
    res.status(404).render('404',{
        pageTitle: "Page Not Found",
        path: req.url,
        activeShop: false,
        activeAddProduct: false,
        productCSS: false,
        formCSS: false,
        isAuthenticated: req.session.isLoggedIn
    });
};