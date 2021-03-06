const map = {};

const data = {};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

data.block = (res) => {
  const block = document.querySelector('.view-block');
  if (block && res.features.length !== 0) {
    block.style.display = 'block';
  }
};

data.canvas = (res) => {
  const layer = map.element.getLayer('users');
  if (layer) {
    map.element.removeLayer('users');
    map.element.removeSource('users');
  }
  map.element.addLayer({
    id: 'users',
    type: 'circle',
    minzoom: 5,
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

data.info = (res) => {
  const question = res.length === 1 ? 'question' : 'questions';
  const sentence = res.length === 0 ? 'nearby, zoom out.' : 'nearby';
  document.querySelector('.info-question-count').textContent = `${res.length} ${question} ${sentence}`;
  return res.geoJSON;
};

data.insight = (res) => {
  if (res.features[0]) {
    const i = res.features.length - 1;
    document.querySelector('.insight-image').src = res.features[i].properties.user.avatar;
    document.querySelector('.insight-name').textContent = res.features[i].properties.user.username;
    document.querySelector('.insight-question').textContent = res.features[i].properties.text;
    document.querySelector('.insight-route').href = `/${res.features[i].properties.user.username}/posts/${res.features[i]._id}`;
    document.querySelector('.insight-route-text').textContent = res.features[i].properties.comments.length;
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
    template.querySelector('.view-article-travel-mode').classList.add(el.properties.travel.mode);
    template.querySelector('.view-article-travel-distance').textContent = el.properties.travel.distance;
    template.querySelector('.view-article-content-text').textContent = el.properties.text;
    template.querySelector('.view-article-link').href = `/${el.properties.user.username}/posts/${el._id}`;
    template.querySelector('.view-article-link-text').textContent = el.properties.comments.length;
    if (el.properties.tag) {
      template.querySelector('.view-article-content-tag').textContent = el.properties.tag;
    } else {
      template.querySelector('.view-article-content-tag').style.display = 'none';
    }
    template.onclick = insight;
    const node = document.querySelector('.view-article') ? document.querySelector('.view-article') : document.querySelector('.view-article-template');
    document.querySelector('.view-container').insertBefore(template, node);
  });
  return res;
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

map.attr = () => {
  map.element.addControl(new mapboxgl.AttributionControl({
    compact: true,
  }));
};

map.load = (res) => {
  map.element = new mapboxgl.Map({
    container: 'mapboxgl',
    style: 'https://maps.tilehosting.com/c/d5517948-b81a-4374-9547-6de2bf4279d8/styles/basic/style.json?key=BJinYMSawaKJNsgs0dR4',
    center: res.center,
    zoom: 11,
    maxZoom: 15,
    maxBounds: res.maxBounds,
    attributionControl: false,
  });

  map.element.doubleClickZoom.disable();
  map.element.scrollZoom.disable();
  map.element.touchZoomRotate.disableRotation();

  const intro = document.querySelector('.intro');

  if (intro) {
    document.querySelector('.intro').addEventListener('click', (e) => {
      if (e.target.className === 'intro') map.attr();
    });
    document.querySelector('.intro').addEventListener('click', (e) => {
      if (e.target.className === 'intro-section-button') setTimeout(() => { map.attr(); }, 1000);
    });
  } else {
    map.attr();
  }
};

map.listeners = () => {
  map.element.once('load', () => data.dbQuery());
  map.element.on('dragstart', () => map.element.once('moveend', () => data.dbQuery()));
  map.element.on('zoomend', () => data.dbQuery());
  // data.geocode as a seperate concern.
  map.element.once('load', () => data.geocode());
  map.element.on('moveend', () => data.geocode());
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
  const block = document.querySelector('.view-block');
  if (block) block.style.display = 'none';
  const fd = data.formData();

  fetch('/db-query', {
    method: 'POST',
    credentials: 'same-origin',
    body: fd,
  }).then(res => res.json())
    .then(res => data.info(res))
    .then(res => data.preview(res))
    .then(res => data.insight(res))
    .then(res => data.canvas(res))
    .then(res => data.block(res))
    .catch(err => console.log(err));
};

const geocode = (ms, url) => new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(new Error('timeout'));
  }, ms);
  fetch(url).then(resolve, reject);
});

data.geocode = () => {
  document.querySelector('.info-tagline').textContent = '';
  const c = map.element.getCenter();
  const url = `https://geocoder.tilehosting.com/r/${c.lng}/${c.lat}.js?key=Rgbg05zBqK0dhML5dNJi`;

  geocode(2000, url)
    .then(geo => geo.json())
    .then((geo) => {
      if (geo.results[0].city === geo.results[0].name) {
        document.querySelector('.info-tagline').textContent = geo.results[0].city;
      } else if (geo.results[0].city !== geo.results[0].name) {
        document.querySelector('.info-tagline').textContent = `${geo.results[0].name}, ${geo.results[0].city}`;
      } else {
        document.querySelector('.info-tagline').textContent = geo.results[0].name;
      }
    })
    .catch((err) => {
      document.querySelector('.info-tagline').textContent = '';
    });
};

// Get request initialises map settings
fetch('/explore.json', {
  method: 'GET',
  credentials: 'same-origin',
}).then(res => res.json())
  .then(res => map.load(res))
  .then(res => map.listeners())
  .catch(err => console.log(err));

document.querySelector('.alert-icon').addEventListener('click', () => {
  document.querySelector('.alert').textContent = '';
  document.querySelector('.alert-container').style.display = 'none';
});
