const validator = require('validator');
const string = require('lodash/string');

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

module.exports.comment = (req, res, next) => {
  if (!req.body.text) {
    const err = new Error('Input required.');
    err.code = 400;
    return next(err);
  }
  req.body.text = validator.trim(req.body.text);
  console.log('PASSED: validate.comment,', req.body.text);
  next();
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

module.exports.email = (req, res, next) => {
  if (!req.body.email) {
    const err = new Error('Email required.');
    err.code = 400;
    return next(err);
  }

  const email = validator.isEmail(req.body.email);

  if (!validator.isEmail(req.body.email)) {
    const err = new Error('Valid email required.');
    err.code = 400;
    return next(err);
  }

  console.log('PASSED: validate.email,', req.body.email);
  req.body.email = req.body.email.toLowerCase();
  next();
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

module.exports.location = (req, res, next) => {
  if (!req.session.coordinates || !req.session.geoBoundBox) {
    return res.redirect('/');
  }
  next();
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

module.exports.name = (req, res, next) => {
  if (!req.body.name) {
    const err = new Error('Name required.');
    err.code = 400;
    return next(err);
  }

  if (req.body.name.length < 3) {
    const err = new Error('Name too short.');
    err.code = 400;
    return next(err);
  }

  let name = string.trim(req.body.name, ' .').toLowerCase(); // toLowerCase to avoid lodash camelCase filtering
  name = string.lowerCase(name); // lodash lowerCase for filtering dash and apostrophe
  name = string.upperFirst(name);
  const n = name.length;

  string.split(name, ' ').forEach((el) => {
    name += ` ${string.upperFirst(el)}`;
  });
  req.body.name = name.substring(n + 1);
  console.log('PASSED: validate.name,', req.body.name);
  next();
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

module.exports.password = (req, res, next) => {
  const pwd = req.body.password;

  if (!pwd) {
    const err = new Error('Password required.');
    err.code = 400;
    return next(err);
  }

  if (pwd.indexOf(' ') !== -1) {
    const err = new Error('Invalid password.');
    err.code = 400;
    return next(err);
  }

  if (pwd.length < 8) {
    const err = new Error('Password too short.');
    err.code = 400;
    return next(err);
  }

  console.log('PASSED: validate.password, see bcrypt');
  next();
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------


module.exports.question = (req, res, next) => {
  if (!req.body.question) {
    const err = new Error('Question is required.');
    err.code = 400;
    return next(err);
  }

  if (req.body.question.length > 90) {
    const err = new Error('Exceeded character limit.');
    err.code = 400;
    return next(err);
  }

  if (req.body.tag && req.body.tag.length > 8) {
    const err = new Error('Exceeded character limit.');
    err.code = 400;
    return next(err);
  } else if (req.body.tag) {
    req.body.tag = validator.trim(req.body.tag);
    req.body.tag = req.body.tag.toLowerCase();
  } else {
    req.body.tag = null;
  }

  req.body.question = validator.trim(req.body.question);

  console.log('PASSED: validate.question,', req.body.question, req.body.tag);
  next();
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

module.exports.reservedUsernames = (req, res, next) => {
  const reservedUsernames = [
    'account', 'home', 'login', 'post', 'profile',
    'signup',
  ];

  reservedUsernames.forEach((el) => {
    if (el === req.body.username) {
      const err = new Error('Duplicate Username found.');
      err.code = 400;
      return next(err);
    }
  });
  console.log('PASSED: validate.reservedUsernames,', req.body.username);
  next();
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

module.exports.user = (req, res, next) => {
  if (!req.session.userId) {
    const err = new Error('Input user.');
    err.code = 400;
    return next(err);
  }
  next();
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

module.exports.username = (req, res, next) => {
  if (!req.body.username) {
    const err = new Error('Username required.');
    err.code = 400;
    return next(err);
  }

  if (req.body.username.length < 3) {
    const err = new Error('Username too short.');
    err.code = 400;
    return next(err);
  }

  const usr = req.body.username.toLowerCase();

  const valid = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
    'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
    's', 't', 'u', 'v', 'w', 'x', 'z', 'y', '_',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
  ];

  usr.split('').forEach((el) => {
    if (!valid.includes(el)) {
      const err = new Error(`Username cannot contain '${el}' only 'a-z', '0-9', '_' are valid`);
      err.code = 400;
      return next(err);
    }
  });

  console.log('PASSED: validate.username,', usr);
  req.body.username = usr;
  next();
};
