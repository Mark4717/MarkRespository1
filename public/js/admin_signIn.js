const passwordField = document.getElementById("password");
const toggleButton = document.getElementById("togglePassword");
const eyeIcon = document.getElementById("eyeIcon");
const loginForm = document.getElementById("adminLoginForm");
const alertBox = document.getElementById("loginAlert");
const submitButton = document.getElementById("submitButton");

toggleButton?.addEventListener("click", () => {
    const isPassword = passwordField.type === "password";

    passwordField.type = isPassword ? "text" : "password";
    eyeIcon.classList.toggle("fa-eye", !isPassword);
    eyeIcon.classList.toggle("fa-eye-slash", isPassword);
});

function showMessage(message, type) {
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type}`;
}

loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = "SIGNING IN...";
    alertBox.className = "alert d-none";
    alertBox.textContent = "";

    const formData = new FormData(loginForm);
    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");

    try {
        const response = await fetch(loginForm.action, {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": csrfToken,
                "X-Requested-With": "XMLHttpRequest",
                "Accept": "application/json",
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            const validationMessage = data.errors
                ? Object.values(data.errors).flat()[0]
                : null;

            showMessage(validationMessage ?? data.message ?? "Login failed.", "danger");
            return;
        }

        showMessage(data.message ?? "Login successful.", "success");
        window.location.href = data.redirect_url;
    } catch (error) {
        showMessage("Unable to reach the server. Please try again.", "danger");
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "SIGN IN";
    }
});
