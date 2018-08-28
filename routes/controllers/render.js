const tabBar = 'Streetwised';

module.exports.account = (req, res) => {
  if (!req.session.userId) {
    return res.status(200).render('unauth/account.html');
  }

  res.status(200).render('auth/account.html', {
    title: tabBar,
    username: req.session.username,
  });
};

module.exports.avatar = (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/account');
  }

  res.status(200).render('auth/avatar.html', {
    title: tabBar,
    username: req.session.username,
  });
};

module.exports.ask = (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/account');
  }

  res.status(200).render('ask.html', {
    location: req.session.location,
    title: tabBar,
    username: req.session.username,
  });
};

module.exports.home = (req, res) => {
  let intro = '_partials/home/intro.html';
  let header = 'unauth';
  let route = '/account';
  if (req.session.userId) {
    intro = null;
    header = 'auth';
    route = '/ask';
  }

  res.status(200).render('home.html', {
    headerClass: header,
    intro,
    route,
    title: tabBar,
  });
};

module.exports.questions = (req, res) => {
  let header = 'unauth';
  let route = '/account';
  if (req.session.userId) {
    header = 'auth';
    route = '/ask';
  }

  res.status(200).render('questions.html', {
    headerClass: header,
    location: req.session.location,
    route,
    script: '/js/questions.js',
    title: tabBar,
  });
};

module.exports.post = (req, res) => {
  let controller = '_partials/post/unauth/controller.html';
  let src = null;
  if (req.session.userId) {
    controller = '_partials/post/auth/controller.html';
    src = req.session.avatar;
  }

  res.status(200).render('post.html', {
    controller,
    script: '/js/post.js',
    src,
    title: tabBar,
  });
};
