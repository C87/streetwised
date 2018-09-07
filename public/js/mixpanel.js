// Client side analytics monitor other properties like browser, location,

const analytics = {};

analytics.signup = (user, name, email) => {
  // mixpanel.identify(user);
  // mixpanel.track('User Signup');
  // mixpanel.people.set({
  //   $name: name,
  //   $email: email,
  //   username: user,
  // });
};

analytics.login = (user) => {
  // mixpanel.identify(user);
  // mixpanel.track('User Login');
};

analytics.question = (t, ql, tl) => {
  // mixpanel.track('Question Asked', {
  //   Tag: t,
  //   'Question Length': ql,
  //   'Tag Length': tl,
  // });
};

analytics.response = (t, ql, rl) => {
  // mixpanel.track('Question Response', {
  //   Tag: t,
  //   'Question Length': ql,
  //   'Response Length': rl,
  // });
};
