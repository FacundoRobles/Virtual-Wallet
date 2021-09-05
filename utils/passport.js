const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { pool }= require('../database');
const { encryptPassword, matchPassword } = require('./helpers');

//PASSPORT

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
});


//SIGN UP
passport.use(
    'local-signup',
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true,
        },
        async (req, username, password, done) => {
            const { firstname, lastname } = req.body;
            await pool.query(
                'SELECT * FROM users WHERE username = ?',[username],
                async function (err, rows) {
                    if (err) return done(err);
                    if (rows.length) {
                        return done(
                            null,
                            false,
                            req.flash(
                                'error',
                                'That username is already taken.'
                            )
                        );
                    } else {
                        const hashPassword = await encryptPassword(password);
                        const newUser = {
                            username: username,
                            password: hashPassword,
                            firstname: firstname,
                            lastname: lastname,
                        };

                        const result = await pool.query(
                            'INSERT INTO users SET ?',
                            [newUser]
                        );
                        newUser.id = result.insertId;
                        return done(null, newUser);
                    }
                }
            );
        }
    )
);


//LOGIN
passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true
      },
      async function(req, username, password, done) {
        const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username])
            if (rows.length > 0) {
                const user = rows[0]
                const validatedPassword = await matchPassword(password, user.password);
                if (validatedPassword) {
                    return done(null, rows[0], req.flash('success',`Welcome ${user.firstname}`));
                }
                console.log('Wrong password');
                return done( null, false, req.flash("error", "Wrong username/password."));
            }
            console.log('no user was found');
            return done(null, false, req.flash("error", "Wrong username/password."));
        }
    )
);


