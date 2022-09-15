var passport = require('passport');
var User = require('../models/user')
var GithubStrategy = require('passport-github').Strategy;

passport.use(new GithubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
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
                console.log(addeduser)
                return done(null, addeduser)
            });
        } 
        else{
            console.log(user)
            done(null, user)
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