const passport = require('passport');
const CookieStrategy = require('passport-cookie').Strategy;

passport.use(new CookieStrategy((token, done) => {
  console.log(token);
}))
