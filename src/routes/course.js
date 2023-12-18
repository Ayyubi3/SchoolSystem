const path = require("path")
const {DatabaseUtils} = require("../libs/DatabaseUtils")





var express = require('express'),
    courserouter = express.Router();

    courserouter


    .get('/course/:id', async (req, res) => {

        if (!req.isAuthenticated()) {
            // FIXME: Send a message to index. maybe flash
            res.redirect("/login");
        } else {

            const course = await DatabaseUtils.getCourseByID(req.params.id);
            if(course == false)
            {
                console.info("No course with id =" + req.params.id)
                res.send("No course with this id")
            } else {
                const filepath = path.join(__dirname, "..", "..", "public", "course", "index.ejs")
                res.render(filepath, {course})

            }

        }



    })


    .post('/course/:id', async(req, res) => {

        if (!req.isAuthenticated()) {
            // FIXME: Send a message to index. maybe flash
            res.redirect("/login");
        } else {


            DatabaseUtils.userJoinCourse(req.params.id, await req.user["id"])

        }



    })





module.exports = { courserouter };