// change day or month and change vietnamese
dayjs.extend(window.dayjs_plugin_relativeTime);
dayjs.locale('vi');

const elArticlesTopics = document.getElementById('articles-topics')
const elArticlesLatest = document.getElementById('articles-latest');
const elArticlesPopular = document.getElementById('articles-popular');
const elArticlesGeneral = document.getElementById('articles-general');
const btnLoadMoreGeneral = document.getElementById('btn-load-more-general');
const elFeaturedCategories = document.getElementById('featured-categories');
const elTopics = document.getElementById('topics')
let ARTICLE_Liked = JSON.parse(localStorage.getItem('ARTICLE_Liked')) || []

const elMainMenu = document.getElementById('main-menu');

// check login and get current user info
const ACCESS_TOKEN = localStorage.getItem('frontend_19_token');
API.get('/auth/me', {
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
})
  .then((res) => {
    const userInfo = res.data.data;
    elMainMenu.innerHTML += `
    <li>
      ${userInfo.name}
      <ul>
        <li><a href="profile.html">Profile</a></li>
        <li><a href="#" class="btn-logout">Logout</a></li>
      </ul>
    </li>`;
  })
  .catch((err) => {
    elMainMenu.innerHTML += `<li class="nav-item"><a class="nav-link" href="login.html">Login</a>`;
  });

elMainMenu.addEventListener('click', (e) => {
  const el = e.target;
  if (el.classList.contains('btn-logout')) {
    e.preventDefault();
    API.post(
      '/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    )
      .then((res) => {
        localStorage.removeItem('frontend_19_token');
        window.location.href = 'index.html';
      })
      .catch((err) => {
        console.log('/auth/logout error', err);
      });
  }
});
// render articles-topics
API.get('articles/popular?limit=3').then((response) => {
  const posts = response.data.data;
  let html = '';
  posts.forEach((item) => {
    html += renderArticlesTopicsItem(item);
  });
  elArticlesTopics.innerHTML = html;
});
// render Topics
API.get('categories_news/featured?limit=4').then((response) => {
  const categories = response.data.data;
  let html = '';

  categories.forEach((category) => {
    html += /* html */`
    <a href="category.html?id=${category.id}" class="topics-list mb-3">
              <div class="list1 ">
             <h4 class="topics">${category.name}</h4>
              </div>
 </a>
    `;
  });

  elTopics.innerHTML = html;
});



// Render Articles Latest
API.get('articles?limit=3').then((response) => {
  console.log(response);
  const posts = response.data.data;
  let html = '';
  posts.forEach((item) => {
    html += renderArticleLatestItem(item);
  });
  elArticlesLatest.innerHTML = html;
});

// Render Articles Popular
API.get('articles/popular?limit=3').then((response) => {
  const posts = response.data.data;
  let html = '';
  posts.forEach((item) => {
    html += renderArticlePopularItem(item);
  });
  elArticlesPopular.innerHTML = html;
});

API.get('categories_news/featured?limit=4').then((response) => {
  const categories = response.data.data;
  let html = '';

  categories.forEach((category) => {
    html += /* html */`
    <div class="col-lg-3 col-6 grids-feature mt-3">
      <a href="category.html?id=${category.id}">
        <div class="area-box">
          <h4 class="title-head">${category.name}</h4>
        </div>
      </a>
    </div>`;
  });

  elFeaturedCategories.innerHTML = html;
});

// Render Articles General
let currentPage = 1;
renderArticlesGeneral(currentPage);

btnLoadMoreGeneral.addEventListener('click', () => {
  currentPage++;
  // disable button
  btnLoadMoreGeneral.disabled = true;
  btnLoadMoreGeneral.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Đang tải';
  renderArticlesGeneral(currentPage);
});

function renderArticlesGeneral(page = 1) {
  API.get(`articles?limit=4&page=${page}`).then((response) => {
    const posts = response.data.data;
    let html = '';
    posts.forEach((item) => {
      html += renderArticleGeneralItem(item);
    });
    elArticlesGeneral.innerHTML += html;
    btnLoadMoreGeneral.disabled = false;
    btnLoadMoreGeneral.innerHTML = 'Xem thêm';
  });
}

function renderArticleGeneralItem(data) {
  const classLike = ARTICLE_Liked.includes(data.id) ? 'active' : ''
  return /* html */`
  <div class="col-lg-6 mb-4">
    <div class="bg-clr-white hover-box h-100">
      <div class="row h-100">
        <div class="col-sm-5 position-relative">
          <a href="detail.html?id=${data.id}" class="image-mobile h-100 d-block">
            <img class="card-img-bottom d-block radius-image-full zvn-img-full-height" src="${data.thumb}"
              alt="${data.title}">
          </a>
        </div>
        <div class="col-sm-7 card-body blog-details align-self">
          <a href="detail.html?id=${data.id}" class="blog-desc">${data.title}</a>
          <div class="author align-items-center">
            <img src="assets/images/a1.jpg" alt="" class="img-fluid rounded-circle" />
            <ul class="blog-meta">
              <li>
                <a href="author.html">${data.author}</a> </a>
              </li>
              <li class="meta-item blog-lesson">
                <span class="meta-value"> ${dayjs(data.publish_date).fromNow()}</span><span><i class="fa-solid fa-heart icon-like ${classLike}" data-id=${data.id}></i></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function renderArticlePopularItem(data) {
  const classLike = ARTICLE_Liked.includes(data.id) ? 'active' : ''
  return /* html */`
  <div class="col-lg-4 col-md-6 item">
    <div class="card h-100">
      <div class="card-header p-0 position-relative">
        <a href="detail.html?id=${data.id}">
          <img class="card-img-bottom d-block radius-image-full" src="${data.thumb}"
            alt="Card image cap">
        </a>
      </div>
      <div class="card-body blog-details">
        <span class="label-blue">${data.category.name}</span>
        <a href="detail.html?id=${data.id}" class="blog-desc">${data.title}</a>
        <p class="zvn-line-clamp-3">${data.description}</p>
        <div class="author align-items-center mt-3">
          <img src="assets/images/a1.jpg" alt="" class="img-fluid rounded-circle" />
          <ul class="blog-meta">
            <li>
              <a href="author.html">${data.author}</a>
            </li>
            <li class="meta-item blog-lesson">
              <span class="meta-value"> ${dayjs(data.publish_date).fromNow()} </span>. <span><i class="fa-solid fa-heart icon-like ${classLike}" data-id=${data.id}></i></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>`;
}

function renderArticlesTopicsItem(data) {
  const classLike = ARTICLE_Liked.includes(data.id) ? 'active' : ''
  return /* html */`
  <div class="col-lg-4 col-md-6 item">
    <div class="card h-100">
      <div class="card-header p-0 position-relative">
        <a href="detail.html?id=${data.id}">
          <img class="card-img-bottom d-block radius-image-full" src="${data.thumb}"
            alt="Card image cap">
        </a>
      </div>
      <div class="card-body blog-details">
        <span class="label-blue">${data.category.name}</span>
        <a href="detail.html?id=${data.id}" class="blog-desc">${data.title}</a>
        <p class="zvn-line-clamp-3">${data.description}</p>
        <div class="author align-items-center mt-3">
          <img src="assets/images/a1.jpg" alt="" class="img-fluid rounded-circle" />
          <ul class="blog-meta">
            <li>
              <a href="author.html">${data.author}</a>
            </li>
            <li class="meta-item blog-lesson">
              <span class="meta-value"> ${dayjs(data.publish_date).fromNow()} </span>. <span><i class="fa-solid fa-heart icon-like ${classLike}" data-id=${data.id}></i></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>`;
}

function renderArticleLatestItem(data) {
  const classLike = ARTICLE_Liked.includes(data.id) ? 'active' : ''
  return /* html */`
  <div class="col-lg-4 col-md-6 mb-4">
    <div class="top-pic1" style="background: url(${data.thumb}) no-repeat; background-size: cover; background-position: center">
      <div class="card-body blog-details">
        <a href="detail.html?id=${data.id}" class="blog-desc">${data.title}</a>
        <div class="author align-items-center">
          <img src="assets/images/a1.jpg" alt="" class="img-fluid rounded-circle" />
          <ul class="blog-meta">
            <li>
              <a href="author.html">${data.author}</a> </a>
            </li>
            <li class="meta-item blog-lesson">
              <span class="meta-value"> ${dayjs(data.publish_date).fromNow()} </span>
              <span><i class="fa-solid fa-heart icon-like ${classLike}" data-id=${data.id}></i></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>`;
}
