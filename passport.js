const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')
const bcrypt = require('bcrypt')

module.exports = function (passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' },
        function (username, password, done) {
            User.findOne({ email: username }, function (err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                bcrypt.compare(password, user.password, function (err, isMatch) {
                    if (err)
                        console.log(err);
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Wrong password.' });
                    }
                })
            });
        }
    ));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}
