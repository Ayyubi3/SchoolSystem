require('dotenv').config()
const express = require('express')
const app = express()
const session = require('express-session')
const methodOverride = require('method-override')
const bodyParser = require("body-parser")
const path = require("path")
var flash = require('connect-flash');

const { DatabaseHelper } = require("./Database.js")



const PATH_PUBLIC = path.join(__dirname, "..", "public")

module.exports = { PATH_PUBLIC }


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.set("view-engine", "ejs")




app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(flash())


const {UserSystem, passport} = require("./LoginSystem")
app.use(passport.initialize())
app.use(passport.session())
UserSystem.initialize(passport)



app.use(methodOverride('_method'))



app.get('/', async (req, res) =>  {


  let name = ""

  console.log("req.user")

  try { const user = await req.user;  name = JSON.parse(JSON.stringify(user))["surname"] } catch (error) { console.log(error) }


  res.render(path.join(PATH_PUBLIC, "HomePage", "index.ejs"), { loggedIn: req.isAuthenticated(), user: name, alertMessage: req.flash("info")[0]})
})

const { router } = require("./routes/login")

app.use(router)
const { dashboardrouter } = require("./routes/dashboard")

app.use(dashboardrouter)


const { courserouter } = require("./routes/courses")

app.use(courserouter)


const { filesrouter } = require("./routes/files")

app.use(filesrouter)

const { subjectsrouter } = require("./routes/subjects")

app.use(subjectsrouter)

const { createsubjectrouter } = require("./routes/createsubject")

app.use(createsubjectrouter)



app.listen(3000)

