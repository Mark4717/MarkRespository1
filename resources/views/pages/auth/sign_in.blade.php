<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $page_name ?? 'Login - CHMSU Online Clinic' }}</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="{{ asset('css/sign_in.css') }}">
</head>
<body>

    <!-- Back button -->
    <a href="{{ route('home') }}" class="back-header">
        <i class="bi bi-arrow-left"></i> BACK
    </a>

    <!-- Logo & text -->
    <a class="header-brand" href="{{ route('home') }}">
        <img src="{{ asset('images/logo.png') }}" alt="CHMSU Logo" class="header-logo">
        CHMSU<br>Online Clinic
    </a>

    <!-- Login card -->
    <div class="login-container">
        <div class="login-card text-center">
            <h2 class="fw-bold mb-3">WELCOME BACK</h2>
            <p class="mb-4" style="opacity:0.9; font-size:1.1rem;">
                Login to access your appointment
            </p>

            @if(session('error'))
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    {{ session('error') }}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            @endif

            <form method="POST" action="{{ route('sign_in') }}" autocomplete="off">
                @csrf

                <!-- Dummy field to mess with browser autofill -->
                <input type="text" name="xfakefield987" autocomplete="off" style="display:none;">

                <!-- Email / School ID (no tooltip) -->
                <div class="mb-4">
                    <input 
                        type="text" 
                        class="form-control @error('email') is-invalid @enderror" 
                        id="uid_input_001" 
                        name="uid_input_001" 
                        placeholder="EMAIL / SCHOOL ID"
                        value="{{ old('email') }}" 
                        required
                        autocomplete="off"
                    >
                    @error('email')
                        <div class="invalid-feedback text-start">
                            {{ $message }}
                        </div>
                    @enderror
                </div>

                <!-- Password with toggle icon -->
                <div class="mb-4 position-relative">
                    <input 
                        type="password" 
                        class="form-control @error('password') is-invalid @enderror" 
                        id="pwd_input_002" 
                        name="pwd_input_002" 
                        placeholder="PASSWORD" 
                        required
                        autocomplete="off"
                    >
                    <i class="bi bi-eye-slash password-toggle-icon" id="togglePassword"></i>
                    @error('password')
                        <div class="invalid-feedback text-start">
                            {{ $message }}
                        </div>
                    @enderror
                </div>

                <!-- Remember & forgot -->
                <div class="d-flex justify-content-between align-items-center mb-4 small">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="remember" name="remember">
                        <label class="form-check-label" for="remember">Remember Me</label>
                    </div>
                    <a href="#" class="text-decoration-none fw-medium">FORGOT PASSWORD!</a>
                </div>

                <!-- Submit -->
                <button type="submit" class="btn btn-signin w-100 fw-bold">SIGN IN</button>
            </form>

            <p class="mt-4 small">
                Don't have an account? 
                <a href="{{ route('signup') }}" class="text-decoration-none fw-medium">
                    <strong>Create account here.</strong>
                </a>
            </p>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Custom JS (password toggle only) -->
    <script src="{{ asset('js/sign_in.js') }}"></script>

</body>
</html>