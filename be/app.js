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

function auth(req, res, next) {
    console.log("req :", req);

    console.log("req.headers['token'] :", req.headers['token'])
    const token = req.headers['token']
    console.log("Token :", token)
    let foundUser;
    if (token) {
        foundUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
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
        console.log("Hash Password :", hashPassword)

        user = await AuthModel.create({
            username: username,
            password: hashPassword
        })
    } catch (e) {
        errorFound = true;
        console.log("Error :", e)
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
    console.log("Found User :", foundUser)

    if (foundUser) {
        console.log("Found User Password signin :", foundUser.password);
        console.log("Password :", password);
        const passwordMatch = await bcrypt.compare(password, foundUser.password);
        console.log("Password Match:", passwordMatch);
        if (passwordMatch) {
            let token = jwt.sign({ id: foundUser._id.toString() }, process.env.ACCESS_TOKEN_SECRET)
            res.status(200).send(token)
        } else {
            console.log(" In Wrong Password")
            res.send({
                message: "Wrong password."
            })
        }
    } else {
        res.send({
            message: 'You are a new User, Signup.'
        })
    }
    // let foundUser = users.find(user => user.username == username)
    // if (foundUser) {
    //     if (foundUser.password === password) {
    //         let token = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET)
    //         res.status(200).send(token)
    //     } else {
    //         res.send({
    //             message: 'Wrong password.'
    //         })
    //     }
    // }
})

app.post('/todo', async (req, res) => {
    console.log("Todo endpoint triggered.")
    console.log("Request : ", req.body)
    console.log("Request userId : ", req.body.userId)
    let userId = req.body.userId;
    console.log("UserId :", userId);

    try{let todo = await TodoModel.create({
        title: req.body.inputText,
        userId,
        done: false
    })}catch(error){
        console.log("error :", error);
    }
    let todos = await TodoModel.find({
        userId
    })
    console.log("All the Todos Corresponding to this specific userId", todos)
    res.json({
        todos,
        message: "Todo Created Succesfully"
    })
})
app.get('/todos', async(req, res)=>{
    console.log("Request : ", req);
    const userId = req.headers.userid
    console.log("UserId : ", userId);
    let todos = await TodoModel.find({
        userId
    })
    console.log("Todos List :", todos);
    res.json({
        todos
    })
})
app.get('/users', (req, res) => {
    res.json({
        users
    })
})

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