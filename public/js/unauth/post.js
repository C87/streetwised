const app = {
  container: document.querySelector('.main-container'),
  commentsTemplate: document.querySelector('.main-article-template'),
  header: document.querySelector('.header-section-title'),
  main: document.querySelector('.main'),
  mainTemplate: document.querySelector('.main-section-template'),
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
