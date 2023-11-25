const {DB} = require("../DB")










var express = require('express'),
    courserouter = express.Router();


courserouter




    .get('/courses/:id', (req, res) => {

        if (!req.isAuthenticated()) {
            console.log("Not authenticated, redirect to \"/\"")
            req.flash("info", "Not logged in. Please Login or Register before continuing")
            res.redirect("/")

        } else {

            const subjects = DB.read(DB.Databases.SUBJECTS)
            const obj = subjects.find(obj => obj.id == req.params.id)
            res.send(obj)



        }



    })




module.exports = { courserouter };

