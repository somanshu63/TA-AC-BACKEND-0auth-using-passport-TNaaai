var passport = require('passport');
var User = require('../models/user');
var GithubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.use(new GithubStrategy({
    clientID: process.env.CLIENT_ID_GITHUB,
    clientSecret: process.env.CLIENT_SECRET_GITHUB,
    callbackURL: '/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
    var profileData = {
        name: profile.displayName,
        email: profile._json.email,
        username: profile.username,
        photo: profile._json.avatar_url
    }

    User.findOne({email: profile._json.email}, (err, user) => {
        if(err) return done(err);
        if(!user){
            User.create(profileData, (err, addeduser) => {
                if(err) return done(err);
                console.log(addeduser);
                return done(null, addeduser);
            });
        }else{
            console.log(user);
            done(null, user);
        }
    });
}))


passport.use(new GoogleStrategy ({
    clientID: process.env.CLIENT_ID_GOOGLE,
    clientSecret: process.env.CLIENT_SECRET_GOOGLE,
    callbackURL: '/auth/google/callbacks'
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile)
    var profileData = {
        name: profile.displayName,
        email: profile._json.email,
        username: profile.username,
        photo: profile._json.avatar_url
    }

    User.findOne({email: profile._json.email}, (err, user) => {
        if(err) return done(err);
        if(!user){
            User.create(profileData, (err, addeduser) => {
                if(err) return done(err);
                console.log(addeduser);
                return done(null, addeduser);
            });
        }else{
            console.log(user);
            done(null, user);
        }
    });
}))



passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(function(id, done) {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})
