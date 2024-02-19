const { passport } = require("../libs/PassportUtils.js")
const path = require("path")



var express = require('express'),
  loginrouter = express.Router();

loginrouter


  .get('/login', (req, res) => {

    res.render("login/index.ejs", { message: req.flash("main") })

  })



  .post('/login', (req, res, next) => {
    passport.authenticate("local-login", (err, user, info) => {
      if (err) {
        req.flash("main", err)
        return res.redirect("/login")
      }
      if (!user) { return res.redirect("/login") }

      req.login(user, () => res.redirect("/"))
    })(req, res, next)
  })


  .post('/logout', (req, res) => {

    req.logout((err) => {
      logger.info(err ? err : "Log out")
    })

    res.redirect("/")

  })






module.exports = { loginrouter };
