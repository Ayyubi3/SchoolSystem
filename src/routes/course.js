const path = require("path")
const {DatabaseUtils} = require("../libs/DatabaseUtils")





var express = require('express'),
    courserouter = express.Router();

    courserouter


    .get('/course/:id', async (req, res) => {

        if (!req.isAuthenticated()) {

            res.redirect("/login");

        } else {

            const course = await DatabaseUtils.getCourseByID(req.params.id);

            if(course == false)
            {
                logger.warn("No course with id =" + req.params.id)
                res.send("No course with this id")
            } else {
                const filepath = path.join(__dirname, "..", "..", "public", "course", "index.ejs")
                res.render(filepath, {course})

            }

        }



    })


    .post('/course/:id', async(req, res) => {

        if (!req.isAuthenticated()) {

            res.redirect("/login");

        } else {
            const userID = await req.user["id"]

            const res = await DatabaseUtils.userJoinCourse(req.params.id, userID)
            if (!res) logger.error("User " + userID + " couldnt join course " + req.params.id)

        }



    })





module.exports = { courserouter };