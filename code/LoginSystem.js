const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const passport = require('passport')


const { DatabaseHelper } = require("./Database.js")


class UserSystem {

    //Passport always comes from this file so the same instance is always used
    static initialize(passport) {
        passport.use(new LocalStrategy({ usernameField: 'email' }, this.authenticateUser))
        passport.serializeUser((user, done) => done(null, user.id))
        passport.deserializeUser(async (id, done) => {
            const user = await this.getUserById(id)
            return done(null, user)
        })
    }


    static authenticateUser = async (email, password, done) => {
        console.log("authenticate user " + email + " / " + password)

        const user = await this.getUserByEmail(email)

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




    static async addUser(firstname, lastname, email, password) {
        try {

            password = await bcrypt.hash(password, 10)

            await DatabaseHelper.UserCreate(firstname, lastname, email, password)


            return true

        } catch (error) {
            console.log(error)

            return false
        }

    }





    static async getUserByEmail(email) {

        const res = await DatabaseHelper.Read("user", "email = " + "'" + email + "'")
        return res[0]
        
    }

    static async getUserById(id) {
        const res = await DatabaseHelper.Read("user", "id = " + "'" + id + "'")
        return res[0]
        
    }


}






















module.exports = { UserSystem, passport }

