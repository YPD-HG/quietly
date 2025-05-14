require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const cors = require('cors')
const { z } = require('zod')
const bcrypt = require('bcrypt')
const { AuthModel } = require('./db')

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
        password: z.string().regex(new RegExp('(?=.*?[a-z])(?=.*?[0-9]).{8,}$'), {
            message:
                'Password must be at least 8 characters and contain an uppercase letter, lowercase letter, and number'
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
        res.status(200).send(token)
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

app.get('/users', (req, res) => {
    res.json({
        users
    })
})

app.get("/dashboard", auth, function (req, res) {
    res.sendFile(__dirname + "/public/dashboard.html");
})

app.get('/me', auth, (req, res) => {
    const user = req.user;
    res.status(201).send({
        user
    })
})

// The Dashboard Section:
var tasks = [[], []]

app.listen(port, () => {
    console.log(`listening at port ${port}`);

})