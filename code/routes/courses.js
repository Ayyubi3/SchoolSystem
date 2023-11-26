const {DB} = require("../DB")
const path = require("path")
const { PATH_PUBLIC } = require("../index")











var express = require('express'),
    courserouter = express.Router();


courserouter




    .get('/courses/:id', (req, res) => {

        const subjects = DB.read(DB.Databases.SUBJECTS)
        const obj = subjects.find(obj => obj.id == req.params.id)

        res.render(path.join(PATH_PUBLIC, "Subject", "index.ejs"), {obj, Useremail: req.user["email"]})



        



    })




module.exports = { courserouter };

