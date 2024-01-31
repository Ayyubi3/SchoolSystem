
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
      const userExists = await DatabaseUtils.emailExists_b(req.body.email)

      if (userExists) {
        return done("user already exists", false);
      }

      const user = req.body

      const [data, error] = await DatabaseUtils.createUser(
        user.firstname,
        user.lastname,
        user.email,
        user.password
      );
      if (error) return done(`Couldnt create user: ${error}`)

      return done(null, {id: data.id});


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


      const userExists = await DatabaseUtils.emailExists_b(email);
      if (!userExists) {
        return done("User doesnt exist.", false);
      }
      const user = await DatabaseUtils.getUserByEmail_o(email)
      const isMatch = await DatabaseUtils.matchPassword_b(password, user.password);
      if (!isMatch) {
        return done("Incorrect Password.", false);
      }
      return done(null, { id: user.id }); 

    }
  )
)


// When express-session tries to "safe" a session, it saves this
passport.serializeUser((user, done) => {
  if (!user) { done(null, false) }
  done(null, user);
});

// TODO
// Currently if the req.user object is called it will make a request to the db
// Maybe have an array that saves the requested user to have less DB requests ?
// But than have to deal with what todo when user data changes in DB 
passport.deserializeUser(async (user, done) => {

  if (!user) { done(null, false) }
  let out = await DatabaseUtils.getUserByID_o(user.id);
  if (!out) { done(/* "Deserializing failed. " + JSON.stringify(user) */null, false) }
  done(null, out);

});



module.exports = { passport }