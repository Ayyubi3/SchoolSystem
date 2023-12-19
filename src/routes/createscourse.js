const path = require("path")
const { DatabaseUtils } = require("../libs/DatabaseUtils")





var express = require('express'),
    createcourserouter = express.Router();

createcourserouter


    .get('/createcourse', (req, res) => {
        if (!req.isAuthenticated()) {
            res.redirect("/login");
        } else {

            const filepath = path.join(__dirname, "..", "..", "public", "createcourse", "index.ejs")
            res.render(filepath, {})
        }



    })


    .post('/createcourse', async (req, res) => {
        if (!req.isAuthenticated()) {
            res.redirect("/login");
        } else {

            // FIXME mache gerade nichts mit speakers
            req.body.creator_id = await req.user["id"]

            const course = await DatabaseUtils.createCourse(req.body.name, req.body.html_markdown_code, req.body.creator_id)
            if (!course) {
                logger.error(req.body + " couldnt be created")
                res.redirect("/createcourse")
            }
            await DatabaseUtils.userJoinCourse(course.id, req.user["id"])

            res.redirect("/course/" + course.id)
        }

    })





module.exports = { createcourserouter };