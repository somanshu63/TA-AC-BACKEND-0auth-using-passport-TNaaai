var express = require('express');
const article = require('../models/article');
var router = express.Router();
var Comment = require('../models/comment');


//open update comment form
router.get('/:id/edit', (req, res, next) => {
    var id = req.params.id;
    Comment.findById(id).populate('articleId').exec((err, comment) => {
        if(err) return next(err);
        if(comment.author == req.user.id){
            res.render('commentUpdateForm', {comment})
        }else{
            req.flash('error', 'you are not the author of this comment');
            res.redirect('/articles/'+ comment.articleId.slug);
        }
    });
});

//update comment
router.post('/:id', (req, res, next) => {
    var id = req.params.id;
    Comment.findByIdAndUpdate(id, req.body, (err, comment) => {
        if(err) return next(err);
        article.findById(comment.articleId, (err, article) => {
            if(err) return next(err);
            res.redirect('/articles/' + article.slug)
        });
    });
});

//delete comment
router.get('/:id/delete', (req, res, next) => {
    var id = req.params.id;
    Comment.findById(id, (err, comment) => {
        if(err) return next(err);
        if(comment.author == req.user.id){
            Comment.findByIdAndDelete(id).populate('articleId').exec((err, comment) => {
                if(err) return next(err);
                req.flash('error', 'comment deleted');
                res.redirect('/articles/'+ comment.articleId.slug);
            });
        }else{
            req.flash('error', 'you are not the author of this comment');
            res.redirect('/articles/'+ comment.articleId.slug);
        }
    });
});

module.exports = router;
