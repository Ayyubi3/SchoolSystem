const path = require("path")
const {DatabaseUtils} = require("../libs/DatabaseUtils")





var express = require('express'),
    createcourserouter = express.Router();

    createcourserouter


    .get('/createcourse', (req, res) => {
        if (!req.isAuthenticated()) {
            // FIXME: Send a message to index. maybe flash
            res.redirect("/login");
        } else {

            const filepath = path.join(__dirname, "..", "..", "public", "createcourse", "index.ejs")
            res.render(filepath, {})
        }



    })


    .post('/createcourse', (req, res) => {
        if (!req.isAuthenticated()) {
            // FIXME dont know if this works
            console.log("Need to be authenticated to create subject")
            res.redirect("/login");
        } else {

            // FIXME mache gerade nichts mit speakers
            req.body.creator_id = req.user["id"]
            console.log(req.body)

            DatabaseUtils.createCourse(req.body)
        }

    })





module.exports = { createcourserouter };