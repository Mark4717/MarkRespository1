<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $page_name ?? 'Clinic Admin Portal' }}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="{{ asset('css/admin_signin.css') }}">
</head>
<body>
    <div class="container-fluid login-wrapper d-flex flex-column align-items-center justify-content-center">
        <h1 class="portal-title mb-4">CLINIC ADMIN PORTAL</h1>

        <div class="login-card p-5">
            <h2 class="welcome-text mb-4 text-center">WELCOME BACK!</h2>

            <div id="loginAlert" class="alert d-none" role="alert"></div>

            <form id="adminLoginForm" action="{{ route('admin.login.submit') }}" method="POST">
                @csrf

                <div class="mb-4">
                    <label for="email" class="form-label">EMAIL ADDRESS</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        class="form-control custom-input"
                        value="{{ old('email') }}"
                        required
                    >
                </div>

                <div class="mb-4 position-relative">
                    <label for="password" class="form-label">PASSWORD</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        class="form-control custom-input"
                        required
                    >
                    <button type="button" class="password-toggle" id="togglePassword" aria-label="Toggle password visibility">
                        <i class="fa-solid fa-eye" id="eyeIcon"></i>
                    </button>
                </div>

                <div class="mb-4">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="rememberMe" name="remember" value="1">
                        <label class="form-check-label" for="rememberMe">
                            Remember Me
                        </label>
                    </div>
                </div>

                <div class="text-center">
                    <button type="submit" class="btn btn-signin w-75" id="submitButton">SIGN IN</button>
                </div>
            </form>
        </div>
    </div>

    <script src="{{ asset('js/admin_signin.js') }}"></script>
</body>
</html>
