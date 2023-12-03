
const path = require("path")
const { UserSystem, passport } = require("../LoginSystem")
const { PATH_PUBLIC } = require("../index")
const fs = require("fs")
const {DatabaseHelper} = require("../Database")







var express = require('express'),
  filesrouter = express.Router();


  filesrouter




  .get('/files/:subjectID/:fileID', async (req, res) => {

    if (!req.isAuthenticated()) {
        console.log("Not authenticated, redirect to \"/\"")
        req.flash("info", "Not logged in. Please Login or Register before continuing")
        res.redirect("/")
        res.end()

    } 

    const subjects = await DatabaseHelper.GetSubjectsFromUser(await req.user["id"])

    console.log(subjects)

    if(!subjects.some(obj => obj.id == req.params.subjectID))
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
