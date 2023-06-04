dayjs.extend(window.dayjs_plugin_relativeTime);
dayjs.locale('vi');

// lấy id từ url
// call api lấy chi tiết bài viết và render
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get('id'));
const elRelatedPost = document.getElementById('related-posts')
const elArticlesPopular = document.getElementById('articles-popular');
const elPostComments = document.getElementById('post-comments')
const elCategories = document.getElementById('categories')
const elComments = document.getElementById('comment')
const elYourName = document.getElementById('Your-Name')
const elYourComments = document.getElementById('Your-Comments')
const btnSendComment = document.getElementById('btn-send-comments')
const elTags = document.getElementById('tags')
const elArticlesViewed = document.getElementById('articles-viewed')
const elMessageComment = document.getElementById('message-comment')

let parentCommentId = '';
let replyId = '';
let ARTICLE_Liked = JSON.parse(localStorage.getItem('ARTICLE_Liked')) || []
const TOTAL_COMMENTS = JSON.parse(localStorage.getItem("COMMENTS")) || {}
RenderComments()


// reply
elPostComments.addEventListener('click', (e) => {
  const el = e.target;

  if (el.classList.contains('btn-reply')) {
    const commentId = el.dataset.id;
    elMessageComment.innerHTML = `Trả lời bình luận của @${commentId} <button type="button" class="btn-cancel-comment more btn btn-small mb-sm-0">Hủy</button>`;
    parentCommentId = commentId;
    if (el.dataset.parent) {
      parentCommentId = el.dataset.parent;
      replyId = commentId;
    }
  }
});

elMessageComment.addEventListener('click', (e) => {
  const el = e.target;
  if (el.classList.contains('btn-cancel-comment')) {
    elMessageComment.innerHTML = '';
  }
});

//button post-comments
btnSendComment.addEventListener('click', () => {
  const nameUser = elYourName.value.trim();
  const contentValue = elYourComments.value.trim();
  let content = contentValue;
  if (replyId) content = `@${replyId} ${content}`;
  const newComment =
  {
    id: createId(),
    name: nameUser,
    content: content,
    dateTime: getCurrentDateTime(),
    articleId: id,
  }
  if (parentCommentId) {
    const parentCommentIdx = TOTAL_COMMENTS[id].findIndex((item) => item.id === parentCommentId);
    const hasChildItems = TOTAL_COMMENTS[id][parentCommentIdx].childItems; // undefined, []
    if (hasChildItems) {
      TOTAL_COMMENTS[id][parentCommentIdx].childItems.push(newComment);
    } else {
      TOTAL_COMMENTS[id][parentCommentIdx].childItems = [newComment];
    }
  } else {
    if (TOTAL_COMMENTS[id]) {
      TOTAL_COMMENTS[id].push(newComment);
    } else {
      TOTAL_COMMENTS[id] = [newComment];
    }
  }
  parentCommentId = '';
  replyId = '';
  parentCommentId = '';
  elMessageComment.innerHTML = '';
  localStorage.setItem('COMMENTS', JSON.stringify(TOTAL_COMMENTS))
  RenderComments()
})

// Bài Viết vừa xem
const ARTICLES_VIEWED = JSON.parse(localStorage.getItem('ARTICLES_VIEWED')) || [];
if (!ARTICLES_VIEWED.includes(id)) {
  if (ARTICLES_VIEWED.length > 3) {
    ARTICLES_VIEWED.shift();
  }
  ARTICLES_VIEWED.push(id);
  localStorage.setItem('ARTICLES_VIEWED', JSON.stringify(ARTICLES_VIEWED));
}

ARTICLES_VIEWED.forEach((articleId) => {
  if (articleId !== id) {
    API.get(`articles/${articleId}`).then((res) => {
      const post = res.data.data;
      elArticlesViewed.innerHTML += `<li><a href="detail.html?id=${post.id}">${post.title}</a></li>`;
    });
  }
});

// related-posts bài viết liên quan
API.get(`/articles/${id}/related?limit=4`).then((response) => {
  const post = response.data.data;
  console.log(post);
  let html = '';
  post.forEach((category) => {
    html += /* html */`
      <li class="post" >
       <figure class="post-thumb"><img style ="object-fit: cover;
       height: 100%;" src="${category.thumb}" alt=""></figure>
      <div class="text"><a href="detail.html?id=${category.id}">
              ${category.title} </a>
      </div>
      
  </li>`;
  });

  elRelatedPost.innerHTML = html;
});

// Tag
API.get('categories_news/featured?limit=2').then((response) => {
  const tags = response.data.data;
  let html = '';

  tags.forEach((category) => {
    html += /* html */`
    <li><a href="category.html?id=${category.id}" class="btn-small">${category.name}</a></li>`;
  });

  elTags.innerHTML = html;
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

// Side-bar categoris
API.get('categories_news/featured?limit=4').then((response) => {
  const categories = response.data.data;
  let html = '';
  categories.forEach((category) => {
    html += /* html */`
    <li>
      <a href="category.html?id=${category.id}">
        ${category.name}
      </a>
    </li>`;
  });

  elCategories.innerHTML = html;
});

//render content
API.get(`articles/${id}`).then(res => {

  const article = res.data.data;
  document.getElementById('article-title').innerText = article.title;
  document.getElementById('article-content').innerHTML = article.content;
  document.getElementById('article-thumb').src = article.thumb;
  document.getElementById('articles-detail').innerHTML = `<li>
  <p> Posted on <strong>${dayjs(article.publish_date).fromNow()}</strong></p>
</li>
<li>
  <p> By <a href="#author"><strong>${article.author}</strong></a></p>
</li>
<li>
  <p> Published in <a href="#category"><strong>Fashion</strong></a></p>
</li>

`
});

//comments
function RenderComments() {
  // const COMMENTS = TOTAL_COMMENT.filter(item => item.articleId === id);
  const COMMENTS = TOTAL_COMMENTS[id] || [];
  let html = "";
  COMMENTS.forEach(item => {
    html += '<li>';

    html += ` 
    <div class="media-grid">
      <div class="media">
          <div class="media-body comments-grid-right">
              <h5>${item.name}</h5>
              <ul class="p-0 comment">
                  <li class="">${item.dateTime}</li>
                  <li>
                      <a href="#comment" class="btn text-primary btn-reply"  data-id=${item.id}>Reply</a>
                  </li>
              </ul>
              <p>${item.content}.</p>

          </div>
      </div>
    </div>`
    if (item.childItems) {
      html += '<ul>';

      item.childItems.forEach((childItem) => {
        html += `<li style="margin-left: 90px;">
        <div class ="media-body comments-grid-right">
        <h5>${childItem.name}</h5>
        <div class="p-0 comment">${childItem.dateTime}</div>
        <p>${childItem.content}</p>
        <a href="#comment" class="text-primary btn-reply" data-id="${childItem.id}"  data-parent="${item.id}">Reply</a>
      </div>
      </li>`;
      });

      html += '</ul>';
    }
    html += '</li>'
  });
  elPostComments.innerHTML = html;
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

// funtion to radom ID
function createId(length = 8) {
  // trả về id là một chuỗi ngẫu nhiên bao gồm 8 kí tự, A-Za-z0-9
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
// function to get time now
function getCurrentDateTime() {
  const d = new Date();
  const currentTime = d.toLocaleTimeString('en-US', { hour12: false });
  const currentYear = d.getFullYear().toString();
  const currentMonth = d.getMonth() + 1;
  const finalCurrentMonth = currentMonth < 10 ? '0' + currentMonth.toString() : currentMonth.toString();
  const currentDay = d.getDate() + 1;
  const finalCurrentDay = currentDay < 10 ? '0' + currentDay.toString() : currentDay.toString();
  return `${currentYear}-${finalCurrentMonth}-${finalCurrentDay} ${currentTime}`;
}


