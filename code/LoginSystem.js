const fs = require("fs")
const path = require("path")
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const passport = require('passport')





function initialize(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}





const authenticateUser = async (email, password, done) => {
    console.log("authenticate user " + email + " / " + password)

    const user = getUserByEmail(email)

    if (user == null) {
        console.log("No user with that email")
        return done(null, false, { message: 'No user with that email' })
    }

    try {
        if (await bcrypt.compare(password, user.password)) {
            return done(null, user)
        } else {
            console.log("Password incorrect")
            return done(null, false, { message: 'Password incorrect' })
        }
    } catch (e) {
        return done(e)
    }
}







async function addUser(email, password, name, id) {

    const Users = getUsers();

    if(Users.some((user) => {return user.email === email})) {
        console.log("User already exists")
        return false

    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10)




        Users.push({
            id: id,
            name: name,
            email: email,
            password: hashedPassword,
            subjects: []
        })

        fs.writeFileSync(path.join(__dirname, "../Users.json"), JSON.stringify(Users))
        console.log("Register successful")
        return true
    } catch (e) {
        console.log("Register error")
        console.log(e)
        return false

    }



}



function getUsers() {

    return JSON.parse(fs.readFileSync(path.join(__dirname, "../Users.json")))

}


function getUserByEmail(email) {
    return getUsers().find(user => user.email === email)
}

function getUserById(id) {
    return getUsers().find(user => user.id === id)
}





module.exports = { addUser, initialize, passport, getUsers, authenticateUser }

