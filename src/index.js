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
const { Database, DatabaseUtils } = require("./libs/DatabaseUtils")
Database.init()

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
const { passport } = require("./libs/PassportUtils")

app.use(passport.initialize());
app.use(passport.session());



app.get('/', async (req, res) => {

    let name = ""
    if (req.user) {
        const user = await DatabaseUtils.getUserByID(await req.user["id"])
        name = ", " + user.firstname + " " + user.lastname
    }
    res.render(require("path").join("..", "public", "index", "index.ejs"), { user: name, alertMessage: null })
})



const { registerrouter } = require("./routes/register")
app.use(registerrouter)
const { loginrouter } = require("./routes/login")
app.use(loginrouter)
const { dashboardrouter } = require("./routes/dashboard")
app.use(dashboardrouter)
const { createcourserouter } = require("./routes/createscourse")
app.use(createcourserouter)
const { courserouter } = require("./routes/course")
app.use(courserouter)








app.listen(port, () => {
    console.log(`Express Server gestartet -> PORT: ${port}`)
})





async function test()
{
    console.log("TESTS")
    await Database.exec("BEGIN")

    await DatabaseUtils.createUser("test", "test", "test2", "test")
    await DatabaseUtils.createUser("test", "test", "test", "test", 123321)

    const user1 = await DatabaseUtils.getUserByID(123321)
    const user2exists = await DatabaseUtils.emailExists("test2")

    console.log(user1)
    console.log(user2exists)


    await DatabaseUtils.createCourse("test", "test", 123321, 1231)
    await DatabaseUtils.createCourse("test2", "tes2t", 123321)


    console.log(await DatabaseUtils.getCourseByID(1231))




    await Database.exec("ROLLBACK")
}

test()