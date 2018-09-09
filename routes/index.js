// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
const express = require('express');

const router = express.Router();

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

const aws = require('./controllers/aws.js');
const bcrypt = require('./controllers/bcrypt.js');
const create = require('./controllers/db/create.js');
const location = require('./controllers/location.js');
const read = require('./controllers/db/read.js');
const render = require('./controllers/render.js');
const res = require('./controllers/response.js');
const query = require('./controllers/db/query.js');
const validate = require('./controllers/validate.js');
const update = require('./controllers/db/update.js');
const redirect = require('./controllers/redirect.js');

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

router
  .route('/session-login')
  .post(
    aws.none, validate.username, validate.password, query.user,
    bcrypt.compare, validate.checkbox, redirect.home
  );

router
  .route('/session-signup')
  .post(
    aws.none, validate.email, validate.reservedUsernames, validate.password, validate.username,
    validate.name, query.email, query.username, bcrypt.hash,
    create.user, validate.checkbox, redirect.avatar
  );

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

router
  .route('/explore.json')
  .get(location.review, res.location);

router
  .route('/questions.json')
  .get(read.all, res.points);

router
  .route('/:username/posts/:postId.json')
  .get(read.post);

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

router
  .route('/account')
  .get(render.account);

router
  .route('/ask')
  .get(render.ask);

router
  .route('/logout')
  .get(redirect.logout);

router
  .route('/questions')
  .get(validate.location, render.questions);

router
  .route('/:username/posts/:postId')
  .get(render.post);

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

router
  .route('/db-query')
  .post(aws.none, location.params, read.all, res.points);

router
  .route('/reverse-geo')
  .post(aws.none, location.reverseGeo, res.results);

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

router
  .route('/new-avatar')
  .post(aws.none, validate.session, aws.avatar, update.avatar, res.url);

router
  .route('/new-comment')
  .post(aws.none, validate.session, validate.comment, create.comment, res.comment);

router
  .route('/new-post')
  .post(
    aws.none, validate.session, location.question,
    validate.question, create.post, res.redirect
  );

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

router
  .route('/validate-email')
  .post(aws.none, validate.email, query.email, res.ok);

router
  .route('/validate-geo')
  .post(aws.none, location.currentPosition, res.ok);

router
  .route('/validate-name')
  .post(aws.none, validate.name, res.ok);

router
  .route('/validate-password')
  .post(aws.none, validate.password, res.ok);

router
  .route('/validate-username')
  .post(aws.none, validate.username, validate.reservedUsernames, query.username, res.ok);
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

router
  .route('/')
  .get(render.home);

router
  .route('*')
  .get((request, response) => response.redirect('/'));

module.exports = router;
