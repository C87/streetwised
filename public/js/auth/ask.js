const app = {
  form: {
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
    .then(() => {
      app.form.question.value = '';
      app.form.tag.value = '';
      window.location.replace(document.referrer);
    })
    .catch(err => console.log(err));
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

document.querySelector('.controller-post').addEventListener('click', app.form.submit);
document.querySelector('.controller-cancel').addEventListener('click', app.back);
document.querySelector('.header-section-route').addEventListener('click', app.back);
