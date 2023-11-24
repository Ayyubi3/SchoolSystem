
const path = require("path")
const { addUser, passport } = require("../LoginSystem")
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
      name: req.body.name,
      email: req.body.email,
      pw: req.body.password
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
    
    
    if (!addUser(user.email, user.pw, user.name, Date.now().toString())) 
    {
      req.flash("error", "Adding user failed"); 
      console.log("asdasd")
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
