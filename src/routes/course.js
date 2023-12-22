const path = require("path")
const { DatabaseUtils } = require("../libs/DatabaseUtils")

const { marked } = require("marked")

marked.use({
    breaks: true,
    gfm: true
})



var express = require('express'),
    courserouter = express.Router();

courserouter

    .get('/course/:id', async (req, res) => {

        const course = await DatabaseUtils.getCourseByID(req.params.id);

        if (course == false) {
            logger.warn("No course with id =" + req.params.id)
            res.send("No course with this id")
            return
        }



        // FIXME: No sanitiziation here | Markdown highlighter npm 

        course.code = marked.parse(course.html_markdown_code)

        const userID = await req.user["id"]

        let isCreator = false
        if (userID == course.creator_id) {
            isCreator = true
            isMember = true
        }

        if (!isMember) {

            let courses = await DatabaseUtils.getUserCourses(userID)

            if (!course) logger.error("Couldnt get courses")

            isMember = courses.some(element => element.id == course.id)

        }

        const filepath = path.join(__dirname, "..", "..", "public", "course", "index.ejs")

        res.render(filepath, { isMember, isCreator, course, message: req.flash("main") })


    }



    )


    .post('/course/:id', async (req, res) => {

        const userID = await req.user["id"]

        const resp = await DatabaseUtils.userJoinCourse(req.params.id, userID)

        if (!resp) {
            logger.error("User " + userID + " couldnt join course " + req.params.id)
            req.flash("main", "Could not join " + req.params.id)
            res.send("Cant join this course!")
            return
        }

        res.send("Joined Course")

        res.redirect("/course/" + req.params.id)

    })


    .put('/course/:id', async (req, res) => {


        const user_ID = await req.user["id"]

        const data = await DatabaseUtils.updateCourse(user_ID, req.params.id, req.body.name, req.body.html_markdown_code)

        if(!data)
        {
            logger.error("User " + user_ID + " couldnt update course " + req.params.id)
            req.flash("main", "Could not update " + req.params.id)
            res.send("Cant update this course!")
            return
        }

        req.flash("main", "Updated course")

        // FIXME Cant redirect user to update new data 
    })


    .delete('/course/:id', async (req, res) => {

        const course = await DatabaseUtils.getCourseByID(req.params.id)

        if (!course) {
            res.send("Course doesnt exist")
        }

        const userID = await req.user["id"]

        let deleteCourse = false
        if (course.creator_id == userID) {
            deleteCourse = await DatabaseUtils.deleteCourse(req.params.id)
        }


        if (!deleteCourse) {
            req.flash("main", "Cant delete course")
            logger.error("Couldnt delete course")
        }

        logger.info("deleting course " + (req.params.id))


        // FIXME Cant redirect user to update new data 


    })




module.exports = { courserouter };