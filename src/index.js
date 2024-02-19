require("dotenv").config()

const express = require('express')
const app = express()


const { Database, DatabaseUtils } = require("./utils/Database.utils")
Database.init()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", require("./route/router"))

app.use("/", express.static(require("path").join(__dirname, "view")))

const port = process.env.EXPRESS_SERVER_PORT
app.listen(port, () => {
  console.log(`Listening to ${port}`)
})
