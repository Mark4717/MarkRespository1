// public/js/signup.js
document.addEventListener('DOMContentLoaded', function () {
    const toggle1 = document.getElementById('password1-toggle');
    const toggle2 = document.getElementById('password2-toggle');

    const pwd1 = document.querySelector('input[name="password"]');
    const pwd2 = document.querySelector('input[name="password_confirmation"]');

    if (toggle1 && pwd1) {
        toggle1.addEventListener('click', function () {
            const type = pwd1.getAttribute('type') === 'password' ? 'text' : 'password';
            pwd1.setAttribute('type', type);
            this.classList.toggle('bi-eye-slash');
            this.classList.toggle('bi-eye');
        });
    }

    if (toggle2 && pwd2) {
        toggle2.addEventListener('click', function () {
            const type = pwd2.getAttribute('type') === 'password' ? 'text' : 'password';
            pwd2.setAttribute('type', type);
            this.classList.toggle('bi-eye-slash');
            this.classList.toggle('bi-eye');
        });
    }
});