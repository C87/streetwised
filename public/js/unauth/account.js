const app = {
  back: document.querySelector('.header-section-route'),
  text: document.querySelector('.section-title-span-text'),
  link: document.querySelector('.section-title-span-link'),
};

const buffer = {
  name: document.querySelector('.signup-buffer-name'),
  email: document.querySelector('.signup-buffer-email'),
  password: document.querySelector('.signup-buffer-password'),
  username: document.querySelector('.signup-buffer-username'),
};

const login = {
  alert: document.querySelector('.login-form-alert'),
  element: document.querySelector('.login-form'),
  submit: document.querySelector('.login-form-button-submit'),
};

const signup = {
  alert: document.querySelector('.signup-form-alert'),
  element: document.querySelector('.signup-form'),
  email: document.querySelector('.signup-email'),
  name: document.querySelector('.signup-name'),
  password: document.querySelector('.signup-password'),
  submit: document.querySelector('.signup-form-button-submit'),
  username: document.querySelector('.signup-username'),
};

app.back.addEventListener('click', () => {
  window.history.back();
});

app.link.addEventListener('click', (e) => {
  if (e.target.textContent === 'Log in') {
    login.element.style.display = 'block';
    signup.element.style.display = 'none';
    app.text.textContent = "Don't have an account? ";
    app.link.textContent = 'Sign up';
  } else if (e.target.textContent === 'Sign up') {
    signup.element.style.display = 'block';
    login.element.style.display = 'none';
    app.text.textContent = 'Have an account? ';
    app.link.textContent = 'Log in';
  }
});

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

login.submit.addEventListener('click', (e) => {
  e.preventDefault();
  const fd = new FormData(login.element);

  fetch('/session-login', {
    method: 'POST',
    credentials: 'same-origin',
    body: fd,
  }).then(res => res.json())
    .then((res) => {
      if (res.code === 301) { return window.location.replace(res.url); }
      // login.alert.textContent = res.body;
    })
    .catch(err => console.log(err));
});

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

signup.submit.addEventListener('click', (e) => {
  e.preventDefault();
  const fd = new FormData(signup.element);

  fetch('/session-signup', {
    method: 'POST',
    credentials: 'same-origin',
    body: fd,
  }).then(res => res.json())
    .then((res) => {
      if (res.code === 301) { return window.location.replace(res.url); }
      // signup.alert.textContent = res.body;
    })
    .catch(err => console.log(err));
});

signup.query = (key, value, url, icon) => {
  const fd = new FormData();
  fd.append(key, value);
  icon.classList.add('times-circle');

  fetch(url, {
    method: 'POST',
    body: fd,
  })
    .then(res => res.json())
    .then((res) => {
      if (res.code === 200) {
        icon.classList.remove('times-circle');
        return icon.classList.add('check-circle');
      }
      icon.classList.add('times-circle');
    }).catch((err) => {
      icon.classList.add('times-circle');
    });
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

signup.email.addEventListener('focusout', () => {
  if (signup.email.value.length < 8) {
    buffer.email.classList.add('times-circle');
    return;
  }
  signup.query('email', signup.email.value, '/validate-email', buffer.email);
});

signup.name.addEventListener('focusout', () => {
  if (signup.name.value.length < 3) buffer.name.classList.add('times-circle');
  if (signup.name.value.length >= 3) {
    buffer.name.classList.remove('times-circle');
    buffer.name.classList.add('check-circle');
  }
});

signup.password.addEventListener('focusout', () => {
  if (signup.password.value.length < 8) {
    buffer.password.classList.add('times-circle');
    return;
  }
  signup.query('password', signup.password.value, '/validate-password', buffer.password);
});

signup.username.addEventListener('focusout', () => {
  if (signup.username.value.length < 3) {
    buffer.username.classList.add('times-circle');
    return;
  }
  signup.query('username', signup.username.value, '/validate-username', buffer.username);
});
