
const path = require("path")
const { PATH_PUBLIC } = require("../index")
const { getUsers } = require("../LoginSystem")









var express = require('express'),
    courserouter = express.Router();


courserouter




    .get('/courses/:id', (req, res) => {

        if (!req.isAuthenticated()) {
            console.log("Not authenticated, redirect to \"/\"")
            req.flash("info", "Not logged in. Please Login or Register before continuing")
            res.redirect("/")

        } else {

            const subjects = JSON.parse(require("fs").readFileSync("Subjects.json"))
            const obj = subjects.find(obj => obj.id == req.params.id)
            res.send(obj)



        }



    })




module.exports = { courserouter };

