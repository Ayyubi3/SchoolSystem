
//Configure passportjs
const passport = require('passport')
const LocalStrategy = require('passport-local')
const { DatabaseUtils } = require("./DatabaseUtils")


passport.use(

  "local-signup",

  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },

    async (req, email, password, done) => {
      const userExists = await DatabaseUtils.emailExists(req.body.email)

      if (userExists) {
        logger.warn("Error while registering: email already exists")
        req.flash("main", "Email already exists")
        return done(null, false);
      }

      const user = req.body

      const data = await DatabaseUtils.createUser(user.firstname, user.lastname, user.email, user.password);

      //Welche Daten nach register in session gespeichert werden sollen
      const out = {
        id: data[0].id
      }

      return done(null, out);
      

    }
  )
);


passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },

    async (req, email, password, done) => {

      try {
        const userExists = await DatabaseUtils.emailExists(email);
        if (!userExists) {
          req.flash("main", "Account doesnt exist!")
          return done(null, false); // User doesnt exist
        }
        const user = await DatabaseUtils.getUserByEmail(email)
        const isMatch = await DatabaseUtils.matchPassword(password, user.password);
        if (!isMatch) {
          req.flash("main", "Wrong Password!")
          return done(null, false); // Incorrect password 
        }
        return done(null, { id: user.id, email: user.email }); // Controlling which fields are exposed
      } catch (error) {
        return done(error, false);
      }
    }
  )
)


// When express-session tries to "safe" a session, it saves this
passport.serializeUser((user, done) => {
  logger.debug("Serializing" + user)
  done(null, user);
});

// TODO
// Currently if the req.user object is called it will make a request to the db
// Maybe have an array that saves the requested user to have less DB requests ?
// But than have to deal with what todo when user data changes in DB 
passport.deserializeUser(async (user, done) => {
  try {
    let out = await DatabaseUtils.getUserByID(user.id);
    done(null, out);
  } catch (error) {
    done(error);
  }
});



module.exports = { passport }