const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
});

// By default passport-local-mongoose ek username, hashed password, hashing , salting khud hi add kr dega so we added only email feild in above schema .It also provides methods such as authenticate() and we dont have to code anything from scratch.

userSchema.plugin(passportLocalMongoose); 

module.exports = mongoose.model('User', userSchema);