const app = {
  main: document.querySelector('.main'),
  responseContainer: document.querySelector('.response-container'),
  responseTemplate: document.querySelector('.response-template'),
  questionTemplate: document.querySelector('.question-template'),
};

const form = {
  button: document.querySelector('.form-button'),
  element: document.querySelector('.form'),
  input: document.querySelector('.form-response'),
};

document.querySelector('.header-section-route').addEventListener('click', () => {
  window.history.back();
});

// app.container.style.paddingRight = `${app.container.offsetWidth - app.container.clientWidth}px`;

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

app.comments = (comments) => {
  comments.forEach((el) => {
    const template = app.responseTemplate.cloneNode(true);
    template.classList.remove('response-template');
    template.classList.add('response');
    template.querySelector('.response-name').textContent = el.user.username;
    template.querySelector('.response-image').src = el.user.avatar;
    template.querySelector('.response-text').textContent = el.text;
    app.responseContainer.appendChild(template);
  });
};

app.post = (data) => {
  const template = app.questionTemplate.cloneNode(true);
  template.classList.remove('question-template');
  template.classList.add('question');
  template.querySelector('.user-image').src = data.properties.user.avatar;
  template.querySelector('.user-name').textContent = data.properties.user.username;
  template.querySelector('.content-text').textContent = data.properties.text;
  if (data.properties.tag) {
    template.querySelector('.content-tag').textContent = data.properties.tag;
  }
  app.main.insertBefore(template, app.responseContainer);
  return data.properties.comments;
};

app.update = (comment) => {
  const template = app.responseTemplate.cloneNode(true);
  template.classList.remove('response-template');
  template.classList.add('response');
  template.querySelector('.response-name').textContent = comment.user;
  template.querySelector('.response-image').src = comment.avatar;
  template.querySelector('.response-text').textContent = comment.text;
  app.responseContainer.appendChild(template);
  app.responseContainer.scrollTo(0, app.responseContainer.scrollHeight);
};

if (form.element) {
  form.button.addEventListener('click', (e) => {
    e.preventDefault();
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
}


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
