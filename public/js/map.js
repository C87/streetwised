const map = {};

const data = {};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

data.canvas = (res) => {
  const layer = map.element.getLayer('users');
  if (layer) {
    map.element.removeLayer('users');
    map.element.removeSource('users');
  }
  map.element.addLayer({
    id: 'users',
    type: 'circle',
    minzoom: 9,
    source: {
      type: 'geojson',
      data: res,
    },
    paint: {
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff',
      'circle-color': '#d9453d',
      'circle-radius': {
        stops: [
          [10, 3],
          [15, 6],
        ],
      },
    },
  });
};

data.preview = (res) => {
  const arr = document.querySelectorAll('.preview-section-image');
  if (arr.length !== 0) {
    arr.forEach((el) => {
      el.remove();
    });
  }
  res.features.forEach((el) => {
    const img = document.querySelector('.preview-section-image-template').cloneNode(true);
    img.classList.remove('preview-section-image-template');
    img.classList.add('preview-section-image');
    img.src = el.properties.user.avatar;
    img.dataset.user = el.properties.user.username;
    img.dataset.post = el.properties.text;
    img.dataset.location = el.properties.location;
    img.dataset.lng = el.geometry.coordinates[0];
    img.dataset.lat = el.geometry.coordinates[1];
    img.dataset.url = `${el.properties.user.username}/posts/${el._id}`;
    img.dataset.comments = el.properties.comments.length;
    img.onclick = app.previewModal;
    document.querySelector('.preview-section').appendChild(img);
  });
  return res;
};

data.view = (res) => {
  const arr = document.querySelectorAll('.view-section-article');
  if (arr.length !== 0) {
    arr.forEach((el) => {
      el.remove();
    });
  }
  res.features.forEach((el) => {
    if (el.properties.response) {
      const template = document.querySelector('.view-section-article-full-template').cloneNode(true);
      template.classList.remove('view-section-article-full-template');
      template.classList.add('view-section-article');
      template.querySelector('.view-section-article-header-image').src = el.properties.user.avatar;
      template.querySelector('.view-section-article-header-title').textContent = el.properties.user.username;
      template.querySelector('.view-section-article-content').textContent = el.properties.text;
      template.querySelector('.view-section-article-container-image').src = el.properties.response.user.avatar;
      template.querySelector('.view-section-article-container-title').textContent = el.properties.response.user.username;
      template.querySelector('.view-section-article-secondary-content').textContent = el.properties.response.text;
      template.querySelector('.view-section-article-footer-location').textContent = el.properties.location;
      template.querySelector('.view-section-article-footer-link').href = `${el.properties.user.username}/posts/${el._id}`;
      template.querySelector('.view-section-article-footer-link-content').textContent = el.properties.comments.length;
      document.querySelector('.view-container').appendChild(template);
    } else if (!el.properties.response) {
      const template = document.querySelector('.view-section-article-partial-template').cloneNode(true);
      template.classList.remove('view-section-article-partial-template');
      template.classList.add('view-section-article');
      template.querySelector('.view-section-article-header-image').src = el.properties.user.avatar;
      template.querySelector('.view-section-article-header-title').textContent = el.properties.user.username;
      template.querySelector('.view-section-article-content').textContent = el.properties.text;
      template.querySelector('.view-section-article-footer-location').textContent = el.properties.location;
      template.querySelector('.view-section-article-footer-link').href = `${el.properties.user.username}/posts/${el._id}`;
      template.querySelector('.view-section-article-footer-link-content').textContent = el.properties.comments.length;
      document.querySelector('.view-container').appendChild(template);
    }
  });
  return res;
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

map.load = (res) => {
  map.element = new mapboxgl.Map({
    container: 'main',
    style: 'https://maps.tilehosting.com/c/d5517948-b81a-4374-9547-6de2bf4279d8/styles/basic/style.json?key=BJinYMSawaKJNsgs0dR4',
    center: res.center,
    zoom: 12,
    maxZoom: 15,
    // maxBounds: res.maxBounds,
    attributionControl: false,
  }).addControl(new mapboxgl.AttributionControl({
    compact: true,
  }), 'bottom-right');

  map.element.doubleClickZoom.disable();
  map.element.scrollZoom.disable();
  map.element.touchZoomRotate.disableRotation();
};

map.listeners = (res) => {
  map.element.once('load', () => data.dbQuery());
  map.element.on('dragstart', () => map.element.once('moveend', () => data.dbQuery()));
  map.element.on('zoomend', () => data.dbQuery());
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

data.formData = () => {
  const fd = new FormData();
  const c = map.element.getCenter();
  fd.append('lat', c.lat);
  fd.append('lng', c.lng);
  const b = map.element.getBounds();
  fd.append('ne_lat', b._ne.lat);
  fd.append('ne_lng', b._ne.lng);
  fd.append('sw_lat', b._sw.lat);
  fd.append('sw_lng', b._sw.lng);
  return fd;
};

data.dbQuery = () => {
  const fd = data.formData();

  fetch('/db-query', {
    method: 'POST',
    credentials: 'same-origin',
    body: fd,
  }).then(res => res.json())
    .then(res => data.preview(res))
    .then(res => data.view(res))
    .then(res => data.canvas(res))
    .then(() => data.geocode())
    .catch(err => console.log(err));
};

data.geocode = () => {
  const fd = data.formData();

  fetch('/geocode', {
    method: 'POST',
    credentials: 'same-origin',
    body: fd,
  }).then(res => res.json())
    .then((res) => {
      document.querySelector('.header-location').textContent = res;
      const dialogLocation = document.querySelector('.auth-modal-dialog-container-title');
      if (dialogLocation) { dialogLocation.textContent = res; }
    })
    .catch(err => console.log(err));
};

// Get request initialises map settings
fetch('/explore.json', {
  method: 'GET',
  credentials: 'same-origin',
}).then(res => res.json())
  .then(res => map.load(res))
  .then(res => map.listeners())
  .catch(err => console.log(err));
