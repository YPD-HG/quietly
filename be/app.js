require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const cors = require('cors')

app.use(express.json())
app.use(cors())

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

app.post('/signup', (req, res) => {
    let username = req.body.username.toLowerCase();
    let password = req.body.password;

    let foundUser = users.find(user => user.username == username)
    if (foundUser) {
        res.send({
            message: 'Already have account.'
        })
    } else {
        let user = { username: username, password: password }
        users.push(user)
        let token = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET)
        res.status(200).send(token)
    }
})

app.post('/signin', (req, res) => {
    let username = req.body.username.toLowerCase();
    let password = req.body.password;

    let foundUser = users.find(user => user.username == username)
    if (foundUser) {
        if (foundUser.password === password) {
            let token = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET)
            res.status(200).send(token)
        } else {
            res.send({
                message: 'Wrong password.'
            })
        }
    } else {
        res.send({
            message: 'You are a new User, Signup.'
        })
    }
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

app.listen(port, () => {
    console.log(`listening at port ${port}`);

})