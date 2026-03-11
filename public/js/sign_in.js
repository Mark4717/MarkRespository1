// public/js/sign_in.js
document.addEventListener('DOMContentLoaded', function () {
    const toggleIcon = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('pwd_input_002');

    if (toggleIcon && passwordInput) {
        toggleIcon.addEventListener('click', function () {
            // Toggle between password and text
            const currentType = passwordInput.getAttribute('type');
            const newType = currentType === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', newType);

            // Toggle eye icon (show/hide)
            this.classList.toggle('bi-eye-slash');
            this.classList.toggle('bi-eye');
        });
    }
});