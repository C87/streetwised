const app = {
  button: {
    buffer: document.querySelector('.buffer-button'),
    save: document.querySelector('.save'),
    select: document.querySelector('.button'),
    skip: document.querySelector('.skip'),
  },
  input: {
    element: document.querySelector('.form-input'),
  },
  zoom: {
    element: document.querySelector('.zoom'),
    in: document.querySelector('.zoom-in'),
    out: document.querySelector('.zoom-out'),
  },
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
const i = new Image();

app.input.element.addEventListener('change', () => {
  const file = app.input.element.files[0];
  const reader = new FileReader();
  reader.addEventListener('load', () => { i.src = reader.result; });
  if (file && file.type.startsWith('image/')) reader.readAsDataURL(file);
});

app.button.select.addEventListener('click', (e) => {
  e.preventDefault();
  app.input.element.click();
  app.button.buffer.classList.add('spinner');
});

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

app.send = (file, rotate) => {
  const fd = new FormData();
  fd.append('avatar', file);
  fd.append('rotate', rotate);

  fetch('/new-avatar', {
    method: 'POST',
    credentials: 'same-origin',
    body: fd
  })
    .then(res => res.json())
    .then((res) => {
      if (res.code === 301) { return window.location.replace(res.url); }
      form.alert.textContent = res.body; // Abs positioned alert textContent is equal to res body.
    })
    .catch(err => console.log(err));
};

i.addEventListener('load', () => {
  const canvas = document.createElement('canvas');
  EXIF.getData(i, () => {
    canvas.rotate = EXIF.getTag(i, 'Orientation') === 6 ? 90 : 0;
  });
  const px = 200;
  canvas.width = i.width > i.height ? px * (i.width / i.height) : px;
  canvas.height = i.width > i.height ? px : px * (i.height / i.width);
  const context = canvas.getContext('2d');
  context.drawImage(i, 0, 0, canvas.width, canvas.height);
  app.send(canvas.toDataURL('image/jpeg', 1), canvas.rotate);
});
