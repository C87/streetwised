const app = {
  form: {
    element: document.querySelector('.form'),
    qCount: document.querySelector('.question-count'),
    question: document.querySelector('.question'),
    tCount: document.querySelector('.tag-count'),
    tag: document.querySelector('.tag'),
  },
};


// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

document.querySelector('.header-section-route').addEventListener('click', () => {
  app.form.question.value = '';
  app.form.tag.value = '';
  window.history.back();
});

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

document.querySelector('.button').addEventListener('click', (e) => {
  e.preventDefault();
  const fd = new FormData(app.form.element);
  if (app.form.question.value.length < 1) {
    document.querySelector('.alert-container').style.display = 'block';
    document.querySelector('.alert').textContent = 'Question is required';
    return;
  }
  if (app.form.question.value.length > 90) {
    document.querySelector('.alert-container').style.display = 'block';
    document.querySelector('.alert').textContent = 'Question must not exceed 90 characters';
    return;
  } else if (app.form.tag.value.length > 8) {
    document.querySelector('.alert-container').style.display = 'block';
    document.querySelector('.alert').textContent = 'Tag must not exceed 8 characters';
  }
  app.form.question.value = '';
  app.form.tag.value = '';

  fetch('/new-post', {
    method: 'POST',
    credentials: 'same-origin',
    body: fd,
  }).then(res => res.json())
    .then((res) => {
      if (res.code === 301) { return window.location.replace(document.referrer); }
      throw res.body;
    })
    .catch((err) => {
      document.querySelector('.alert-container').style.display = 'block';
      document.querySelector('.alert').textContent = err;
    });
});

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

app.form.question.addEventListener('keyup', (e) => {
  app.form.qCount.textContent = 90 - app.form.question.value.length;
  app.form.qCount.style.color = app.form.qCount.textContent >= 0 ? 'rgb(31, 152, 172)' : 'rgb(239, 62, 74)';
});

// app.form.question.addEventListener('keypress', () => {
//   const limit = 90;
//   const characters = app.form.question.value.length + 1;
//   app.form.qCount.textContent = limit - characters;
//   const color = app.form.qCount.textContent >= 0 ? 'rgb(31, 152, 172)' : 'rgb(239, 62, 74)';
//   app.form.qCount.style.color = color;
// });


// app.form.tag.addEventListener('keypress', () => {
//   const limit = 8;
//   const characters = app.form.tag.value.length + 1;
//   app.form.tCount.textContent = limit - characters;
//   const color = app.form.tCount.textContent >= 0 ? 'rgb(31, 152, 172)' : 'rgb(239, 62, 74)';
//   app.form.tCount.style.color = color;
// });

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

// app.form.question.addEventListener('keydown', (e) => {
//   if (e.key === 'Backspace') {
//     characters = 90 - app.form.question.value.length;
//     app.form.qCount.textContent = characters;
//   }
//   const color = app.form.qCount.textContent >= 0 ? 'rgb(31, 152, 172)' : 'rgb(239, 62, 74)';
//   app.form.qCount.style.color = color;
// });

// app.form.tag.addEventListener('keydown', (e) => {
//   if (e.key === 'Backspace') {
//     const limit = 8;
//     const characters = app.form.tag.value.length;
//     app.form.tCount.textContent = limit - characters;
//   }
//   const color = app.form.tCount.textContent >= 0 ? 'rgb(31, 152, 172)' : 'rgb(239, 62, 74)';
//   app.form.tCount.style.color = color;
// });

document.querySelector('.alert-icon').addEventListener('click', () => {
  document.querySelector('.alert').textContent = '';
  document.querySelector('.alert-container').style.display = 'none';
});

// app.form.tag.addEventListener('keyup', (e) => {
//   app.form.question.value = app.form.tag.value.length;
// });
