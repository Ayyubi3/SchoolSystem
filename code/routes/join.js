
const path = require("path")
const { UserSystem, passport } = require("../LoginSystem")
const { PATH_PUBLIC } = require("../index")
const fs = require("fs")
const { DB } = require("../DB")








var express = require('express'),
    joinrouter = express.Router();


joinrouter




    .post('/join', (req, res) => {

        const content = DB.read(DB.Databases.USERS)

        const indexOfUserToUpdate = content.findIndex(user => user.email === req.body.Useremail);


        // Check if the user was found
        if (indexOfUserToUpdate !== -1 && !content[indexOfUserToUpdate].subjects.includes(req.body.id)) {
            // Add "34" to the subjects array of the found user
            content[indexOfUserToUpdate].subjects.push(req.body.id);
            DB.writeAll(DB.Databases.USERS, content)
        }

        res.sendStatus(201)



    })



module.exports = { joinrouter };
