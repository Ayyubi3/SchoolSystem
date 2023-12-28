const { passport } = require("../libs/PassportUtils.js")
const path = require("path")





var express = require('express'),
    registerrouter = express.Router();

registerrouter


    .get('/register', (req, res) => {

        const filepath = path.join(__dirname, "..", "..", "public", "register", "index.ejs")
        res.render(filepath, {message: req.flash("main")})

    })

    .post('/register', passport.authenticate("local-signup", { 
        successRedirect: "/login",
        failureRedirect: "/"
     }),
        (req, res, next) => {
        }
    )







module.exports = { registerrouter };