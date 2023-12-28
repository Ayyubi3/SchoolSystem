const path = require("path")
const { DatabaseUtils } = require("../libs/DatabaseUtils")





var express = require('express'),
    createcourserouter = express.Router();

createcourserouter


    .get('/createcourse', (req, res) => {

        const filepath = path.join(__dirname, "..", "..", "public", "createcourse", "index.ejs")
        res.render(filepath, { message: req.flash("main") })

    })


    .post('/createcourse', async (req, res) => {

        req.body.creator_id = await req.user["id"]

        const course = await DatabaseUtils.createCourse(req.body.name, req.body.html_markdown_code, req.body.creator_id)
        if (!course) {
            logger.error(req.body + " couldnt be created")
            req.flash("main", "Could not create course")
            res.redirect("/createcourse")
            return

        }
        console.log(course)

        console.log(await DatabaseUtils.userJoinCourse(course.id, req.body.creator_id))

        logger.info(req.body.creator_id + " creates " + req.body.name)

        res.redirect("/course/" + course.id)

    })





module.exports = { createcourserouter };