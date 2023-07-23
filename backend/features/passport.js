const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('../utils/firestore');
const User = db.collection('users');
const jwt = require('jsonwebtoken');

passport.use(
  new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
    const user = User.doc(username).get()
      .then(user => {
        bcrypt.compare(password, user.data()['password'], (err, match) => {
          if (err) throw err;
          if (!match) { return done(null, false, { message: 'Password does not match.' }); }
          else { return done(null, user); }
        });
      })
      .catch(err => {
        console.log(err);
        return done(null, false, { message: 'No user found.' });
      });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = User.doc(id).get()
    .then(user => done(null, user))
    .catch(err => done(err, user));
});

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({ success: false, message: info.message });
      }

      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }

        const token = jwt.sign({ username: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        return res.status(200).json({ success: true, user, token });
      });
    })(req, res, next);
  });

  app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    User.where('username', '==', username).get()
      .then(snapshot => {
        if (!snapshot.empty) {
          // If user already exists, return an error
          return res.status(400).json({ success: false, message: "Username already exists." });
        }

        // If user does not exist, continue with registration
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Server error." });
          }
          const user = {
            id: username,
            username: username,
            password: hashedPassword,
          };

          User.doc(user.id).set(user)
            .then(() => {
              res.status(200).json({ success: true });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({ success: false, message: "Server error." });
            });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error." });
      });
  });
}
