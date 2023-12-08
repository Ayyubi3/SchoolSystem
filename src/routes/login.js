const { passport } = require("../libs/PassportUtils.js")
const path = require("path")





var express = require('express'),
    loginrouter = express.Router();

loginrouter


    .get('/login', (req, res) => {

        const filepath = path.join(__dirname, "..", "..", "public", "login", "index.ejs")
        res.render(filepath)

    })

    .post('/login', passport.authenticate("local-login", {}),
        (req, res, next) => {
            res.json({ user: req.user });
        }
    )





module.exports = { loginrouter };