const button = {
  buffer: document.querySelector('.buffer-button'),
  cancel: document.querySelector('.main-form-button-container-cancel'),
  selectImage: document.querySelector('.main-form-container-button-image'),
  save: document.querySelector('.main-form-button-container-save'),
  zoomContainer: document.querySelector('.main-form-crop-zoom'),
  zoomIn: document.querySelector('.main-form-crop-zoom-in'),
  zoomOut: document.querySelector('.main-form-crop-zoom-out'),
};

const form = {
  alert: document.querySelector('.main-form-alert'),
  element: document.querySelector('.main-form'),
};

const image = {
  boundary: document.querySelector('.main-form-crop-container-boundary'),
  boundarySize: 200,
  container: document.querySelector('.main-form-crop-container'),
  element: document.querySelector('.main-form-crop-container-image'),
};

const input = {
  hidden: document.querySelector('.main-form-hidden-input'),
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

form.handleFile = (e) => {
  if (!e.target.files[0] || !e.target.files[0].type.startsWith('image/')) return;
  const file = e.target.files[0];
  image.element.file = file;

  console.log(file);

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.addEventListener('load', (event) => {
    console.log(event);
    image.element.src = event.target.result;
  });
};

input.hidden.addEventListener('change', form.handleFile);

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

image.adjust = () => {
  // Resize image
  image.resize(image.boundarySize + 100);
  // Adjust margins
  image.left = 0 - ((image.element.width - image.boundarySize) / 2);
  image.top = 0 - ((image.element.height - image.boundarySize) / 2);
  image.element.style.marginLeft = `${image.left}px`;
  image.element.style.marginTop = `${image.top}px`;
};

image.resize = (size) => {
  if (size < 200 || size > 500) return;
  if (image.dimension === 'height') image.element.style.height = `${size}px`;
  if (image.dimension === 'width') image.element.style.width = `${size}px`;
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

/* When image loads, if the image is a portrait we need to adjust the shorter
width to fit the width of the cropBox, if the image is a landscape we need to
asjust the shorter height to fit the height of the cropBox. */

image.element.addEventListener('load', (e) => {
  console.log(e);
  // Display container and zoom buttons
  image.container.style.display = 'block';
  button.zoomContainer.style.display = 'flex';
  button.buffer.classList.remove('spinner');
  button.buffer.classList.add('check-circle');
  // Primary image dimension
  image.dimension = e.target.naturalHeight > e.target.naturalWidth ? 'width' : 'height';
  console.log(image);
  image.adjust();
});

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

image.element.setAttribute('drag', false);

image.disableDrag = () => {
  image.left = image.activeX;
  image.top = image.activeY;
  image.element.attributes.drag.value = 'false';
};

image.enableDrag = (x, y) => {
  image.startX = x;
  image.startY = y;
  image.element.setAttribute('drag', true);
};

image.drag = (x, y) => {
  if (image.element.attributes.drag.value !== 'true') { return; }
  image.activeX = image.left + (x - image.startX);
  image.activeY = image.top + (y - image.startY);
  image.element.style.marginLeft = `${image.activeX}px`;
  image.element.style.marginTop = `${image.activeY}px`;
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

image.container.addEventListener('mousedown', (e) => {
  image.enableDrag(e.layerX, e.layerY);
});

image.container.addEventListener('touchstart', (e) => {
  image.enableDrag(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
});

image.container.addEventListener('mousemove', (e) => {
  image.drag(e.layerX, e.layerY);
});

image.container.addEventListener('touchmove', (e) => {
  image.drag(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
});

image.container.addEventListener('mouseleave', image.disableDrag);
image.container.addEventListener('mouseup', image.disableDrag);
image.container.addEventListener('touchend', image.disableDrag);

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

button.zoomIn.addEventListener('click', (e) => {
  e.preventDefault();
  const size = image.dimension === 'height' ? image.element.height : image.element.width;
  image.resize(size + 50);
});
button.zoomOut.addEventListener('click', (e) => {
  e.preventDefault();
  const size = image.dimension === 'height' ? image.element.height : image.element.width;
  image.resize(size - 50);
});

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

button.selectImage.addEventListener('click', (e) => {
  e.preventDefault();
  input.hidden.click();
  button.buffer.classList.add('spinner');
});

button.cancel.addEventListener('click', (e) => {
  e.preventDefault();
  window.location.replace('/');
});

button.save.addEventListener('click', (e) => {
  e.preventDefault();
  const fd = new FormData(form.element);
  if (input.hidden.files.length > 0) {
    fd.append('image', [
      image.element.offsetHeight,
      image.element.offsetWidth,
      Math.abs(image.element.offsetLeft),
      Math.abs(image.element.offsetTop),
      image.boundarySize,
    ]);
  }

  const url = '/new-avatar';

  fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    body: fd,
  }).then(res => res.json())
    .then((res) => {
      if (res.code === 301) { return window.location.replace(res.url); }
      form.alert.textContent = res.body;
    })
    .catch(err => console.log(err));
});
