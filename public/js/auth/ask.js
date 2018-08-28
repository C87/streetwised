const app = {
  form: {
    cancel: document.querySelector('.controller-cancel'),
    confirm: document.querySelector('.controller-post'),
    element: document.querySelector('.form'),
    question: document.querySelector('.form-question'),
    tag: document.querySelector('.form-tag')
  },
};


// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

app.back = () => {
  app.form.question.value = '';
  app.form.tag.value = '';
  window.history.back();
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

app.form.submit = (e) => {
  e.preventDefault();
  const fd = new FormData(app.form.element);
  app.form.question.value = '';
  app.form.tag.value = '';

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
app.form.cancel.addEventListener('click', app.back);
document.querySelector('.header-section-route').addEventListener('click', app.back);
