const {DatabaseHelper} = require("../Database")
const path = require("path")
const { PATH_PUBLIC } = require("../index")










var express = require('express'),
    createsubjectrouter = express.Router();


    createsubjectrouter




    .get('/createsubject', (req, res) => {

        if (!req.isAuthenticated()) {
            console.log("Not authenticated, redirect to \"/\"")
            req.flash("info", "Not logged in. Please Login or Register before continuing")
            res.redirect("/")
            res.end()
    
        } 
        res.render(path.join(PATH_PUBLIC, "CreateSubject", "index.ejs"), {})

    })

    .post('/createsubject', async (req, res) => {

        if (!req.isAuthenticated()) {
            console.log("Not authenticated, redirect to \"/\"")
            req.flash("info", "Not logged in. Please Login or Register before continuing")
            res.redirect("/")
            res.end()
    
        } 


        const speakerarray = req.body.speaker.split(',')
        let speaker = speakerarray.map(str => parseInt(str, 10))

        const creator = await req.user["id"]

        DatabaseHelper.SubjectCreate(req.body.name, req.body.html_markdown_code, speaker, creator)



        res.redirect("/")
    })




module.exports = { createsubjectrouter };
