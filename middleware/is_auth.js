exports.isLoggedIn = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if (req.session.user.permission !== 'admin') {
        return res.status(404).render('404',{
            pageTitle: "Page Not Found",
            path: '/404',
        });
    };
    next();
}