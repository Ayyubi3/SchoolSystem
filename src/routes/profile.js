const { DatabaseUtils } = require("../libs/DatabaseUtils.js");
const path = require("path")



var express = require('express'),
    profilerouter = express.Router();

profilerouter


    .get('/profile', async (req, res) => {

        const user = await DatabaseUtils.getUserByID(await req.user["id"])

        if (!user)
        {
            req.flash("main", "Couldnt find user")
            logger.error("Couldnt find user")
            res.redirect("/")
            return
        }

        user.password = ""

        logger.info(JSON.stringify(user))


        const filepath = path.join(__dirname, "..", "..", "public", "profile", "index.ejs")
        res.render(filepath, { user, message: req.flash("main") })

    })


    .delete('/profile', async (req, res) => {

        const user = await DatabaseUtils.deleteUser(await req.user["id"])


        if (!user)
        {
            req.flash("main", "Couldnt delete user")
            logger.error("Couldnt delete user")
            res.redirect("/")
            return
        }


        logger.info("deleting" + (await req.user["id"]))

        req.flash("main", "deleted user")
        res.redirect("/")

    })


    module.exports = { profilerouter };