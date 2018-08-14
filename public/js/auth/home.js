const button = {
  geo: document.querySelector('.menu-section-header-geo'),
  preview: document.querySelector('.preview-section'),
  modal: document.querySelector('.auth-header-section-button'),
  search: document.querySelector('.menu-section-header-search'),
  view: document.querySelector('.menu-section-header-button'),
  zoomIn: document.querySelector('.mapboxgl-zoom-in'),
  zoomOut: document.querySelector('.mapboxgl-zoom-out'),
};

const modal = {
  element: document.querySelector('.modal'),
  content: {
    close: document.querySelector('.modal-content-banner-icon'),
    comments: document.querySelector('.modal-content-buttons-link-content'),
    element: document.querySelector('.modal-content'),
    icon: document.querySelector('.modal-content-buttons-icon'),
    image: document.querySelector('.modal-content-image'),
    link: document.querySelector('.modal-content-buttons-link'),
    location: document.querySelector('.modal-content-container-title'),
    text: document.querySelector('.modal-content-text'),
    title: document.querySelector('.modal-content-title'),
  },
  dialog: {
    cancel: document.querySelector('.auth-modal-dialog-buttons-cancel'),
    close: document.querySelector('.auth-modal-dialog-banner-icon'),
    element: document.querySelector('.auth-modal-dialog'),
    form: document.querySelector('.auth-modal-dialog-form'),
    submit: document.querySelector('.auth-modal-dialog-buttons-post'),
    textarea: document.querySelector('.auth-modal-dialog-form-textarea'),
  },
};

const app = {
  map: document.querySelector('#main'),
  menu: {
    element: document.querySelector('.menu-section'),
    input: document.querySelector('.menu-section-header-input'),
    results: document.querySelector('.menu-section-list'),
  },
  preview: {
    container: document.querySelector('.preview-container'),
    element: document.querySelector('.preview-section'),
  },
  view: {
    container: document.querySelector('.view-container'),
    element: document.querySelector('.view-section'),
  },
  // view:
  // view: document.querySelector('.view-section'),
};

// ---------------------------- Firefox Hide Scrollbar -------------------------

app.preview.element.style.paddingBottom = `${app.preview.element.offsetHeight - app.preview.element.clientHeight}px`;

// -----------------------------------------------------------------------------

app.geo = () => {
  button.geo.classList.remove('menu-section-header-geo');
  button.geo.classList.add('menu-section-header-spinner');
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  const result = new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });

  button.search.classList.remove('disable');
  button.search.classList.add('enable');
  button.search.style.backgroundImage = 'url(../assets/icons/search-light.svg)';
  app.menu.input.style.display = 'none';
  button.view.style.display = 'block';
  app.menu.input.value = '';
  app.map.style.display = 'block';
  app.preview.element.style.display = 'flex';
  app.preview.container.style.display = 'block';

  result
    .then(pos => map.element.flyTo({
      center: [pos.coords.longitude, pos.coords.latitude],
      zoom: 14,
      speed: 0.8,
    }))
    .then(data.geocode)
    .then(() => {
      button.geo.classList.remove('menu-section-header-spinner');
      button.geo.classList.add('menu-section-header-geo');
    })
    .catch(err => console.log(err));
};

app.contentModal = () => {
  modal.element.style.display = 'block';
  modal.content.element.style.display = 'none';
  modal.dialog.element.style.display = 'block';
  modal.dialog.textarea.style.paddingRight = `${modal.dialog.textarea.offsetWidth - modal.dialog.textarea.clientWidth}px`;
};

app.previewModal = (e) => {
  modal.element.style.display = 'flex';
  modal.dialog.element.style.display = 'none';
  modal.content.image.src = e.target.src;
  modal.content.title.textContent = e.target.dataset.user;
  modal.content.text.textContent = e.target.dataset.post;
  modal.content.location.textContent = e.target.dataset.location;
  modal.content.comments.textContent = e.target.dataset.comments;
  modal.content.link.href = e.target.dataset.url;
  modal.content.icon.dataset.lng = e.target.dataset.lng;
  modal.content.icon.dataset.lat = e.target.dataset.lat;
  modal.content.icon.onclick = app.flyFromModal;
  modal.content.element.style.display = 'block';
  modal.content.text.style.paddingRight = `${modal.content.text.offsetWidth - modal.content.text.clientWidth}px`;
};

app.removeModal = () => {
  modal.element.style.display = 'none';
  modal.content.element.style.display = 'none';
  modal.content.image.removeAttribute('src');
  modal.content.link.removeAttribute('href');
  modal.content.icon.removeAttribute('data-lng');
  modal.content.icon.removeAttribute('data-lat');
  modal.content.title.textContent = '';
  modal.content.text.textContent = '';
  modal.content.location.textContent = '';
  modal.content.comments.textContent = '';
  modal.dialog.textarea.value = '';
};

app.searchEnable = () => {
  app.map.style.display = 'none';
  app.preview.element.style.display = 'none';
  app.preview.container.style.display = 'none';
  app.menu.element.height = 'calc(100% - 60px)';
};

app.toggleSearch = (e) => {
  e.target.classList.forEach((el) => {
    if (el === 'enable') {
      button.search.classList.remove('enable');
      button.search.classList.add('disable');
      button.search.style.backgroundImage = 'url(../assets/icons/times-circle-light-cancel-colored.svg)';
      button.view.style.display = 'none';
      app.menu.input.style.display = 'block';
    } else if (el === 'disable') {
      button.search.classList.remove('disable');
      button.search.classList.add('enable');
      button.search.style.backgroundImage = 'url(../assets/icons/search-light.svg)';
      app.menu.input.style.display = 'none';
      button.view.style.display = 'block';
      app.menu.input.value = '';
      app.map.style.display = 'block';
      app.preview.element.style.display = 'flex';
      app.preview.container.style.display = 'block';
    }
  });
};

app.toggleView = () => {
  if (button.view.textContent === 'View All') {
    app.map.style.display = 'none';
    app.preview.element.style.display = 'none';
    app.preview.container.style.display = 'none';
    button.view.textContent = 'Explore Map';
    app.view.element.style.display = 'block';
    app.view.container.style.width = `${app.view.container.offsetWidth + (app.view.container.offsetWidth - app.view.container.clientWidth)}px`;
  } else if (button.view.textContent === 'Explore Map') {
    app.view.element.style.display = 'none';
    button.view.textContent = 'View All';
    app.map.style.display = 'block';
    app.preview.element.style.display = 'flex';
    app.preview.container.style.display = 'block';
    app.menu.element.height = '60px';
  }
};

app.flyFromModal = (e) => {
  const coordinates = [parseFloat(e.target.dataset.lng), parseFloat(e.target.dataset.lat)];
  app.removeModal();
  app.travel(coordinates);
};

app.flyFormSearch = (e) => {
  const coordinates = [parseFloat(e.target.dataset.lng), parseFloat(e.target.dataset.lat)];
  const arr = document.querySelectorAll('.menu-section-list-item');
  if (arr.length !== 0) {
    arr.forEach((el) => {
      el.remove();
    });
  }
  app.menu.input.value = '';
  app.map.style.display = 'block';
  app.preview.element.style.display = 'flex';
  app.preview.container.style.display = 'block';
  app.menu.element.height = '60px';
  button.search.classList.remove('disable');
  button.search.classList.add('enable');
  button.search.style.backgroundImage = 'url(../assets/icons/search-light.svg)';
  app.menu.input.style.display = 'none';
  button.view.style.display = 'block';
  app.travel(coordinates);
};

app.travel = (coordinates) => {
  map.element.flyTo({
    center: coordinates,
    zoom: 14,
    speed: 0.8,
  });
};

data.list = (res) => {
  const arr = document.querySelectorAll('.menu-section-list-item');
  if (arr.length !== 0) {
    arr.forEach((el) => {
      el.remove();
    });
  }

  res.forEach((el) => {
    const item = document.querySelector('.menu-section-list-item-template').cloneNode(true);
    item.classList.remove('menu-section-list-item-template');
    item.classList.add('menu-section-list-item');
    item.dataset.lng = el.lng;
    item.dataset.lat = el.lat;
    item.textContent = el.name;
    item.onclick = app.flyFormSearch;
    app.menu.results.appendChild(item);
  });
};

data.reverseGeo = (value) => {
  fd = new FormData();
  fd.append('text', value);
  fetch('/reverse-geo', {
    method: 'POST',
    origin: 'same-origin',
    body: fd,
  }).then(res => res.json())
    .then(res => data.list(res))
    .catch(err => console.log(err));
};
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

app.menu.input.addEventListener('click', app.searchEnable);
app.menu.input.addEventListener('keyup', () => { if (app.menu.input.value.length > 3) data.reverseGeo(app.menu.input.value); });
button.modal.addEventListener('click', app.contentModal);
modal.element.addEventListener('click', (e) => { if (e.target.className === 'modal') { app.removeModal(); } });
button.geo.addEventListener('click', app.geo);
button.search.addEventListener('click', app.toggleSearch);
button.view.addEventListener('click', app.toggleView);
button.zoomIn.addEventListener('click', () => map.element.zoomIn());
button.zoomOut.addEventListener('click', () => map.element.zoomOut());

modal.content.close.addEventListener('click', app.removeModal);
modal.dialog.close.addEventListener('click', app.removeModal);
modal.dialog.cancel.addEventListener('click', app.removeModal);

modal.dialog.submit.addEventListener('click', (e) => {
  e.preventDefault();
  const fd = new FormData(modal.dialog.form);
  modal.dialog.textarea.value = '';

  fetch('/new-post', {
    method: 'POST',
    credentials: 'same-origin',
    body: fd,
  }).then(res => res.json())
    .then(data.dbQuery)
    // .then(res => data.preview(res))
    // .then(res => data.view(res))
    .then(() => app.removeModal())
    .catch(err => console.log(err));
});
