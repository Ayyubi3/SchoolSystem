
const path = require("path")
const { PATH_PUBLIC } = require("../index")
const {DatabaseHelper} = require("../Database")










var express = require('express'),
    subjectsrouter = express.Router();


    subjectsrouter




    .get('/subjects', async (req, res) => {


        const Subjects = await DatabaseHelper.Read("subject")

        res.render(path.join(PATH_PUBLIC, "SubjectList", "index.ejs"), {Subjects, loggedIn: req.isAuthenticated()})



    })




module.exports = { subjectsrouter };

