// Installing and importing completed
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema Created
const Auth = new Schema({
    username: { type: String, unique: true },
    password: String
})

// Model
const AuthModel = mongoose.model('auth', Auth)

module.exports = {
    AuthModel: AuthModel
}