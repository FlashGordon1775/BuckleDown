'use strict'

const SALT = 10

var mongoose = require('mongoose');
    
var bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema( {
    name: {type: String},
    email: {type:String},
    password: {type: String}, //encrypted
    role: { type: String}, // either "Mentee" or "Mentor"
    exp: {type: Number},
    about: {type: String},
    area: {type: String}, //Area of focus for mentors and mentees. 
    created: {
            type: Number,
            default: () => Date.now()
        }
    });


// hash passwords before saving them
userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if ( !user.isModified('password') ) {
        return next();
    }
    // generate a salt
    bcrypt.genSalt(SALT, (saltErr, salt) => {
        if (saltErr) {
            return next(saltErr);
        }
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, (hashErr, hash) => {
            if (hashErr) {
                return next(hashErr);
            }
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
})

module.exports = mongoose.model('User', userSchema);
