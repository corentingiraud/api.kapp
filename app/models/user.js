const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
    local : {
        username: String,
        password: String,
        code: String,
        role: String,
    },
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.validCode = function(code) {
    return bcrypt.compareSync(code, this.local.code);
};

module.exports = mongoose.model('User', userSchema); 
