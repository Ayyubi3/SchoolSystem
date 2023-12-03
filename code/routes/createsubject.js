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

        //TODO: REWORK

        try {
            req.body.creator = req.user["email"]
            
        } catch (error) {
            console.log(error)
        } 
        
        //TODO: ID besser assignen
        const randomID = getRandomNumberGreaterThan1000()


//        TODO: Speaker und so
        const speaker = req.body.speaker.split(",")

        DatabaseHelper.SubjectCreate(randomID, req.body.name, req.body.html_markdown_code)



        res.redirect("/")


        



    })




module.exports = { createsubjectrouter };


function getRandomNumberGreaterThan1000() {
    const min = 1001;
    const max = 2000;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }