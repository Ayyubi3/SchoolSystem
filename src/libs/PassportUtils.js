
//Configure passportjs
const passport = require('passport')
const LocalStrategy = require('passport-local')
const {DatabaseUtils} = require("./DatabaseUtils")


passport.use(

    "local-signup",

    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true, 
        },
        async (req, email, password, done) => {
            try {
                const userExists = await DatabaseUtils.emailExists(email)

                if (userExists) {
                  logger.warn("Error while registering: email already exists")
                  req.flash("register", "Email already exists")
                  return done(null, false);
                }

                const user = await DatabaseUtils.createUser(req.body.firstname, req.body.lastname, req.body.email, req.body.password);
                return done(null, user);
            } catch (error) {
                done(error);
            }
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
          const user = await DatabaseUtils.emailExists(email);
          if (!user) 
          {
            req.flash("login", "Account doesnt exist!")
            return done(null, false); // User doesnt exist
          }  
          const isMatch = await DatabaseUtils.matchPassword(password, user.password);
          if (!isMatch) {
            req.flash("login", "Wrong Password!")
            return done(null, false); // Incorrect password 
          }
          return done(null, {id: user.id, email: user.email}); // Controlling which fields are exposed
        } catch (error) {
          return done(error, false);
        }
      }
    )
)


// When express-session tries to "safe" a session it saves this
passport.serializeUser((user, done) => {
  logger.debug("Serializing" + user)
  done(null, user);
});

passport.deserializeUser(async (user, done) => {

  try {
      let out = await DatabaseUtils.getUserByID(user.id);
      done(null, out);
  } catch (error) {
      done(error);
  }
});



module.exports = {passport}