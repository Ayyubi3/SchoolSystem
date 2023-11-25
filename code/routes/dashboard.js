
const path = require("path")
const { PATH_PUBLIC } = require("../index")









var express = require('express'),
    dashboardrouter = express.Router();


dashboardrouter




    .get('/dashboard', (req, res) => {

        if (!req.isAuthenticated()) {
            console.log("Not authenticated, redirect to \"/\"")
            req.flash("info", "Not logged in. Please Login or Register before continuing")
            res.redirect("/")

        } else {

            let Subjects = JSON.parse(require("fs").readFileSync("Subjects.json"))

            const UserSubjects = req.user["subjects"]
            Subjects = Subjects.filter(subject => UserSubjects.includes(subject.id));
            res.render(path.join(PATH_PUBLIC, "Dashboard", "index.ejs"), {Subjects})

        }



    })




module.exports = { dashboardrouter };

