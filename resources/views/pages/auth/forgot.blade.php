<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password - CHMSU Online Clinic</title>

    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/forgot.css') }}">
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

    <!-- Forgot Password card -->
    <div class="forgot-container">
        <div class="forgot-card text-center">
            <h2 class="fw-bold mb-3">FORGOT PASSWORD?</h2>
            <p class="mb-4" style="opacity:0.9; font-size:1.1rem;">
                Enter your email / school ID and we'll send you a reset link
            </p>

            <!-- Success / status -->
            @if (session('status'))
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    {{ session('status') }}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            @endif

            <!-- Validation errors -->
            @if ($errors->any())
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    Please correct the errors below.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            @endif

            <form method="POST" action="{{ route('forgot') }}" autocomplete="off">
                @csrf

                <!-- Dummy field  (same as login) -->
                <input type="text" name="xfakefield987" autocomplete="off" style="display:none;">

                <!-- Email / School ID -->
                <div class="mb-4">
                    <input 
                        type="text" 
                        class="form-control @error('email') is-invalid @enderror" 
                        name="email" 
                        placeholder="EMAIL / SCHOOL ID"
                        value="{{ old('email') }}" 
                        required
                        autofocus
                        autocomplete="off"
                    >
                    @error('email')
                        <div class="invalid-feedback text-start">
                            {{ $message }}
                        </div>
                    @enderror
                </div>

                <!-- Submit -->
                <button type="submit" class="btn btn-reset w-100 fw-bold">SEND RESET LINK</button>
            </form>

            <p class="mt-4 small">
                Remember your password? 
                <a href="{{ route('sign_in') }}" class="text-decoration-none fw-medium">
                    <strong>Sign in here</strong>
                </a>
            </p>
        </div>
    </div>

    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{ asset('js/forgot.js') }}"></script>

</body>
</html>