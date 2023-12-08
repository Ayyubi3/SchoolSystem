require("dotenv").config()

const express = require('express')
const app = express()

const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)


const port = process.env.SERVER_PORT


app.set("view-engine", "ejs")

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Database Configuration
const { Database } = require("./libs/DatabaseUtils")

// Express Session Configuration
const sessionConfig = {
    store: new pgSession({

        pool: Database.pool,
        tableName: 'session'
    }),
    name: 'SID',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 10,
        aameSite: true,
    }
}

app.use(session(sessionConfig))



// Passport Configuration
const passport = require("./libs/PassportUtils")


app.get('/', async (req, res) => {

    console.log(req.session.passport.user.email)
    res.render(require("path").join("..", "public", "index", "index.ejs"), { loggedIn: false, user: req.session.passport.user.email, alertMessage: null })
})



const { registerrouter } = require("./routes/register")
app.use(registerrouter)
const { loginrouter } = require("./routes/login")
app.use(loginrouter)





app.listen(port, () => {
    console.log(`Express Server gestartet -> PORT: ${port}`)
})