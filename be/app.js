require('dotenv').config()
require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const cors = require('cors')
const { z } = require('zod')
const bcrypt = require('bcrypt')
const { AuthModel, TodoModel } = require('./db')

app.use(express.json())
app.use(cors())

mongoose.connect('mongodb+srv://yashdeep:yashdeep2000@cluster0.vlrglmq.mongodb.net/quietly')

let port = 3000;
let users = []

async function auth(req, res, next) {
    const token = req.headers['token']
    let foundUser;
    if (token) {
        foundUser = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if (foundUser) {
            req.user = foundUser
            next()
        } else {
            res.status(401).json({
                message: 'Unauthorized!'
            })
        }
    } else {
        res.status(401).json({
            message: 'Unauthorized!'
        })
    }
}

app.post('/signup', async (req, res) => {
    const requiredCred = z.object({
        username: z.string(),
        password: z.string().regex(new RegExp('(?=.*?[a-z]).{8,}$'), {
            message:
                'Password must be at least 8 characters long'
        })
    })
    const parsedDataWithSuccess = requiredCred.safeParse(req.body)
    if (!parsedDataWithSuccess.success) {
        res.send({
            message: "Incorrect Format",
            error: parsedDataWithSuccess.error
        })
        return;
    }
    let user = null;
    let username = req.body.username.toLowerCase();
    let password = req.body.password;
    let errorFound = false;
    let foundUser = await AuthModel.findOne({
        username
    })
    if (foundUser) {
        res.send({
            message: 'Already have account.'
        })
    }
    try {
        let hashPassword = await bcrypt.hash(password, 5)

        user = await AuthModel.create({
            username: username,
            password: hashPassword
        })
    } catch (e) {
        errorFound = true;
    }

    if (!errorFound) {
        let token = jwt.sign({ id: user._id.toString() }, process.env.ACCESS_TOKEN_SECRET)
        res.status(200).send({
            token,
            username
        })
    }

})

app.post('/signin', async (req, res) => {
    let username = req.body.username.toLowerCase();
    let password = req.body.password;

    let foundUser = await AuthModel.findOne({
        username
    })

    if (foundUser) {
        const passwordMatch = await bcrypt.compare(password, foundUser.password);
        if (passwordMatch) {
            let token = jwt.sign({ id: foundUser._id.toString() }, process.env.ACCESS_TOKEN_SECRET)
            res.status(200).send(token)
        } else {
            res.send({
                message: "Wrong password."
            })
        }
    } else {
        res.send({
            message: 'You are a new User, Signup.'
        })
    }
})

app.post('/todo', async (req, res) => {
    let userId = req.body.userId;

    try {
        let todo = await TodoModel.create({
            title: req.body.inputText,
            userId,
            done: false
        })
    } catch (error) {
        console.log("error :", error);
    }
    let todos = await TodoModel.find({
        userId
    })
    res.json({
        todos,
        message: "Todo Created Succesfully"
    })
})

app.post('/delete-todo', async (req, res) => {
    let title = req.body.title;
    if (title.trim()) {
        let todoFound = await TodoModel.findOne({
            title: title
        })
        if (todoFound != null) {
            let id = todoFound._id;
            let deleted = await TodoModel.deleteOne({ _id: id })

            if (deleted.deletedCount) {
                res.json({
                    message: "Todo deleted!",
                    verdict: deleted.deletedCount
                })
            } else {
                res.json({
                    message: "Couldn't delete todo for some reason",
                    verdict: deleted.deletedCount
                })
            }
        } else {
            res.json({
                message: "Todo doesn't exists!"
            })
        }

    }
})

app.post('/update-todo', async (req, res) => {
    let title = req.body.title;
    let updateTitle = req.body.updatedText;
    let updateTodo = await TodoModel.updateOne({ title: title }, { title: updateTitle })
    let titleFound = updateTodo.matchedCount;
    let titleModified = updateTodo.modifiedCount;
    if (titleFound && titleModified) {
        res.json({
            verdict:1,
            message: "Todo successfully modified!"
        })
    } else if (titleFound) {
        res.json({
            verdict: 0,
            message: "Todo with this title found, but couldn't update for some reason"
        })
    }
    else {
        res.json({
            verdict: 0,
            message: "Todo with this title doesn't exist"
        })
    }
})

app.get('/todos', async (req, res) => {
    const userId = req.headers.userid
    let todos = await TodoModel.find({
        userId
    })
    res.json({
        todos
    })
})

// app.get('/users', (req, res) => {
//     res.json({
//         users
//     })
// })

app.get("/dashboard", auth, function (req, res) {
    res.sendFile(__dirname + "/public/dashboard.html");
})

app.get('/me', auth, async (req, res) => {
    const user = req.user;
    let foundUser = await AuthModel.findById(user.id);
    res.status(201).send({
        username: foundUser.username,
        id: user.id
    })
})

// The Dashboard Section:
var tasks = [[], []]

app.listen(port, () => {
    console.log(`listening at port ${port}`);
})