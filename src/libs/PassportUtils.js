
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

                const user = await DatabaseUtils.createUser(req.body);
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
});

passport.deserializeUser(async (id, done) => {
  try {
      let user = await DatabaseUtils.getUserByID(id);
      done(null, user);
  } catch (error) {
      done(error);
  }
});



module.exports = {passport}