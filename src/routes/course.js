const path = require("path")
const { DatabaseUtils } = require("../libs/DatabaseUtils")

const markdownit = require('markdown-it')
const md = markdownit({
    linkify: true,
    typographer: true
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

        course.code = md.render(course.html_markdown_code)


        console.log(course.code)

        let user = await DatabaseUtils.getUserByID(await req.user["id"])



        let isCreator = false
        let isMember = false
        if (user.id == course.creator_id) {
            isCreator = true
            isMember = true
        }

        if (!isMember) {


            let courses = await DatabaseUtils.getUserCourses(user.id)

            if (!course) { logger.error("Couldnt get courses"); return }

            isMember = courses.some(element => element.id == course.id)

        }






        const CourseMessages = await DatabaseUtils.getMessagesFromCourse(req.params.id)



        let outputMessages = []
        CourseMessages.forEach(async element => {

            outputMessages.push(
                {

                    message: element,
                    side: element.user_id == user.id ? "right" : "left"
                }
            )


        });



        const filepath = path.join(__dirname, "..", "..", "public", "course", "index.ejs")
        const style = require("fs").readFileSync(path.join(__dirname, "..", "..", "public", "course", "style.css"))
        res.render(filepath, {
            user,
            course,

            isMember, isCreator,

            outputMessages,

            style,
            message: req.flash("main")
        })
    })



    .get('/course/:id/edit', async (req, res) => {

        const course = await DatabaseUtils.getCourseByID(req.params.id)

        if (!course) {
            res.send("Course doesnt exist")
            return
        }

        const userID = await req.user["id"]

        let canEdit = course.creator_id == userID

        if (!canEdit) {
            res.send("Dont have the rights to edit")
            return
        }

        const filepath = path.join(__dirname, "..", "..", "public", "editcourse", "index.ejs")


        const url = "/course/" + course.id

        res.render(filepath, { url, course, message: req.flash("main") })


    })



    .post('/course/:id', async (req, res) => {

        const userID = await req.user["id"]

        const resp = await DatabaseUtils.userJoinCourse(req.params.id, userID)

        if (!resp) {
            logger.error("User " + userID + " couldnt join course " + req.params.id)
            req.flash("main", "Could not join " + req.params.id)
            res.send("Cant join this course!")
            return
        }

        console.log("res")

        res.redirect("/course/" + req.params.id)

    })



    .put('/course/:id', async (req, res) => {

        const user_ID = await req.user["id"]

        console.log(req.body)

        const data = await DatabaseUtils.updateCourse(user_ID, req.params.id, req.body.speaker, req.body.html_markdown_code.replace(/`/g, '\\`'))


        if (!data) {
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
            res.status(500).json({ error: "Course doesnt exist" })
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