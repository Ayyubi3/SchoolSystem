
const path = require("path")
const { UserSystem, passport } = require("../LoginSystem")
const { PATH_PUBLIC } = require("../index")
const fs = require("fs")
const {DB} = require("../DB")








var express = require('express'),
  filesrouter = express.Router();


  filesrouter




  .get('/files/:subjectID/:fileID', (req, res) => {

    if (!req.isAuthenticated()) {
        console.log("Not authenticated, redirect to \"/\"")
        req.flash("info", "Not logged in. Please Login or Register before continuing")
        res.redirect("/")
        res.end()

    } 


    if(!req.user["subjects"].some(obj => obj == req.params.subjectID))
    {

        console.log("Not authenticated, redirect to \"/\"")
        req.flash("info", "Not in Subject")
        res.redirect("/")
        res.end()


    }


    const Filepath = path.join(__dirname, "..","..", "FILES", req.params.subjectID, req.params.fileID)
    console.log(Filepath)
    res.sendFile(Filepath)



    
  })





module.exports = { filesrouter };
