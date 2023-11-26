const {DB} = require("../DB")
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

    .post('/createsubject', (req, res) => {

        if (!req.isAuthenticated()) {
            console.log("Not authenticated, redirect to \"/\"")
            req.flash("info", "Not logged in. Please Login or Register before continuing")
            res.redirect("/")
            res.end()
    
        } 


        req.body.speaker = req.body.speaker.split(",")
        try {
            req.body.creator = req.user["email"]
            
        } catch (error) {
            
        } 
        
        req.body.id = getRandomNumberGreaterThan1000()


        DB.add(DB.Databases.SUBJECTS, req.body, (obj, content) => { return content.some(item => item.id === obj.id); })


        res.redirect("/")


        



    })




module.exports = { createsubjectrouter };


function getRandomNumberGreaterThan1000() {
    const min = 1001;
    const max = 2000;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }