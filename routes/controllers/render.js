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

module.exports.home = (req, res) => {
  if (req.session.userId) {
    return res.status(200).render('home.html', {
      ask: '_partials/home/auth/ask.html',
      headerClass: 'auth-header-section-link',
      menuOption: '_partials/home/auth/menu-button.html',
      script: '/js/auth/home.js',
      title: tabBar,
      user: req.sessionusername
    });
  }
  res.status(200).render('home.html', {
    headerClass: 'unauth-header-section-link',
    menuOption: '_partials/home/unauth/menu-button.html',
    intro: '_partials/home/unauth/intro.html',
    script: '/js/unauth/home.js',
    title: tabBar,
    unauthIntro: '_partials/home/unauth/intro.html',
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
