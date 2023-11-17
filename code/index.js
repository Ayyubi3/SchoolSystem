require('dotenv').config()
const express = require('express')
const app = express()
const passport = require('passport')
const session = require('express-session')
const methodOverride = require('method-override')
const bodyParser = require("body-parser")
const path = require("path")

const { initialize } = require("./LoginSystem")





const PATH_PUBLIC = path.join(__dirname, "..", "public")
module.exports = { PATH_PUBLIC, passport }



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




app.use(express.static(path.join(PATH_PUBLIC)))
app.set("view-engine", "ejs")






app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))


app.use(passport.initialize())
app.use(passport.session())
initialize(passport)
app.use(methodOverride('_method'))




app.get('/', (req, res) => {
  console.log(req.user.name.toString())
  res.render(path.join(PATH_PUBLIC, "HomePage", "index.ejs"), { loggedIn: req.isAuthenticated(), user: JSON.stringify(req.user["email"]) })
})
const { router } = require("./routes/login")

app.use(router)




app.listen(3000)

