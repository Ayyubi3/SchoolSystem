require("dotenv").config()

const express = require('express')
const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.EXPRESS_SERVER_PORT
app.listen(port, () => {
})
