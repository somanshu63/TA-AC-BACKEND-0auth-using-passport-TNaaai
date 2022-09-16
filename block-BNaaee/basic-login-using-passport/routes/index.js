var express = require('express');
const User = require('../models/user');
var passport = require('passport')
var router = express.Router();
var oauth2orize = require('oauth2orize')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', (req, res) => {
  res.render('register')
});

router.post('/register', (req, res, next) => {
  console.log(req.body)
  User.create(req.body, (err, user) => {
    if(err) return next(err);
    console.log(user)
    res.redirect('/login')
  });
});


router.post('/login', 
passport.authenticate(['basic', 'oauth2-client-password'], { session: false }));


router.get('/login', (req, res) => {
  res.render('login')
});

// router.post('/login', (req, res, next) => {
//   var { email, password } = req.body;
//   if(!email || !password){
//     return res.redirect('/');
//   }
//   User.findOne({email}, (err, user) => {
//     if(err) return next(err);
//     if(!user){
//       return res.redirect('/')
//     }
//     user.verifyPassword(password, (err, result) => {
//       if(err) return next(err);
//       if(!result){
//         return res.redirect('/')
//       }
//       res.redirect('/');
//     });
//   });
// });


module.exports = router;
