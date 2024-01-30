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

        const [data, error] = await DatabaseUtils.createCourse(req.body.name, req.body.html_markdown_code.replace(/`/g, '\\`'), await req.user["id"])
        
        if (error) {
            req.flash("main", "Could not create course")
            res.redirect("/createcourse")
            return

        }
        course = data
        console.log(course)

        console.log(await DatabaseUtils.userJoinCourse(course.id, req.body.creator_id))

        logger.info(req.body.creator_id + " creates " + req.body.name)

        res.redirect("/course/" + course.id)

    })





module.exports = { createcourserouter };