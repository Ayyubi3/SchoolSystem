require("dotenv").config()

const express = require('express')
const app = express()

const port = process.env.SERVER_PORT


app.set("view-engine", "ejs")

app.get('/', (req, res) => {
    res.render(require("path").join("..", "public", "index", "index.ejs"), {loggedIn: false, user: "Max", alertMessage: null})
})

app.listen(port, () => {
  console.log(`Express Server gestartet -> PORT: ${port}`)
})