const app = {
  ask: {
    element: document.querySelector('.ask'),
    return: document.querySelector('.ask-header-section-icon'),
    textarea: document.querySelector('.ask-form-textarea'),
  },
  header: {
    element: document.querySelector('.header'),
    title: document.querySelector('.header-container-title'),
  },
  intro: {
    element: document.querySelector('.intro'),
    button: document.querySelector('.intro-section-button'),
  },
  map: {
    element: document.querySelector('#mapboxgl'),
    geo: document.querySelector('.mapboxgl-options-geo'),
    search: document.querySelector('.mapboxgl-options-search'),
    zoomIn: document.querySelector('.mapboxgl-zoom-in'),
    zoomOut: document.querySelector('.mapboxgl-zoom-out'),
  },
  modal: {
    element: document.querySelector('.modal'),
    return: document.querySelector('.modal-content-banner-close'),
  },
  menu: {
    element: document.querySelector('.menu'),
    view: document.querySelector('.menu-questions'),
  },
  preview: {
    container: document.querySelector('.preview-container'),
    element: document.querySelector('.preview'),
    image: document.querySelectorAll('.preview-image'),
  },
  search: {
    element: document.querySelector('.search'),
    input: document.querySelector('.search-header-section-container-input'),
    list: document.querySelector('.search-list'),
    return: document.querySelector('.search-header-section-icon'),
  },
  view: {
    container: document.querySelector('.view-container'),
    element: document.querySelector('.view'),
  },
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

app.preview.element.style.paddingBottom = `${app.preview.element.offsetHeight - app.preview.element.clientHeight}px`;

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
app.modal.display = (e) => {
  app.modal.element.style.display = 'block';
  document.querySelector('.modal-content-image').src = e.target.src;
  document.querySelector('.modal-content-title').textContent = e.target.dataset.user;
  document.querySelector('.modal-content-text').textContent = e.target.dataset.post;
  document.querySelector('.modal-content-container-title').textContent = e.target.dataset.location;
  document.querySelector('.modal-content-banner-comments-count').textContent = e.target.dataset.comments;
  document.querySelector('.modal-content-banner-comments').href = e.target.dataset.url;
  document.querySelector('.modal-content-banner-travel').dataset.lng = e.target.dataset.lng;
  document.querySelector('.modal-content-banner-travel').dataset.lat = e.target.dataset.lat;
  document.querySelector('.modal-content-banner-travel').onclick = app.modal.fly;
  document.querySelector('.modal-content').style.display = 'block';
  const text = document.querySelector('.modal-content-text');
  text.style.paddingRight = `${text.offsetWidth - text.clientWidth}px`;
};


app.enableGeo = () => {
  app.map.geo.classList.forEach((el) => {
    // Will run first time, if request in rejected then add disabled to class
    if (el === 'enabled') {
      app.map.geo.classList.remove('mapboxgl-options-geo');
      app.map.geo.classList.add('mapboxgl-options-spinner');

      const result = new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      });

      result
        .then(pos => app.fly([pos.coords.longitude, pos.coords.latitude]))
        .then(data.geocode)
        .then(() => {
          app.map.geo.classList.remove('mapboxgl-options-spinner');
          app.map.geo.classList.add('mapboxgl-options-geo');
        })
        .catch(() => {
          // Disable icon
          app.map.geo.classList.remove('enabled');
          app.map.geo.classList.add('disabled');
          app.map.geo.classList.remove('mapboxgl-options-spinner');
          app.map.geo.classList.add('mapboxgl-options-geo-disabled');
        });
    }
  });
};

app.enableSearch = () => {
  app.header.element.style.display = 'none';
  app.map.element.style.display = 'none';
  app.preview.container.style.display = 'none';
  app.menu.element.style.display = 'none';
  app.search.element.style.display = 'block';
};

app.disableSearch = () => {
  const arr = document.querySelectorAll('.search-list-item');
  if (arr.length !== 0) {
    arr.forEach((el) => {
      el.remove();
    });
  }
  app.search.input.value = '';
  app.search.element.style.display = 'none';
  app.header.element.style.display = 'block';
  app.map.element.style.display = 'block';
  app.preview.container.style.display = 'block';
  app.menu.element.style.display = 'flex';
};

app.toggleView = () => {
  if (app.menu.view.textContent === 'See all questions') {
    app.map.element.style.display = 'none';
    app.preview.container.style.display = 'none';
    app.view.element.style.display = 'block';
    app.menu.view.textContent = 'Explore map';
    app.view.container.style.width = `${app.view.container.offsetWidth + (app.view.container.offsetWidth - app.view.container.clientWidth)}px`;
  } else if (app.menu.view.textContent === 'Explore map') {
    app.view.element.style.display = 'none';
    app.map.element.style.display = 'block';
    app.preview.container.style.display = 'block';
    app.menu.view.textContent = 'See all questions';
  }
};

app.modal.fly = (e) => {
  app.modal.remove();
  app.fly([parseFloat(e.target.dataset.lng), parseFloat(e.target.dataset.lat)]);
};

app.modal.remove = () => {
  app.modal.element.style.display = 'none';
};

app.search.fly = (e) => {
  app.disableSearch();
  app.fly([parseFloat(e.target.dataset.lng), parseFloat(e.target.dataset.lat)]);
};

app.fly = (coordinates) => {
  map.element.flyTo({
    center: coordinates,
    zoom: 14,
    speed: 0.8,
  });
};


// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

app.intro.remove = () => {
  app.intro.element.style.display = 'none';
};

app.intro.findLocation = () => {
  app.intro.button.textContent = 'Searching location';
  app.enableGeo();
  setTimeout(() => {
    app.intro.remove();
  }, 2000);
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

data.list = (res) => {
  const arr = document.querySelectorAll('.search-list-item');
  if (arr.length !== 0) {
    arr.forEach((el) => {
      el.remove();
    });
  }

  res.forEach((el) => {
    const item = document.querySelector('.search-list-item-template').cloneNode(true);
    item.classList.remove('search-list-item-template');
    item.classList.add('search-list-item');
    item.dataset.lng = el.lng;
    item.dataset.lat = el.lat;
    item.textContent = el.name;
    item.onclick = app.search.fly;
    app.search.list.appendChild(item);
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

app.intro.button.addEventListener('click', app.intro.findLocation);
app.intro.element.addEventListener('click', (e) => { if (e.target.className === 'intro') app.intro.remove(); });

app.map.geo.addEventListener('click', app.enableGeo);
app.map.search.addEventListener('click', app.enableSearch);
app.map.zoomIn.addEventListener('click', () => map.element.zoomIn());
app.map.zoomOut.addEventListener('click', () => map.element.zoomOut());
app.menu.view.addEventListener('click', app.toggleView);
app.search.return.addEventListener('click', app.disableSearch);
app.search.input.addEventListener('keyup', () => { if (app.search.input.value.length > 3) data.reverseGeo(app.search.input.value); });
app.modal.element.addEventListener('click', (e) => { if (e.target.className === 'modal') app.modal.remove(); });
app.modal.return.addEventListener('click', app.modal.remove);

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
