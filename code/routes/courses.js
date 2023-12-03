
const path = require("path")
const { PATH_PUBLIC } = require("../index")


const { DatabaseHelper } = require("../Database.js")









var express = require('express'),
    courserouter = express.Router();


courserouter




    .get('/courses/:id', async (req, res) => {

        const subject = await DatabaseHelper.Read("subject", "id = " + req.params.id)
        const speaker = await DatabaseHelper.GetNameFromSubjectID(req.params.id)

        console.log(subject)
        console.log(speaker)

        //TODO: Errorcheck req.user["email"]
        res.render(path.join(PATH_PUBLIC, "Course", "index.ejs"), {subject: subject[0], speaker: speaker, Useremail: req.user["email"]})



        



    })


    
    .post('/courses/:id', (req, res) => {


        console.log(req.user["email"])
        const content = DB.read(DB.Databases.USERS)

        const indexOfUserToUpdate = content.findIndex(user => user.email === req.user["email"]);


        // Check if the user was found
        if (indexOfUserToUpdate !== -1 && !content[indexOfUserToUpdate].subjects.includes(parseInt(req.params.id))) {
            // Add "34" to the subjects array of the found user
            content[indexOfUserToUpdate].subjects.push(parseInt(req.params.id));
            DB.writeAll(DB.Databases.USERS, content)
            res.status(200).send("ok")
        }




    })




module.exports = { courserouter };

