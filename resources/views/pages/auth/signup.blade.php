<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $page_name ?? 'Signup - CHMSU Online Clinic' }}</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="{{ asset('css/signup.css') }}">
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

    <!-- Register form -->
    <div class="register-container">
        <div class="register-card text-center">
            <h2 class="fw-bold mb-2">CREATE ACCOUNT</h2>
            <p class="mb-4" style="opacity:0.9; font-size:1rem;">
                Register to look appointment online
            </p>

            @if(session('error'))
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    {{ session('error') }}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            @endif

            <form method="POST" action="{{ route('signup') }}">
                @csrf

                <!-- First & Last Name -->
                <div class="row mb-3">
                    <div class="col">
                        <input type="text" class="form-control" name="first_name" placeholder="FIRST NAME" required>
                    </div>
                    <div class="col">
                        <input type="text" class="form-control" name="last_name" placeholder="LAST NAME" required>
                    </div>
                </div>

                <!-- School ID & User Type -->
                <div class="row mb-3">
                    <div class="col">
                        <input type="text" class="form-control" name="school_id" placeholder="SCHOOL ID" required>
                    </div>
                    <div class="col position-relative">
                        <select name="user_type" class="form-control user-type-select" required>
                            <option value="" disabled selected hidden>USER TYPE</option>
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                            <option value="admin">Admin</option>
                        </select>
                        <i class="bi bi-chevron-down dropdown-icon"></i>
                    </div>
                </div>

                <!-- DEPARTMENT / COLLEGE -->
                <div class="mb-3 position-relative">
                    <select name="department" class="form-control department-select" required>
                        <option value="" disabled selected hidden>DEPARTMENT / COLLEGE</option>
                        <option value="college_of_science">College of Information Technology</option>
                        <option value="college_of_education">College of Education</option>
                        <option value="college_of_arts">College of Criminial Justice</option>
                    </select>
                    <i class="bi bi-chevron-down dropdown-icon"></i>
                </div>

                <!-- Email -->
                <div class="mb-3">
                    <input type="email" class="form-control" name="email" placeholder="EMAIL ADDRESS" required>
                </div>

                <!-- Password & Confirm -->
                <div class="row mb-3">
                    <div class="col position-relative">
                        <input type="password" class="form-control" name="password" placeholder="PASSWORD" required>
                        <i class="bi bi-eye-slash password-toggle-icon" id="password1-toggle"></i>
                    </div>
                    <div class="col position-relative">
                        <input type="password" class="form-control" name="password_confirmation" placeholder="CONFIRM PASSWORD" required>
                        <i class="bi bi-eye-slash password-toggle-icon" id="password2-toggle"></i>
                    </div>
                </div>

                <!-- Terms -->
                <div class="form-check mb-3 text-start">
                    <input class="form-check-input" type="checkbox" id="terms" required>
                    <label class="form-check-label" for="terms">
                        I agree to the <a href="#">Terms of Service and Privacy</a>
                    </label>
                </div>

                <!-- Submit -->
                <a href="{{ route('sign_in') }}" class="btn btn-register w-100 fw-bold mb-2 text-decoration-none">
                        CREATE ACCOUNT
                </a>

                <p class="small">
                    Already have an acc? 
                    <a href="{{ route('sign_in') }}"><strong>Sign In here</strong></a>
                </p>

            </form>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Custom JS -->
    <script src="{{ asset('js/signup.js') }}"></script>

</body>
</html>