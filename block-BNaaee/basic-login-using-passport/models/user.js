var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt')

var userSchema = new Schema({
    name: String,
    email: {type: String, unique: true},
    username: {type: String, unique: true},
    password: {type: String, required: true}
});

userSchema.pre('save', function(next) {
    if(this.password && this.isModified('password')){
        bcrypt.hash(this.password, 10, (err, hash) => {
            this.password = hash;
            console.log(this.password)
            next();
        });
    }
    else{
        next();
    }
});

userSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, (err, result) => {
        return cb(err, result);
    });
}

module.exports = mongoose.model('User', userSchema);