const path = require("path")
const { DatabaseUtils } = require("../libs/DatabaseUtils")
const { marked } = require("marked")
marked.use({
    breaks: true,
    gfm: true,
    //pedantic: true

})




var express = require('express'),
    courserouter = express.Router();

courserouter


    .get('/course/:id', async (req, res) => {
        const course = await DatabaseUtils.getCourseByID(req.params.id);

        if (course == false) {
            logger.warn("No course with id =" + req.params.id)
            res.send("No course with this id")
        } else {
            const filepath = path.join(__dirname, "..", "..", "public", "course", "index.ejs")


            // FIXME: No sanitiziation here
            // Markdown highlighter npm 
            course.code = marked.parse(course.html_markdown_code)

            const userID = await req.user["id"]

            let isCreator = false
            if (userID == course.creator_id) isCreator = true


            let isMember = isCreator
            if (!isMember) {
                let courses = await DatabaseUtils.getUserCourses(userID)
                if (courses)
                {
                    isMember = courses.some(element => element.id == course.id)

                }

            }


            res.render(filepath, { isMember, isCreator, course, error: req.flash("course") })

        }

    }



    )


    .post('/course/:id', async (req, res) => {

        const userID = await req.user["id"]

        const resp = await DatabaseUtils.userJoinCourse(req.params.id, userID)
        if (!resp) {
            logger.error("User " + userID + " couldnt join course " + req.params.id)
            req.flash("course", "Could not join " + req.params.id)
            res.send("Cant join this course!")
            return
        }
        res.send("Joined Course")

    }



    )


    .delete('/course/:id', async (req, res) => {
        const course = await DatabaseUtils.getCourseByID(req.params.id)
        if(!course)
        {
            res.send("Course doesnt exist")
        }
        const userID = await req.user["id"]
        let delCourse = false
        if (course.creator_id == userID) {
            delCourse = await DatabaseUtils.deleteCourse(req.params.id)
        }


        if (!delCourse) {
            req.flash("course", "Cant delete course")
        }
        logger.info("deleting course " + (req.params.id))




    }



    )




module.exports = { courserouter };