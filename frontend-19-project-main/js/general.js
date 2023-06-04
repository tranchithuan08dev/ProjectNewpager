// create axios instance
const API = axios.create({
  baseURL: 'https://apiforlearning.zendvn.com/api/v2/',
});

const elSearchForm = document.getElementById('search-form');
const elInputKeyword = document.querySelector('input[name="keyword"]');

elSearchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const keyword = elInputKeyword.value.trim();
  if (keyword) {
    elSearchForm.submit();
  } else {
    alert('Vui long nhap tu khoa can tim!');
  }
});
// See more
API.get('categories_news').then(res => {
  const menus = res.data.data;
  let html = '';
  let otherMenuHtml = '';

  menus.forEach((menuItem, index) => {
    if (index < 2) {
      html += `<li class="nav-item"><a class="nav-link" href="category.html?id=${menuItem.id}">${menuItem.name}</a></li>`
    } else {
      otherMenuHtml += `<a class="dropdown-item" href="category.html?id=${menuItem.id}">${menuItem.name}</a>`;
    }
  });

  document.getElementById('main-menu').innerHTML = html + `
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
      aria-haspopup="true" aria-expanded="false">
      Danh mục khác <span class="fa fa-angle-down"></span>
    </a>
    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
      ${otherMenuHtml}
    </div>
  </li>`;
})




document.addEventListener('click', (event) => {
  const el = event.target;
  const id = parseInt(el.dataset.id);
  if (el.classList.contains('icon-like')) {
    if (el.classList.contains('active')) {
      // filter funtion for
      ARTICLE_Liked = ARTICLE_Liked.filter(likeId => likeId !== id)
      el.classList.remove('active');
      Toastify({
        text: "Vùa bỏ yêu thích",
        duration: 3000,
        close: true,
        style: {
          background: "#00DBDE",
        },
      }).showToast();
    } else {
      ARTICLE_Liked.push(id);
      el.classList.add('active');
      Toastify({
        text: "vừa yêu thích",
        duration: 3000,
        close: true,
      }).showToast();
    }

  }
  localStorage.setItem('ARTICLE_Liked', JSON.stringify(ARTICLE_Liked))
})

