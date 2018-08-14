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
      authDialog: '_partials/home/auth/dialog.html',
      header: '_partials/home/auth/header.html',
      script: '/js/auth/home.js',
      title: tabBar,
    });
  }
  res.status(200).render('home.html', {
    header: '_partials/home/unauth/header.html',
    script: '/js/unauth/home.js',
    title: tabBar,
  });
};

module.exports.post = (req, res) => {
  if (req.session.userId) {
    return res.status(200).render('post.html', {
      header: '_partials/post/auth/header.html',
      id: req.params.postId,
      section: '_partials/post/auth/section.html',
      script: '/js/auth/post.js',
      title: tabBar,
      user: req.params.username,
    });
  }
  res.status(200).render('post.html', {
    header: '_partials/post/unauth/header.html',
    id: req.params.postId,
    section: '_partials/post/unauth/section.html',
    script: '/js/unauth/post.js',
    title: tabBar,
    user: req.params.username,
  });
};
