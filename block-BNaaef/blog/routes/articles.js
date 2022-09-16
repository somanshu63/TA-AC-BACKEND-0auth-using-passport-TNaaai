var express = require('express');
var router = express.Router();
var Article = require('../models/article');
var Comment = require('../models/comment');
var User = require('../models/user');
var auth = require('../middlewares/auth')

/* GET articles. */
router.get('/', function(req, res) {
    console.log(req.session)
    console.log(req.user)
    Article.find({}, (err, articles) => {
        if(err) return next(err);
        res.render('articles', {articles});
    });
});

// get article form
router.get('/new', (req, res) => {
    res.render('articleform');
});

//add article
router.post('/', (req, res, next) => {
    req.body.author = req.user.id;
    Article.create(req.body, (err, article) => {
        if (err) return next(err);
        res.redirect('/articles');
    });
});

// get single article
router.get('/:slug', auth.loggedInUser, (req, res, next) => {
    var error = req.flash('error')[0];
    var slug = req.params.slug;
    Article.findOne({slug: slug}).populate('author').exec((err, article) => {
        if (err) return next(err);
        Comment.find({articleId: article.id}, (err, comments) => {
            if (err) return next(err);
            res.render('singleArticle', {article, comments, error})
        });
    });
});

//like
router.get('/:slug/like', (req, res, next) => {
    var slug = req.params.slug;
    Article.findOneAndUpdate({slug: slug}, {$inc: {likes: 1}}, (err, article) => {
        if(err) return next(err);
        res.redirect('/articles/'+ slug);
    });
});


//dislike
router.get('/:slug/dislike', (req, res, next) => {
    var slug = req.params.slug;
    Article.findOne({slug: slug}, (err, article) => {
        if(err) return next(err);
        if(article.likes > 0){
            Article.findOneAndUpdate({slug: slug}, {$inc: {likes: -1}}, (err, article) => {
                if(err) return next(err);
                res.redirect('/articles/'+ slug);
            });
        }else {
            res.redirect('/articles/'+ slug);
        }
    });
});

//open edit form
router.get('/:slug/edit', (req, res, next) => {
    var slug = req.params.slug;
    Article.findOne({slug: slug}, (err, article) => {
        if(err) return next(err);
        if(article.author == req.user.id){
            res.render('articleUpdateForm', {article});
        }else{
            req.flash('error', 'you are not the author of this article')
            res.redirect('/articles/' + slug);
        }
    });
});

//update article
router.post('/:slug', (req, res, next) => {
    var slug = req.params.slug;
    req.body.author = req.user.id
    console.log(req.body)
    Article.findOneAndUpdate({slug: slug}, (req.body), (err, article) => {
        if(err) return next(err);
        res.redirect('/articles/'+slug);
    });
});

//delete article
router.get('/:slug/delete', (req, res, next) => {
    var slug = req.params.slug;
    Article.findOne({slug: slug}, (err, article) => {
        if(err) return next(err);
        if(article.author == req.user.id){
            Article.findOneAndDelete({slug: slug}, (err, article) => {
                if (err) return next(err);
                res.redirect('/articles')
            });
        }else{
            req.flash('error', 'you are not the author of this article')
            res.redirect('/articles/' + slug);
        }
    });
    
});

//add comments
router.post('/:id/comments', function(req, res, next) {
    var id = req.params.id;
    req.body.articleId = id;
    req.body.author = req.user.id;
    Comment.create(req.body, (err, comment) => {
        if (err) return next(err);
        Article.findById(id, (err, article) => {
            if (err) return next(err);
            res.redirect('/articles/'+ article.slug)
        });
    });
});


module.exports = router;
