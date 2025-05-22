// Installing and importing completed
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

// Schema Created
const Auth = new Schema({
    username: { type: String, unique: true },
    password: String
})

const Todo = new Schema({
    title: { type: String, unique: true },
    done: Boolean,
    userId: ObjectId
})

// Model
const AuthModel = mongoose.model('auth', Auth)
const TodoModel = mongoose.model('todos', Todo)

module.exports = {
    AuthModel: AuthModel,
    TodoModel: TodoModel
}