const { passport } = require("../libs/PassportUtils.js")
const path = require("path")





var express = require('express'),
    dashboardrouter = express.Router();

    dashboardrouter


    .get('/dashboard', (req, res) => {
        if (!req.isAuthenticated()) {
            // FIXME: Send a message to index. maybe flash
            res.redirect("/login");
        } else {
            
        const filepath = path.join(__dirname, "..", "..", "public", "dashboard", "index.ejs")
        res.render(filepath, {Courses: null})
        }
    


    })

    .post('/dashboard'),





module.exports = { dashboardrouter };