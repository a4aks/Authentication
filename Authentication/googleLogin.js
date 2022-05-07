
const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: "112203260968-7avd5qvir8gpostlrjv86g4ikm9ef6u9.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:9008/google/callback",
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

module.exports = passport;

// https://masai-backend.herokuapp.com/google/callback