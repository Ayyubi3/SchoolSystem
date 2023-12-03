
const path = require("path")
const { UserSystem, passport } = require("../LoginSystem")
const { PATH_PUBLIC } = require("../index")









var express = require('express'),
  router = express.Router();


router




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


    const user = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password
    }


    //Check if name is valid

    if (!(/^[A-Za-zÄäÖöÜüß ]+$/).test(user.name)) {

      req.flash("error", "Name is not a valid name!")
      return res.redirect("/register")
    }
    
    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(user.email)) {
      
      req.flash("error", "Email is not a valid Email!")
      return res.redirect("/register")
      
    }
    
    console.log(user)
    if (!UserSystem.addUser(user.firstname, user.lastname, user.email, user.password)) 
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





module.exports = { router };
