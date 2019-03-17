module.exports = (req, res, next) => {
    console.log('loading.....')
    if(!req.session['username']) {
        res.redirect('/login');
    } else {
        res.user_session = { username: req.session.username, icon: req.session.icon }
        next();
    }
}