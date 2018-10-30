const tabBar = 'Streetwised';

const googlePartial = (req) => {
  if (req.headers.host === 'streetwised.com' || req.headers.host === 'www.streetwised.com') {
    return '_partials/analytics/production/google.html';
  }
  return null;
};

const mixpanelPartial = (req) => {
  if (req.headers.host === 'streetwised.com' || req.headers.host === 'www.streetwised.com') {
    return '_partials/analytics/production/mixpanel.html';
  }
  return '_partials/analytics/dev/mixpanel.html';
};

module.exports.account = (req, res) => {
  const google = googlePartial(req);
  const mixpanel = mixpanelPartial(req);

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
  const google = googlePartial(req);
  const mixpanel = mixpanelPartial(req);

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
  const google = googlePartial(req);
  const mixpanel = mixpanelPartial(req);

  let ask = null;
  let block = '_partials/block.html';
  let intro = '_partials/home/intro.html';
  let header = 'unauth';
  let route = '/account';
  if (req.session.userId) {
    ask = '_partials/home/auth/ask.html';
    block = null;
    intro = null;
    header = 'auth';
    route = '/ask';
  }

  res.status(200).render('home.html', {
    ask,
    block,
    google,
    mixpanel,
    headerClass: header,
    intro,
    route,
    title: tabBar,
  });
};

module.exports.questions = (req, res) => {
  const google = googlePartial(req);
  const mixpanel = mixpanelPartial(req);

  let block = '_partials/block.html';
  let header = 'unauth';
  let route = '/account';
  if (req.session.userId) {
    block = null;
    header = 'auth';
    route = '/ask';
  }

  console.log('RENDER: questions.html,', req.session.geoBoundBox);

  res.status(200).render('questions.html', {
    block,
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
  const google = googlePartial(req);
  const mixpanel = mixpanelPartial(req);

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
