const path = require("path")
const fs = require("fs")
const { DatabaseUtils } = require("./../libs/DatabaseUtils")









var express = require('express'),
    filesrouter = express.Router();


filesrouter




    .get('/files/:courseID/:fileID', async (req, res) => {

        const Courses = await DatabaseUtils.getUserCourses(await req.user["id"])
        console.log(Courses)
        const isInCourse = Courses.some(element => {
            return element.id == req.params.courseID
        })

        console.log(isInCourse)

        if (!isInCourse) {

            console.log("Not in coures, redirect to \"/\"")
            req.flash("info", "Not in Course")
            res.redirect("/")
            return

        }


        const Filepath = path.join(__dirname, "..", "..", "files", req.params.courseID, req.params.fileID)
        if(!fs.existsSync(Filepath)) 
        {
            res.send("No file " + Filepath)
            return
        }
        console.log(Filepath)
        res.sendFile(Filepath)




    })





module.exports = { filesrouter };