require("dotenv").config()

const { logger } = require("./libs/LogUtils")
global.logger = logger

const express = require('express')
const app = express()

const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)

const flash = require("connect-flash")

const path = require("path")

app.set("views", path.join(__dirname, "..", "public")) 
app.set("view-engine", "ejs")

app.use(express.urlencoded({ extended: true }));
app.use(express.json());




const { Database, DatabaseUtils } = require("./libs/DatabaseUtils")
Database.init()



const SessionInstance = session({
	store: new pgSession({

		pool: Database.pool,
		tableName: 'session',
		createTableIfMissing: true
	}),
	name: 'SID',
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true,
	
	cookie: {
		maxAge: 1000 * 60 * 10,
		sameSite: true,
	}
})

module.exports = { SessionInstance }

app.use(SessionInstance)



const { passport } = require("./libs/PassportUtils")

app.use(passport.initialize());
app.use(passport.session());


const { io } = require("./libs/SocketUtils")




app.use(flash())

app.get('/', async (req, res) => {

	let name = ""
	if (req.user) {
		const user = await DatabaseUtils.getUserByID_o(await req.user["id"])
		name = ", " + user.firstname + " " + user.lastname
	}
	res.render("index/index.ejs", { user: name, message: req.flash("main") })
})




const { registerrouter } = require("./routes/register")
app.use(registerrouter)
const { loginrouter } = require("./routes/login")
app.use(loginrouter)


app.use(
	(req, res, next) => {
		if (req.isAuthenticated()) {
			return next();
		}
		res.redirect("/login");
	}
)



const { dashboardrouter } = require("./routes/dashboard")
app.use(dashboardrouter)
const { createcourserouter } = require("./routes/createscourse")
app.use(createcourserouter)
const { courserouter } = require("./routes/course")
app.use(courserouter)
const { profilerouter } = require("./routes/profile")
app.use(profilerouter)
const { filesrouter } = require("./routes/files")
app.use(filesrouter)








const port = process.env.EXPRESS_SERVER
app.listen(port, () => {
	logger.info(`Express Server gestartet -> PORT: ${port}`)
})

