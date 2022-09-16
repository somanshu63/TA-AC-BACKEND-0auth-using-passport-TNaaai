const User = require("../models/user");

module.exports = {
    loggedInUser: (req, res, next) => {
        if(req.session && req.session.userId){
            next();
        } else if(req.session.passport && req.session.passport.user){
            next();
        }
        else {
            req.flash('error', 'you have to login first')
            res.redirect('/users/login')
        }
    },
    userInfo: (req, res, next) => {
        if(req.session.passport){
            var userId = req.session.passport.user
        }
        else if(req.session.userId){
            var userId = req.session.userId;
        }
        if(userId){
            User.findById(userId, 'fullName email', (err, user) => {
                if(err) return next(err);
                req.user = user;
                res.locals.user = user;
                console.log(req.user)
                next();
            });
        }else {
            req.user = null;
            res.locals.user = null;
            next();
        }
    }
}