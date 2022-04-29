
const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: "83487008978-ibrcfposjivlb30ut5jhrpmpbp4h53mn.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "https://masai-backend.herokuapp.com/google/callback",
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

module.exports = passport;