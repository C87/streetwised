const app = {
  container: document.querySelector('.main-container'),
  commentsTemplate: document.querySelector('.main-article-template'),
  header: document.querySelector('.header-section-title'),
  main: document.querySelector('.main'),
  mainTemplate: document.querySelector('.main-section-template'),
};

const form = {
  button: document.querySelector('.auth-section-form-button'),
  element: document.querySelector('.auth-section-form'),
  input: document.querySelector('.auth-section-form-textarea'),
};

document.querySelector('.header-section-button').addEventListener('click', () => {
  window.history.back();
});

app.container.style.paddingRight = `${app.container.offsetWidth - app.container.clientWidth}px`;

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

app.comments = (comments) => {
  comments.forEach((el) => {
    const template = app.commentsTemplate.cloneNode(true);
    template.classList.remove('main-article-template');
    template.querySelector('.main-article-section-header-title').textContent = el.user.username;
    template.querySelector('.main-article-section-header-image').src = el.user.avatar;
    template.querySelector('.main-article-content').textContent = el.text;
    app.container.appendChild(template);
  });
};

app.post = (data) => {
  const template = app.mainTemplate.cloneNode(true);
  template.classList.remove('main-section-template');
  template.querySelector('.main-section-image').src = data.properties.user.avatar;
  template.querySelector('.main-section-container-content').textContent = data.properties.text;
  template.querySelector('.main-section-secondary-container-title').textContent = data.properties.location;
  app.container.appendChild(template);
  return data.properties.comments;
};

app.update = (comment) => {
  const template = app.commentsTemplate.cloneNode(true);
  template.classList.remove('main-article-template');
  template.querySelector('.main-article-section-header-title').textContent = comment.user;
  template.querySelector('.main-article-section-header-image').src = comment.avatar;
  template.querySelector('.main-article-content').textContent = comment.text;
  app.container.appendChild(template);
  app.container.scrollTo(0, app.container.scrollHeight);
};

form.input.addEventListener('click', () => {
  app.main.style.height = 'calc(100% - 120px)';
});

form.button.addEventListener('click', (e) => {
  e.preventDefault();
  app.main.style.height = 'calc(100% - 120px)';
  if (!form.input.value) return;

  const fd = new FormData(form.element);
  form.input.value = '';

  fetch('/new-comment', {
    method: 'POST',
    credentials: 'same-origin',
    body: fd,
  }).then(res => res.json())
    .then(res => app.update(res))
    .catch(err => console.log(err));
});

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

const user = {
  name: window.location.pathname.split('/')[1],
  post: window.location.pathname.split('/')[3],
};

const url = `/${user.name}/posts/${user.post}.json`;

fetch(url, {
  method: 'GET',
  credentials: 'same-origin',
}).then(res => res.json())
  .then(res => app.post(res))
  .then(res => app.comments(res))
  .catch(err => console.log(err));
