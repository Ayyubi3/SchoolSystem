
const path = require("path")
const { UserSystem, passport } = require("../LoginSystem")
const { PATH_PUBLIC } = require("../index")





var express = require('express'),
loginrouter = express.Router();

  loginrouter


  .get('/login', (req, res) => {
    res.render(path.join(PATH_PUBLIC, "Login", "index.ejs"), {})
  })


  .post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  }))


  .get('/register', (req, res) => {
    res.render(path.join(PATH_PUBLIC, "Register", "index.ejs"), {errorMessages: req.flash("error")})
  })

  .post('/register', async (req, res) => {



    console.log("Registering " + JSON.stringify(req.body))

    if (!UserSystem.addUser(req.body.firstname, req.body.lastname, req.body.email, req.body.password)) 
    {
      req.flash("error", "Adding user failed"); 
      return res.redirect("/register");
    }

    return res.redirect("/login")

  })


  .delete('/logout', (req, res) => {

    req.logout(function (err) {
      if (err) { console.log(err); }
    }); res.redirect('/')
  })





module.exports = { loginrouter };
