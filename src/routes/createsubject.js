const path = require("path")
const {DatabaseUtils} = require("../libs/DatabaseUtils")





var express = require('express'),
    createsubjectrouter = express.Router();

createsubjectrouter


    .get('/createsubject', (req, res) => {
        if (!req.isAuthenticated()) {
            // FIXME: Send a message to index. maybe flash
            res.redirect("/login");
        } else {

            const filepath = path.join(__dirname, "..", "..", "public", "createsubject", "index.ejs")
            res.render(filepath, {})
        }



    })


    .post('/createsubject', (req, res) => {
        if (!req.isAuthenticated()) {
            // FIXME dont know if this works
            console.log("Need to be authenticated to create subject")
            res.redirect("/login");
        } else {

            // FIXME mache gerade nichts mit speakers
            req.body.creator_id = req.user["id"]
            console.log(req.body)

            DatabaseUtils.createSubject(req.body)
        }

    })





module.exports = { createsubjectrouter };