const app = {
  header: {
    element: document.querySelector('.header'),
  },
  intro: {
    element: document.querySelector('.intro'),
    button: document.querySelector('.intro-section-button'),
  },
  insight: {
    comments: document.querySelector('.insight-article-banner-options-link-text'),
    content: document.querySelector('.insight-article-content'),
    element: document.querySelector('.insight'),
    image: document.querySelector('.insight-article-banner-image'),
    link: document.querySelector('.insight-article-banner-options-link'),
    title: document.querySelector('.insight-article-banner-title'),
  },
  map: {
    element: document.querySelector('#mapboxgl'),
    geo: document.querySelector('.mapboxgl-options-geo'),
    search: document.querySelector('.mapboxgl-options-search'),
    zoomIn: document.querySelector('.mapboxgl-zoom-in'),
    zoomOut: document.querySelector('.mapboxgl-zoom-out'),
  },
  menu: {
    element: document.querySelector('.menu'),
  },
  search: {
    element: document.querySelector('.search'),
    input: document.querySelector('.search-header-section-container-input'),
    list: document.querySelector('.search-list'),
    return: document.querySelector('.search-header-section-icon'),
  },
  view: {
    article: document.querySelectorAll('.view-article'),
    container: document.querySelector('.view-container'),
    element: document.querySelector('.view'),
    image: document.querySelectorAll('.view-article-image'),
  },
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

app.view.element.style.paddingBottom = `${app.view.element.offsetHeight - app.view.element.clientHeight}px`;

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
function insight(e) {
  const el = this;
  app.insight.title.textContent = el.querySelector('.view-article-title').textContent;
  app.insight.content.textContent = el.querySelector('.view-article-content').textContent;
  app.insight.image.src = el.querySelector('.view-article-image').src;
  app.insight.link.href = el.querySelector('.view-article-link').href;
  app.insight.comments.textContent = el.querySelector('.view-article-link-text').textContent;
  console.log(this);
}


app.enableGeo = () => {
  app.map.geo.classList.forEach((el) => {
    // Will run first time, if request is rejected then add disabled to class
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
  app.insight.element.style.display = 'none';
  app.view.container.style.display = 'none';
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
  app.insight.element.style.display = 'block';
  app.view.container.style.display = 'block';
  app.menu.element.style.display = 'flex';
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
  }, 1000);
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

if (app.intro.button) {
  app.intro.button.addEventListener('click', app.intro.findLocation);
  app.intro.element.addEventListener('click', (e) => { if (e.target.className === 'intro') app.intro.remove(); });
}

app.map.geo.addEventListener('click', app.enableGeo);
app.map.search.addEventListener('click', app.enableSearch);
app.map.zoomIn.addEventListener('click', () => map.element.zoomIn());
app.map.zoomOut.addEventListener('click', () => map.element.zoomOut());
app.search.return.addEventListener('click', app.disableSearch);
app.search.input.addEventListener('keyup', () => { if (app.search.input.value.length > 3) data.reverseGeo(app.search.input.value); });


// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
