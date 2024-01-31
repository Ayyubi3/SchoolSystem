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


        const course = await DatabaseUtils.getCourseByID_o(req.params.id);

        if (!course) {
            req.flash("main", "No course with this id")
            res.redirect("/dashboard")
            return
        }

        // FIXME: No sanitiziation here | Markdown highlighter npm 

        course.code = md.render(course.html_markdown_code)

        let user = await DatabaseUtils.getUserByID_o(await req.user["id"])

        if (!user) {
            req.flash("main", "User doesnt exist") 
            res.redirect("/login") 
        }



        let isCreator = user.id == course.creator_id
        let isMember = isCreator

        if (!isMember) {
            let [data, error] = await DatabaseUtils.getUserCourses(user.id)

            const courses = data


            if (error) { res.send(error); return }

            isMember = courses.some(element => element.id == course.id)

        }






        const [data, error] = await DatabaseUtils.getMessagesFromCourse(req.params.id)

        if (error) {
            req.flash("main", error)
            return
        }


        // FIXME Their has to be a better way
        let CourseMessages = data

        let outputMessages = []
        CourseMessages.forEach(async element => {

            outputMessages.push(
                {

                    message: element,
                    side: element.user_id == user.id ? "right" : "left"
                }
            )


        });


        const style = require("fs").readFileSync(path.join(__dirname, "..", "..", "public", "course", "style.css"))
        res.render("course/index.ejs", {
            user,
            course,

            isMember, isCreator,

            outputMessages,

            style,
            message: req.flash("main")
        })
    })



    .get('/course/:id/edit', async (req, res) => {

        const course = await DatabaseUtils.getCourseByID_o(req.params.id)

        if (!course) {
            res.send("Course doesnt exist")
            return
        }

        let canEdit = await req.user["id"] == course.creator_id

        if (!canEdit) {
            res.send("Please contact the creator to edit this page")
            return
        }

        const filepath = path.join(__dirname, "..", "..", "public", "editcourse", "index.ejs")


        const url = "/course/" + course.id

        res.render(filepath, { url, course, message: req.flash("main") })


    })



    .post('/course/:id', async (req, res) => {

        const userID = await req.user["id"]

        const joined = await DatabaseUtils.userJoinCourse_b(req.params.id, userID)

        if (!joined) {
            req.flash("main", "Could not join " + req.params.id)
            res.sendStatus(400)
            return
        }

        res.sendStatus(200)


    })



    .put('/course/:id', async (req, res) => {

        const user_ID = await req.user["id"]

        const data = await DatabaseUtils.updateCourse_b(user_ID, req.params.id, req.body.speaker, req.body.html_markdown_code.replace(/`/g, '\\`'))


        if (!data) {
            req.flash("main", "Could not update " + req.params.id)
            res.sendStatus(400)
            return
        }

        req.flash("main", "Updated course")
        res.sendStatus(200)

    })



    .delete('/course/:id', async (req, res) => {

        const course = await DatabaseUtils.getCourseByID_o(req.params.id)

        if (!course) {
            res.sendStatus(500)
            return
        }

        const userID = await req.user["id"]

        let deleteCourse = false
        if (course.creator_id == userID) {
            deleteCourse = await DatabaseUtils.deleteCourse_b(req.params.id)
        }


        if (!deleteCourse) {
            req.flash("main", "Cant delete course")
            logger.error("Couldnt delete course")
            res.sendStatus(400)
        }

        logger.info("deleting course " + (req.params.id))

        res.sendStatus(200)

        // FIXME Cant redirect user to update new data 


    })

    .unsubscribe('/course/:id', async (req, res) => {

        const user_ID = await req.user["id"]

        const data = await DatabaseUtils.userLeaveCourse_b(user_ID)

        if (!data) {
            req.flash("main", "Could not update " + req.params.id)
            res.sendStatus(400)
            return
        }

        req.flash("main", "Updated course")
        res.sendStatus(200)

    })







module.exports = { courserouter };