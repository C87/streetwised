const mongoose = require('mongoose');

const Post = mongoose.model('Post');
const User = mongoose.model('User');

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

module.exports.all = (req, res, next) => {
  Post
    .find()
    .where('geometry.coordinates')
    .within({
      box: res.locals.box,
    })
    .sort({
      'properties.date': '-1',
    })
    .limit(100)
    .populate('properties.user', 'name username avatar')
    .lean()
    .then((doc) => {
      console.log('PASSED: read.all,', doc.length);
      res.locals.data = doc;
      next();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.post = (req, res, next) => {
  Post
    .findById(req.params.postId)
    .populate('properties.user', 'name username avatar')
    .populate('properties.comments.user', 'name username avatar')
    .populate('properties.comments.upvotes.user', 'name username avatar')
    .lean()
    .then((doc) => {
      res
        .json(doc);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.user = (req, res, next) => {
  const id = '5b5d9f5b5bdeb70bbdb2aae4';

  User
    .findById(id)
    .select('-password -email')
    .lean()
    .then((doc) => {
      res
        .json(doc);
    })
    .catch((err) => {
      next(err);
    });
};
