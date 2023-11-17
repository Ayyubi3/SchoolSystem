
require('dotenv').config()
const path = require("path")
const { checkNotAuthenticated, addUser } = require("../LoginSystem")
const {PATH_PUBLIC, passport} = require("../index")









var express = require('express'),
    router = express.Router();


router




    .get('/login', checkNotAuthenticated, (req, res) => {
      res.render(path.join(PATH_PUBLIC, "Login", "index.ejs"), {  })
    })





    .post('/login', checkNotAuthenticated, passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
    }))


    .get('/register', checkNotAuthenticated, (req, res) => {
      res.render(path.join(PATH_PUBLIC, "Register", "index.ejs"), {  })
    })

    .post('/register', checkNotAuthenticated, async (req, res) => {

      addUser(req.body.email, req.body.password, req.body.name, Date.now().toString()) ? res.redirect("/login") : res.redirect("/register")

    })


    .delete('/logout', (req, res) => {

        req.logout(function (err) {
            if (err) { console.log(err); }
        }); res.redirect('/')
    })





module.exports = {router};