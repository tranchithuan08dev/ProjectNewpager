dayjs.extend(window.dayjs_plugin_relativeTime);
dayjs.locale('vi');

const params = new URLSearchParams(window.location.search);
const keyword = params.get('keyword');

// console.log('keyword', keyword);

const elArticles = document.getElementById('articles');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');
const elPagination = document.getElementById('pagination');
let ARTICLE_Liked = JSON.parse(localStorage.getItem('ARTICLE_Liked')) || []


let currentPage = 1;
renderArticles(currentPage);

elPagination.addEventListener('click', (e) => {
  e.preventDefault();
  const el = e.target;

  if (el.classList.contains('page-item')) {
    currentPage = parseInt(el.innerText);
    renderArticles(currentPage);
  }

  if (el.classList.contains('btn-paginate')) {
    if (el.id === 'btn-prev') {
      currentPage--;
    } else {
      currentPage++;
    }
    renderArticles(currentPage);
  }
})

function renderArticles(page = 1) {
  API.get(`articles/search?q=${keyword}&limit=10&page=${page}`).then((response) => {
    const articles = response.data.data;
    const totalPosts = response.data.meta.total
    document.getElementById('title').innerText = `Search ${totalPosts} with keyword "${keyword}"`
    let html = '';
    articles.forEach((article) => {
      html += renderArticleItem(article);
    });
    elArticles.innerHTML = html;
    const totalPage = response.data.meta.last_page;
    renderPagination(totalPage, page);
  });
}

function renderArticleItem(data) {
  const regex = new RegExp(keyword, 'ig');
  title = data.title.replaceAll(regex, (match) => `<mark>${match}</mark>`);
  description = data.description.replaceAll(regex, (match) => `<mark>${match}</mark>`);
  const classLike = ARTICLE_Liked.includes(data.id) ? 'active' : ''
  return /* html */`
  <div class="col-lg-4 col-md-6 item mb-4">
    <div class="card h-100">
      <div class="card-header p-0 position-relative">
        <a href="detail.html?id=${data.id}">
          <img class="card-img-bottom d-block radius-image-full" src="${data.thumb}"
            alt="Card image cap">
        </a>
      </div>
      <div class="card-body blog-details">
      <a href="detail.html?id=${data.id}" >
        <span class="label-blue">${data.category.name}</span></a>
        <a href="detail.html?id=${data.id}" class="blog-desc">${title}</a>
        <p class="zvn-line-clamp-3">${description}</p>
        <div class="author align-items-center mt-3">
          <img src="assets/images/a1.jpg" alt="" class="img-fluid rounded-circle" />
          <ul class="blog-meta">
            <li>
              <a href="author.html">${data.author}</a>
            </li>
            <li class="meta-item blog-lesson">
              <span class="meta-value">${dayjs(data.publish_date).fromNow()} </span><span><i class="fa-solid fa-heart icon-like ${classLike}" data-id=${data.id}></i></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>`;
}

function renderPagination(totalPage, page = 1) {
  let html = '';

  for (let i = 1; i <= totalPage; i++) {
    const active = page === i ? 'current' : '';
    html += `<li><a class="page-numbers ${active} page-item" href="#">${i}</a></li>`;
  }
  const disabledPrev = page === 1 ? 'disabled' : '';
  const disabledNext = page === totalPage ? 'disabled' : '';
  elPagination.innerHTML = `
  <li><a class="page-numbers btn-paginate ${disabledPrev}" href="#next" id="btn-prev">Prev</a></li>
  ${html}
  <li><a class="page-numbers btn-paginate ${disabledNext}" href="#next" id="btn-next">Next</a></li>`;
}