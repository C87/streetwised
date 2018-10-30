document.querySelector('.header-section-route').addEventListener('click', () => {
  if (document.referrer === 'https://streetwised.com/account') {
    window.location = 'https://streetwised.com/';
  } else if (document.referrer === 'https://staging.streetwised.com/account') {
    window.location = 'https://staging.streetwised.com/';
  } else {
    window.history.back();
  }
});

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
const i = new Image();

document.querySelector('.form-input').addEventListener('change', () => {
  const file = document.querySelector('.form-input').files[0];
  const reader = new FileReader();
  reader.addEventListener('load', () => { i.src = reader.result; });
  if (file && file.type.startsWith('image/')) reader.readAsDataURL(file);
});

document.querySelector('.edit-image').addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('.form-input').click();
});

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

const send = (file, rotate) => {
  document.querySelector('.spinner').style.display = 'block';
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
      if (res.code === 200) {
        setTimeout(() => {
          fetch(res.url, {
            method: 'GET',
            cache: 'reload',
            mode: 'cors',
          })
            .then((response) => {
              document.querySelector('.user-image').src = response.url;
              document.querySelector('.edit-image').textContent = 'Image updated';
              document.querySelector('.spinner').style.display = 'none';
            })
            .catch((error) => {
              document.querySelector('.spinner').style.display = 'none';
            });
        }, 5000);
        return;
      }
      form.alert.textContent = res.body;
    })
    .catch((err) => {
      document.querySelector('.spinner').style.display = 'none';
    });
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

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
  send(canvas.toDataURL('image/jpeg', 1), canvas.rotate);
});

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

document.querySelector('.alert-icon').addEventListener('click', () => {
  document.querySelector('.alert').textContent = '';
  document.querySelector('.alert-container').style.display = 'none';
});
