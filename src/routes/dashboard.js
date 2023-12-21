const { DatabaseUtils } = require("../libs/DatabaseUtils.js");
const { passport } = require("../libs/PassportUtils.js")
const path = require("path")





var express = require('express'),
    dashboardrouter = express.Router();

dashboardrouter


    .get('/dashboard', async (req, res) => {

        const filepath = path.join(__dirname, "..", "..", "public", "dashboard", "index.ejs")
        const courses = await DatabaseUtils.getUserCourses(await req.user["id"])
        res.render(filepath, { Courses: courses, message: [] })





    })





    module.exports = { dashboardrouter };