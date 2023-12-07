require("dotenv").config()

const express = require('express')
const app = express()

const session = require('express-session')
const bodyParser = require("body-parser")

const port = process.env.SERVER_PORT


app.set("view-engine", "ejs")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.get('/', (req, res) => {
    res.render(require("path").join("..", "public", "index", "index.ejs"), {loggedIn: false, user: "Max", alertMessage: null})
})

app.listen(port, () => {
  console.log(`Express Server gestartet -> PORT: ${port}`)
})