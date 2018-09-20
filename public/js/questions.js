const app = {
  view: {
    container: document.querySelector('.view-container'),
  }
};

// app.view.container.style.width = `${app.view.container.offsetWidth + (app.view.container.offsetWidth - app.view.container.clientWidth)}px`;

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

app.view = (res) => {
  const arr = document.querySelectorAll('.view-article');
  if (arr.length !== 0) {
    arr.forEach((el) => {
      el.remove();
    });
  }
  res.geoJSON.features.forEach((el) => {
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
    const node = document.querySelector('.view-article') ? document.querySelector('.view-article') : document.querySelector('.view-article-template');
    document.querySelector('.view-container').insertBefore(template, node);
  });

  const block = document.querySelector('.view-block');
  if (block && res.geoJSON.features.length !== 0) {
    block.style.display = 'block';
  }
  return res;
};

// Get request populating questions template
fetch('/questions.json', {
  method: 'GET',
  credentials: 'same-origin',
}).then(res => res.json())
  .then(res => app.view(res))
  .catch(err => console.log(err));

document.querySelector('.alert-icon').addEventListener('click', () => {
  document.querySelector('.alert').textContent = '';
  document.querySelector('.alert-container').style.display = 'none';
});

analytics.questions();
