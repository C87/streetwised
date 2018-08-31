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

app.send = (file, width, height) => {
  const fd = new FormData();
  fd.append('avatar', file);
  fd.append('height', height);
  fd.append('width', width);

  fetch('/new-avatar', {
    method: 'POST',
    credentials: 'same-origin',
    body: fd
  })
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.log(err));

  // fetch("https://httpbin.org/post", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/octet-stream" },
  //       body: imageAsBase64

  // const url = '/new-avatar';

  // fetch(url, {
  //   method: 'POST',
  //   credentials: 'same-origin',
  //   contentType: false,
  //   body: fd,
  // })
  //   .then(res => res.json)
  //   .then(res => console.log(res))
  //   .catch(err => console.log(err));
};

i.addEventListener('load', () => {
  const canvas = document.createElement('canvas');
  const px = 200;
  canvas.width = i.width > i.height ? px * (i.width / i.height) : px;
  canvas.height = i.width > i.height ? px : px * (i.height / i.width);
  const context = canvas.getContext('2d');
  context.drawImage(i, 0, 0, canvas.width, canvas.height);
  // document.querySelector('.main').appendChild(canvas);
  app.send(canvas.toDataURL('image/jpeg', 0.75), canvas.width, canvas.height);
});
