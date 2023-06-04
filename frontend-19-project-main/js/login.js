const elLoginForm = document.getElementById('login-form');
const inputEmail = document.getElementById('email');
const inputPassword = document.getElementById('password');

const ACCESS_TOKEN = localStorage.getItem('frontend_19_token');
API.get('/auth/me', {
    headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
})
    .then((res) => {
        window.location.href = "index.html";
    })
    .catch((err) => { });


elLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();
    const data = { email, password };

    API.post('/auth/login', data)
        .then((res) => {
            localStorage.setItem('frontend_19_token', res.data.access_token);
            window.location.href = "index.html";
        })
        .catch((err) => {
            alert('thông tin đăng nhập chưa đúng, vui lòng thử');
        });
});
