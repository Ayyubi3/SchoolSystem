const { passport } = require("../libs/PassportUtils.js")
const path = require("path")





var express = require('express'),
    registerrouter = express.Router();

registerrouter


    .get('/register', (req, res) => {

        const filepath = path.join(__dirname, "..", "..", "public", "register", "index.ejs")
        res.render(filepath)

    })

    .post('/register', passport.authenticate("local-signup", {  }),
        (req, res, next) => {
            res.redirect("/login")
        }
    )








module.exports = { registerrouter };