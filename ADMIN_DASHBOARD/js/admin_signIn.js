function togglePassword() {
    const passwordField = document.getElementById("password");
    const eyeIcon = document.getElementById("eyeIcon");
    
    if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        passwordField.type = "password";
        eyeIcon.classList.replace("fa-eye-slash", "fa-eye");
    }
}

document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const ADMIN_EMAIL = "admin@clinic.edu.ph";
    const ADMIN_PASS = "admin1234";

    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {

        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminEmail', email);
        
        alert("Login Successful! Redirecting...");
        window.location.href = "index.html";
    } else {
        alert("Invalid credentials. Please try again.");
    }
});