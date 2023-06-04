const inputName = document.getElementById("w3lName");
const inputAddress = document.getElementById("w3lSubject");
const inputEmail = document.getElementById("w3lSender");
const inputPhone = document.getElementById("w3lPhone");
const inputPassword = document.getElementById("w3lMessage")
const btnSubmit = document.getElementById("btn-submit");

// const API = axios.create({
//     baseURL: 'https://apiforlearning.zendvn.com/api/v2/',
// });


btnSubmit.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = inputEmail.value.trim();
    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();
    const phone = inputPhone.value.trim();
    const address = inputAddress.value.trim();
    const data = { name, email, password, phone, address };
    API.post('/users/register', data)
        .then((res) => {
            API.post('/auth/login', { email: data.email, password: data.password })
                .then((res) => {
                    localStorage.setItem('frontend_19_token', res.data.access_token);
                    window.location.href = "index.html";
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
});



