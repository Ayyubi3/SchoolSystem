require('dotenv').config()
const express = require('express')
const app = express()
const session = require('express-session')
const methodOverride = require('method-override')
const bodyParser = require("body-parser")
const path = require("path")
var flash = require('connect-flash');


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



app.get('/', (req, res) => {


  let name = ""

  try { name = req.user["name"]; } catch (error) {}


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

const { joinrouter } = require("./routes/join")

app.use(joinrouter)



app.listen(3000)

