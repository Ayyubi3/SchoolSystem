const {DB} = require("../DB")










var express = require('express'),
    courserouter = express.Router();


courserouter




    .get('/courses/:id', (req, res) => {

        const subjects = DB.read(DB.Databases.SUBJECTS)
        const obj = subjects.find(obj => obj.id == req.params.id)
        res.send(obj)



        



    })




module.exports = { courserouter };

