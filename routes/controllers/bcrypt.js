const bcrypt = require('bcrypt');

module.exports.hash = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      req.body.password = hash;
      console.log('PASSED: bcrypt.hash,', req.body.password);
      next();
    })
    .catch(err => next(err));
};

module.exports.compare = (req, res, next) => {
  bcrypt
    .compare(req.body.password, res.locals.user.password)
    .then((result) => {
      if (result) {
        req.session.userId = res.locals.user._id;
        req.session.avatar = res.locals.user.avatar;
        req.session.name = res.locals.user.name;
        req.session.username = res.locals.user.username;
        console.log('PASSED: bcrypt.compare,', result);
        return next();
      }
      const err = new Error('Username or password incorrect.');
      err.code = 400;
      return next(err);
    })
    .catch(err => next(err));
};
