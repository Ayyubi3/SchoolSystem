const { DatabaseUtils } = require("../libs/DatabaseUtils.js");
const path = require("path")





var express = require('express'),
    profilerouter = express.Router();

profilerouter


    .get('/profile', async (req, res) => {

        const user = await DatabaseUtils.getUserByID(await req.user["id"])

        user.password = ""
        logger.info(JSON.stringify(user))


        const filepath = path.join(__dirname, "..", "..", "public", "profile", "index.ejs")
        res.render(filepath, { user })

    }



    )


    .delete('/profile', async (req, res) => {

        const user = await DatabaseUtils.deleteUser(await req.user["id"])

        logger.info("deleting" + (await req.user["id"]))


        const filepath = path.join(__dirname, "..", "..", "public", "profile", "index.ejs")
        res.render(filepath, { user })

    }



    )

    .post('/dashboard'),





    module.exports = { profilerouter };