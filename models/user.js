const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: {type: String, required: [true, 'Cannot be empty.']},
    lastName: {type: String, required: [true, 'Cannot be empty.']},
    email: {type: String, required: [true, 'Cannot be empty.'], unique: true},
    password: {type: String, required: [true, 'Cannot be empty'],
                minlength: [8, 'Password should have at least 8 characters.'],
            maxlength: [64, 'Password can only have up to 64 characters.']}
});

//replace plaintext password with hashed password before saving the document in the database
//pre middleware

userSchema.pre('save', function(next){
    let user = this;
    if(!user.isModified('password'))
        return next();
    bcrypt.hash(user.password, 10)
    .then(hash=>{
        user.password = hash;
        next();
    })
    .catch(err=>next(err));
});

//implement a method to compare the login password and the hash stored in the database

userSchema.methods.comparePassword = function(loginPassword) {
    return bcrypt.compare(loginPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);