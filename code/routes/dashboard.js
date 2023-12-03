
const path = require("path")
const { PATH_PUBLIC } = require("../index")

const { DatabaseHelper } = require("../Database.js")









var express = require('express'),
    dashboardrouter = express.Router();


dashboardrouter




    .get('/dashboard', async (req, res) => {

        if (!req.isAuthenticated()) {
            console.log("Not authenticated, redirect to \"/\"")
            req.flash("info", "Not logged in. Please Login or Register before continuing")
            res.redirect("/")

        } else {

            console.log("s")

            console.log(req.user)
            let Subjects = await DatabaseHelper.GetSubjectsFromUser(req.user.id)
            console.log(Subjects)
            res.render(path.join(PATH_PUBLIC, "Dashboard", "index.ejs"), {Subjects})

        }



    })




module.exports = { dashboardrouter };

