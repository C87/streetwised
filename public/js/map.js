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
      'circle-color': '#1F98AC',
      'circle-radius': {
        stops: [
          [10, 5],
          [15, 10],
        ],
      },
    },
  });
  return res;
};

data.insight = (res) => {
  if (res.features[0]) {
    const pop = res.features.pop();
    document.querySelector('.insight-image').src = pop.properties.user.avatar;
    document.querySelector('.insight-name').textContent = pop.properties.user.username;
    document.querySelector('.insight-question').textContent = pop.properties.text;
    document.querySelector('.insight-icon').dataset.lng = pop.geometry.coordinates[0];
    document.querySelector('.insight-icon').dataset.lat = pop.geometry.coordinates[1];
    document.querySelector('.insight-icon').onclick = app.insight.fly;
    document.querySelector('.insight-route').href = `/${pop.properties.user.username}/posts/${pop._id}`;
    document.querySelector('.insight-route-text').textContent = pop.properties.comments.length;
    document.querySelector('.insight-content').style.display = 'block';
  } else {
    document.querySelector('.insight-content').style.display = 'none';
  }
  return res;
};

data.preview = (res) => {
  const arr = document.querySelectorAll('.view-article');
  if (arr.length !== 0) {
    arr.forEach((el) => {
      el.remove();
    });
  }
  res.features.forEach((el) => {
    const template = document.querySelector('.view-article-template').cloneNode(true);
    template.classList.remove('view-article-template');
    template.classList.add('view-article');
    template.querySelector('.view-article-image').src = el.properties.user.avatar;
    template.querySelector('.view-article-title').textContent = el.properties.user.username;
    template.querySelector('.view-article-tag').textContent = el.properties.tag;
    template.querySelector('.view-article-content').textContent = el.properties.text;
    template.querySelector('.view-article-distance').dataset.lng = el.geometry.coordinates[0];
    template.querySelector('.view-article-distance').dataset.lat = el.geometry.coordinates[1];
    template.querySelector('.view-article-link').href = `/${el.properties.user.username}/posts/${el._id}`;
    template.querySelector('.view-article-link-text').textContent = el.properties.comments.length;
    if (el.properties.tag) {
      template.querySelector('.view-article-tag').textContent = el.properties.tag;
    } else {
      template.querySelector('.view-article-tag').style.display = 'none';
    }
    template.onclick = insight;
    const node = document.querySelector('.view-article') ? document.querySelector('.view-article') : document.querySelector('.view-article-template');
    document.querySelector('.view-container').insertBefore(template, node);
  });
  return res;
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

map.load = (res) => {
  map.element = new mapboxgl.Map({
    container: 'mapboxgl',
    style: 'https://maps.tilehosting.com/c/d5517948-b81a-4374-9547-6de2bf4279d8/styles/basic/style.json?key=BJinYMSawaKJNsgs0dR4',
    center: res.center,
    zoom: 5,
    maxZoom: 15,
    // maxBounds: res.maxBounds,
    attributionControl: false,
  }).addControl(new mapboxgl.AttributionControl({
    compact: true,
  }));

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
    .then(res => data.insight(res))
    .then(res => data.canvas(res))
    .then(res => data.geocode(res))
    .catch(err => console.log(err));
};

data.geocode = (questions) => {
  const count = questions.features.length;
  const fd = data.formData();
  document.querySelector('.info-location-question-count').textContent = '';
  document.querySelector('.info-location-name').textContent = 'Searching location';

  fetch('/geocode', {
    method: 'POST',
    credentials: 'same-origin',
    body: fd,
  }).then(res => res.json())
    .then((res) => {
      if (count !== 1) {
        document.querySelector('.info-location-question-count').textContent = `${count} questions near`;
      } else {
        document.querySelector('.info-location-question-count').textContent = `${count} question near`;
      }
      document.querySelector('.info-location-name').textContent = res;
      // const ask = document.querySelector('.ask-form-textarea');
      // if (ask) {
      //   ask.placeholder = `Ask a question from ${res}.`;
      //   document.querySelector('.ask-container-title').textContent = res;
      // }
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
