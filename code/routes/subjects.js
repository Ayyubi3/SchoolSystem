
const path = require("path")
const { PATH_PUBLIC } = require("../index")
const {DB} = require("../DB")










var express = require('express'),
    subjectsrouter = express.Router();


    subjectsrouter




    .get('/subjects', (req, res) => {


        const Subjects = DB.read(DB.Databases.SUBJECTS)

        res.render(path.join(PATH_PUBLIC, "SubjectList", "index.ejs"), {Subjects})



    })




module.exports = { subjectsrouter };

