var passport = require('passport');
var User = require('../models/user');
var GithubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GithubStrategy({
    clientID: process.env.CLIENT_ID_GITHUB,
    clientSecret: process.env.CLIENT_SECRET_GITHUB,
    callbackURL: '/users/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
    var profileData = {
        name: profile.name,
        email: profile._json.email,
        username: profile.username,
        photo: profile.avatar_url
    }

    User.findOne({email: profile._json.email}, (err, user) => {
        if(err) return done(err);
        if(!user){
            User.create(profileData, (err, user) => {
                if(err) return done(err);
                res.redirect('/articles')
            });
        }else{
            done(err, user)
        }
    });
}));


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID_GOOGLE,
    clientSecret: process.env.CLIENT_SECRET_GOOGLE,
    callbackURL: '/users/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    var profileData = {
        name: profile._json.name,
        email: profile._json.email,
        username: profile.username
    }

    User.findOne({email: profile._json.email}, (err, user) => {
        if(err) return done(err);
        if(!user){
            User.create(profileData, (err, user) => {
                if(err) return done(err);
                return done(err, user)
            });
        }else{
            done(err, user)
        }
    });
}));



passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(function(id, done) {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})