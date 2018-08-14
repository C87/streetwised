module.exports.avatar = (req, res, next) => {
  console.log('PASSED: redirect.avatar');
  res
    .json({ code: 301, url: '/account/avatar' });
};

module.exports.home = (req, res, next) => {
  console.log('PASSED: redirect.home');
  res
    .json({ code: 301, url: '/' });
};

module.exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) { next(err); }
    console.log('PASSED: redirect.logout');
    res.redirect('/');
  });
};
