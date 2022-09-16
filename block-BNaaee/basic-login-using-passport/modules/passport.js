var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy
var BasicStrategy = require('passport-http').BasicStrategy


passport.use(new BasicStrategy(
    function(email, password, done) {
      User.findOne({ email: email }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
             return done(null, false); 
            }
        user.verifyPassword(password, (err, result) => {
            if (err) return done(err)
            if(!result){
                res.json('wrong password');
            }
            req.session.userId = user.id;
            res.redirect('/');
        });
        return done(null, user);
      });
    }
  ));