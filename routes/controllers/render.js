const tabBar = 'Streetwised';

module.exports.account = (req, res) => {
  if (req.session.userId) {
    return res.status(200).render('auth/account.html', {
      title: tabBar,
      username: req.session.username,
    });
  }
  res
    .status(200).render('unauth/account.html');
};

module.exports.avatar = (req, res) => {
  if (req.session.userId) {
    return res.status(200).render('auth/avatar.html', {
      title: tabBar,
      username: req.session.username,
    });
  }
  res.redirect('/account');
};

module.exports.ask = (req, res) => {
  if (req.session.userId) {
    return res.status(200).render('ask.html', {
      location: req.session.location,
      title: tabBar,
      username: req.session.username,
    });
  }
  res.redirect('/account');
};

module.exports.home = (req, res) => {
  if (req.session.userId) {
    return res.status(200).render('home.html', {
      headerClass: 'auth',
      route: '/ask',
      title: tabBar,
    });
  }
  res.status(200).render('home.html', {
    headerClass: 'unauth',
    intro: '_partials/home/intro.html',
    route: '/account',
    title: tabBar,
  });
};

module.exports.questions = (req, res) => {
  let href = '/account';
  if (req.session.userId) { href = '/ask'; }

  res.render('questions.html', {
    location: req.session.location,
    route: href,
    script: '/js/questions.js',
    title: tabBar,
  });
};

module.exports.post = (req, res) => {
  if (req.session.userId) {
    return res.status(200).render('post.html', {
      section: '_partials/post/auth/section.html',
      script: '/js/auth/post.js',
      title: tabBar,
      user: req.params.username,
    });
  }
  res.status(200).render('post.html', {
    section: '_partials/post/unauth/section.html',
    script: '/js/unauth/post.js',
    title: tabBar,
    user: req.params.username,
    unauthLink: '_partials/post/unauth/header.html'
  });
};
