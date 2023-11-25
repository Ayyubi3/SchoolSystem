const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const {DB} = require("./DB")

const passport = require('passport')

class UserSystem {

    //Passport always comes from this file so the same instance is always used
    static initialize(passport) {
        passport.use(new LocalStrategy({ usernameField: 'email' }, this.authenticateUser))
        passport.serializeUser((user, done) => done(null, user.id))
        passport.deserializeUser((id, done) => {
            return done(null, this.getUserById(id))
        })
    }


    static authenticateUser = async (email, password, done) => {
        console.log("authenticate user " + email + " / " + password)
    
        const user = this.getUserByEmail(email)
    
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




    static async addUser(email, password, name, id) {

        const Users = DB.read(DB.Databases.USERS);
    
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
    
            DB.writeAll(DB.Databases.USERS, USERS)
            console.log("Register successful")
            return true
        } catch (e) {
            console.log("Register error")
            console.log(e)
            return false
    
        }
    
    
    
    }

    
    
    
    
    
    static getUserByEmail(email) {
    
        const Users = DB.read(DB.Databases.USERS);
        return Users.find(user => user.email === email)
    }
    
    static getUserById(id) {
        const Users = DB.read(DB.Databases.USERS);
        return Users.find(user => user.id === id)
    }
    
    
}






















module.exports = { UserSystem, passport }

