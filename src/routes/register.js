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
                return res.redirect("/register")
            }
            if(!user) { return res.redirect("/login") }

            req.login(user, () => res.redirect("/"));
            
        })(req, res);
    });







module.exports = { registerrouter };