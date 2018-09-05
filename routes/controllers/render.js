const tabBar = 'Streetwised';

module.exports.account = (req, res) => {
  console.log(req);
  let google = null;
  let mixpanel = '_partials/analytics/dev/mixpanel.html';
  if (req.header.host === 'streetwised.com') {
    mixpanel = '_partials/analytics/production/mixpanel.html';
    google = '_partials/analytics/production/google.html';
  }

  if (!req.session.userId) {
    return res.status(200).render('unauth/account.html', {
      google,
      mixpanel,
    });
  }

  res.status(200).render('auth/account.html', {
    google,
    mixpanel,
    name: req.session.name,
    src: req.session.avatar,
    title: tabBar,
    username: req.session.username,
  });
};

module.exports.ask = (req, res) => {
  let google = null;
  let mixpanel = '_partials/analytics/dev/mixpanel.html';
  if (req.header.host === 'streetwised.com') {
    mixpanel = '_partials/analytics/production/mixpanel.html';
    google = '_partials/analytics/production/google.html';
  }

  if (!req.session.userId) {
    return res.redirect('/account');
  }

  res.status(200).render('auth/ask.html', {
    google,
    mixpanel,
    image: req.session.avatar,
    location: req.session.location,
    title: tabBar,
    username: req.session.username,
  });
};

module.exports.home = (req, res) => {
  let google = null;
  let mixpanel = '_partials/analytics/dev/mixpanel.html';
  if (req.header.host === 'streetwised.com') {
    mixpanel = '_partials/analytics/production/mixpanel.html';
    google = '_partials/analytics/production/google.html';
  }
  let partial = '_partials/home/unauth/link.html';
  let intro = '_partials/home/intro.html';
  let header = 'unauth';
  let route = '/account';
  if (req.session.userId) {
    intro = null;
    header = 'auth';
    route = '/ask';
    partial = '_partials/home/auth/ask.html';
  }

  res.status(200).render('home.html', {
    google,
    mixpanel,
    headerClass: header,
    intro,
    partial,
    route,
    title: tabBar,
  });
};

module.exports.questions = (req, res) => {
  let google = null;
  let mixpanel = '_partials/analytics/dev/mixpanel.html';
  if (req.header.host === 'streetwised.com') {
    mixpanel = '_partials/analytics/production/mixpanel.html';
    google = '_partials/analytics/production/google.html';
  }

  let header = 'unauth';
  let route = '/account';
  if (req.session.userId) {
    header = 'auth';
    route = '/ask';
  }

  res.status(200).render('questions.html', {
    google,
    mixpanel,
    headerClass: header,
    location: req.session.location,
    route,
    script: '/js/questions.js',
    title: tabBar,
  });
};

module.exports.post = (req, res) => {
  let google = null;
  let mixpanel = '_partials/analytics/dev/mixpanel.html';
  if (req.header.host === 'streetwised.com') {
    mixpanel = '_partials/analytics/production/mixpanel.html';
    google = '_partials/analytics/production/google.html';
  }

  let controller = '_partials/post/unauth/controller.html';
  let src = null;
  if (req.session.userId) {
    controller = '_partials/post/auth/controller.html';
    src = req.session.avatar;
  }

  res.status(200).render('post.html', {
    google,
    mixpanel,
    controller,
    script: '/js/post.js',
    src,
    title: tabBar,
  });
};
