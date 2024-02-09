const { DatabaseUtils } = require("../libs/DatabaseUtils.js");
const { passport } = require("../libs/PassportUtils.js")
const path = require("path")





var express = require('express'),
  dashboardrouter = express.Router();

dashboardrouter


  .get('/dashboard', async (req, res) => {

    const [data, error] = await DatabaseUtils.getUserCourses(await req.user["id"])
    if (error) {
      res.flash("main", "Fehler bei der Suche nach deinen Kursen")
      res.redirect("/")
      return
    }

    console.log(data)

    res.render("dashboard/index.ejs", { Courses: data, message: req.flash("main") })

  })


module.exports = { dashboardrouter };
