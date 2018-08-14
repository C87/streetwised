const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports.avatar = (req, res, next) => {
  User
    .findById(req.session.userId, 'avatar')
    .then((user) => {
      user.avatar = `https://image-store.ams3.digitaloceanspaces.com/${res.locals.path}`;
      user
        .save()
        .then((doc) => {
          req.session.avatar = doc.avatar;
          console.log('PASSED: update.avatar,', doc);
          next();
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
};
