const app = {
  form: {
    cancel: document.querySelector('.main-buttons-cancel'),
    confirm: document.querySelector('.main-buttons-post'),
    element: document.querySelector('.main-form'),
    textarea: document.querySelector('.main-form-textarea'),
  },
  header: {
    icon: document.querySelector('.header-section-icon'),
    title: document.querySelector('.header-container-title'),
  }
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
app.back = () => {
  app.form.textarea.value = '';
  window.history.back();
};

app.form.cancel.addEventListener('click', app.back);
app.header.icon.addEventListener('click', app.back);

app.form.textarea.style.paddingRight = `${app.form.textarea.offsetWidth - app.form.textarea.clientWidth}px`;

app.form.submit = (e) => {
  e.preventDefault();
  const fd = new FormData(app.form.element);
  app.form.textarea.value = '';

  fetch('/new-post', {
    method: 'POST',
    credentials: 'same-origin',
    body: fd,
  }).then(res => res.json())
    .then(() => app.back())
    .catch(err => console.log(err));
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

app.form.confirm.addEventListener('click', app.form.submit);
