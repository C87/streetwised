const app = {
  view: {
    container: document.querySelector('.view-container'),
  }
};

app.view.container.style.width = `${app.view.container.offsetWidth + (app.view.container.offsetWidth - app.view.container.clientWidth)}px`;

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

app.view = (res) => {
  const arr = document.querySelectorAll('.view-article');
  if (arr.length !== 0) {
    arr.forEach((el) => {
      el.remove();
    });
  }
  res.features.forEach((el) => {
    if (el.properties.response) {
      const template = document.querySelector('.view-article-full-template').cloneNode(true);
      template.classList.remove('view-article-full-template');
      template.classList.add('view-article');
      template.querySelector('.view-article-header-image').src = el.properties.user.avatar;
      template.querySelector('.view-article-header-title').textContent = el.properties.user.username;
      template.querySelector('.view-article-content').textContent = el.properties.text;
      template.querySelector('.view-article-container-image').src = el.properties.response.user.avatar;
      template.querySelector('.view-article-container-title').textContent = el.properties.response.user.username;
      template.querySelector('.view-article-secondary-content').textContent = el.properties.response.text;
      template.querySelector('.view-article-footer-location').textContent = el.properties.location;
      template.querySelector('.view-article-footer-link').href = `${el.properties.user.username}/posts/${el._id}`;
      template.querySelector('.view-article-footer-link-content').textContent = el.properties.comments.length;
      document.querySelector('.view-container').appendChild(template);
    } else if (!el.properties.response) {
      const template = document.querySelector('.view-article-partial-template').cloneNode(true);
      template.classList.remove('view-article-partial-template');
      template.classList.add('view-article');
      template.querySelector('.view-article-header-image').src = el.properties.user.avatar;
      template.querySelector('.view-article-header-title').textContent = el.properties.user.username;
      template.querySelector('.view-article-content').textContent = el.properties.text;
      template.querySelector('.view-article-footer-location').textContent = el.properties.location;
      template.querySelector('.view-article-footer-link').href = `${el.properties.user.username}/posts/${el._id}`;
      template.querySelector('.view-article-footer-link-content').textContent = el.properties.comments.length;
      document.querySelector('.view-container').appendChild(template);
    }
  });
  return res;
};

// Get request populating questions template
fetch('/questions.json', {
  method: 'GET',
  credentials: 'same-origin',
}).then(res => res.json())
  .then(res => app.view(res))
  .catch(err => console.log(err));
