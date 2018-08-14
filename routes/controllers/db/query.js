const mongoose = require('mongoose');

const User = mongoose.model('User');
const Post = mongoose.model('Post');

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

module.exports.email = (req, res, next) => {
  User
    .findOne({
      email: req.body.email,
    })
    .exec()
    .then((user) => {
      if (!user) {
        console.log('PASSED: query.email,', req.body.email);
        return next();
      }
      const err = new Error('Duplicate email found.');
      err.code = 400;
      return next(err);
    })
    .catch((err) => {
      next(err);
    });
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

module.exports.username = (req, res, next) => {
  User
    .findOne({
      username: req.body.username,
    })
    .exec()
    .then((user) => {
      if (!user) {
        console.log('PASSED: query.username,', req.body.username);
        return next();
      }
      const err = new Error('Duplicate username found.');
      err.code = 400;
      return next(err);
    })
    .catch((err) => {
      next(err);
    });
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

module.exports.user = (req, res, next) => {
  User
    .findOne({
      username: req.body.username,
    })
    .exec()
    .then((user) => {
      if (user) {
        res.locals.user = {
          _id: user._id,
          avatar: user.avatar,
          password: user.password,
          username: user.username,
        };
        console.log('PASSED: query.user,', req.body.username);
        return next();
      }
      const err = new Error('Username or password incorrect.');
      err.code = 400;
      return next(err);
    })
    .catch((err) => {
      next(err);
    });
};
