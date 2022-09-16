var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    title: String,
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    articleId: {type: Schema.Types.ObjectId, ref: 'Article'}
});

module.exports = mongoose.model('Comment', commentSchema);