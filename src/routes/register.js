const { passport } = require("../libs/PassportUtils.js")
const path = require("path")





var express = require('express'),
    registerrouter = express.Router();

registerrouter


    .get('/register', (req, res) => {

        res.render("register/index.ejs", {message: req.flash("main")})

    })

    .post('/register', (req, res, next) => {
        passport.authenticate('local-signup', (err, user, info) => {
            if(err) {
                req.flash("main", err)
                return res.redirect(400, "/register")
            }
            if(!user) { return res.redirect(500, "/login") }

            req.login(user, () => res.redirect(200, "/"));
            
        })(req, res);
    });







module.exports = { registerrouter };