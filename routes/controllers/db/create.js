const mongoose = require('mongoose');

const Post = mongoose.model('Post');
const User = mongoose.model('User');

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

module.exports.comment = (req, res, next) => {
  const id = req.headers.referer.split('/').pop();
  const newComment = {
    user: req.session.userId,
    text: req.body.text,
  };

  Post
    .findById(id)
    .then((doc) => {
      doc.properties.comments.push(newComment);
      doc
        .save()
        .then((result) => {
          const i = (result.properties.comments.length - 1);
          const comment = result.properties.comments[i];
          res.locals.comment = {
            avatar: req.session.avatar,
            user: req.session.username,
            text: comment.text,
          };
          console.log('PASSED: create.comment, ', comment);
          next();
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

module.exports.post = (req, res, next) => {
  const newPost = new Post({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: req.session.coordinates,
    },
    properties: {
      user: req.session.userId,
      text: req.body.question,
      tag: req.body.tag,
    },
  });

  newPost
    .save()
    .then((doc) => {
      res.locals.data = [{
        id: doc._id,
        properties: {
          user: {
            avatar: req.session.avatar,
            username: req.session.username,
          },
          text: doc.properties.text,
          tag: doc.properties.tag,
          comments: doc.properties.comments,
        },
        geometry: {
          coordinates: doc.geometry.coordinates,
        },
      }];
      console.log('PASSED: create.post,', doc);
      next();
    })
    .catch(err => next(err));
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

module.exports.upvote = (req, res, next) => {
  const _id = '5b5da3fe1469850c905a55d4';
  const commentId = '5b5dac2bf7dd300dbe1344b6';

  const upvote = {
    user: req.session.userId,
  };

  Post
    .findById(_id)
    .then((doc) => {
      const comments = doc.properties.comments;
      for (let i = 0; i < comments.length; i += 1) {
        if (comments[i]._id.toString() === commentId) comments[i].upvotes.push(upvote);
      }
      doc
        .save()
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

module.exports.user = (req, res, next) => {
  const newUser = new User({
    avatar: res.locals.url,
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  newUser
    .save()
    .then((user) => {
      req.session.userId = user._id;
      req.session.avatar = user.avatar;
      req.session.name = user.name;
      req.session.username = user.username;
      console.log('PASSED: create.user,', user);
      next();
    })
    .catch(err => next(err));
};
