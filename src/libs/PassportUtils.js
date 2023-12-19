
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
      },
      async (email, password, done) => {
        try {
          const user = await DatabaseUtils.emailExists(email);
          if (!user) return done(null, false);
          const isMatch = await DatabaseUtils.matchPassword(password, user.password);
          if (!isMatch) return done(null, false);
          return done(null, {id: user.id, email: user.email}); // Controlling which fields are exposed
        } catch (error) {
          return done(error, false);
        }
      }
    )
)


// When express-session tries to "safe" a session it saves this
passport.serializeUser((user, done) => {
  console.log(user)
  done(null, user);
  console.log("L")
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