<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $page_name ?? 'Signup - CHMSU Online Clinic' }}</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/signup.css') }}">
</head>
<body>

    <a href="{{ route('home') }}" class="back-header">
        <i class="bi bi-arrow-left"></i> BACK
    </a>

    <a class="header-brand" href="{{ route('home') }}">
        <img src="{{ asset('images/logo.png') }}" alt="CHMSU Logo" class="header-logo">
        CHMSU<br>Online Clinic
    </a>

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

            @if ($errors->any())
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    Please fix the errors below.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            @endif

            <form method="POST" action="{{ route('signup') }}">
                @csrf

                <div class="row mb-3">
                    <div class="col">
                        <input type="text" class="form-control @error('first_name') is-invalid @enderror" 
                               name="first_name" placeholder="FIRST NAME" 
                               value="{{ old('first_name') }}" required>
                        @error('first_name') <div class="invalid-feedback">{{ $message }}</div> @enderror
                    </div>
                    <div class="col">
                        <input type="text" class="form-control @error('last_name') is-invalid @enderror" 
                               name="last_name" placeholder="LAST NAME" 
                               value="{{ old('last_name') }}" required>
                        @error('last_name') <div class="invalid-feedback">{{ $message }}</div> @enderror
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col">
                        <input type="text" class="form-control @error('school_id') is-invalid @enderror" 
                               name="school_id" placeholder="SCHOOL ID" 
                               value="{{ old('school_id') }}" required>
                        @error('school_id') <div class="invalid-feedback">{{ $message }}</div> @enderror
                    </div>
                    <div class="col position-relative">
                        <select name="user_type" class="form-control @error('user_type') is-invalid @enderror" required>
                            <option value="" disabled selected hidden>USER TYPE</option>
                            <option value="student" {{ old('user_type') == 'student' ? 'selected' : '' }}>Student</option>
                            <option value="faculty" {{ old('user_type') == 'faculty' ? 'selected' : '' }}>Faculty</option>
                            <option value="staff"   {{ old('user_type') == 'staff'   ? 'selected' : '' }}>Staff</option>
                        </select>
                        <i class="bi bi-chevron-down dropdown-icon"></i>
                        @error('user_type') <div class="invalid-feedback">{{ $message }}</div> @enderror
                    </div>
                </div>

                <div class="mb-3 position-relative">
                    <select name="department" class="form-control @error('department') is-invalid @enderror" required>
                        <option value="" disabled selected hidden>DEPARTMENT / COLLEGE</option>
                        <option value="COLLEGE OF CRIMINAL JUSTICE" {{ old('department') == 'COLLEGE OF CRIMINAL JUSTICE' ? 'selected' : '' }}>Bachelor of Science in Criminal Justice</option>
                        <option value="COLLEGE OF EDUCATION" {{ old('department') == 'COLLEGE OF EDUCATION' ? 'selected' : '' }}>Bachelor of Science in Education</option>
                        <option value="COLLEGE OF FISHERIES" {{ old('department') == 'COLLEGE OF FISHERIES' ? 'selected' : '' }}>Bachelor of Science in Fisheries</option>
                        <option value="COLLEGE OF BUSINESS ADMINISTRATION"   {{ old('department') == 'COLLEGE OF BUSINESS ADMINISTRATION'   ? 'selected' : '' }}>Bachelor of Science in Business Administration</option>
                        <option value="COLLEGE OF INFORMATION TECHNOLOGY"   {{ old('department') == 'COLLEGE OF INFORMATION TECHNOLOGY'   ? 'selected' : '' }}>Bachelor of Science in Information Technology</option>
                        
                    </select>
                    <i class="bi bi-chevron-down dropdown-icon"></i>
                    @error('department') <div class="invalid-feedback">{{ $message }}</div> @enderror
                </div>

                <div class="mb-3">
                    <input type="email" class="form-control @error('email') is-invalid @enderror" 
                           name="email" placeholder="EMAIL ADDRESS" 
                           value="{{ old('email') }}" required>
                    @error('email') <div class="invalid-feedback">{{ $message }}</div> @enderror
                </div>

                <div class="mb-3">
                    <input type="tel" class="form-control @error('contact') is-invalid @enderror" 
                           name="contact" placeholder="CONTACT NUMBER (Optional)" 
                           value="{{ old('contact') }}">
                    @error('contact') <div class="invalid-feedback">{{ $message }}</div> @enderror
                </div>

                <div class="row mb-3">
                    <div class="col position-relative">
                        <input type="password" class="form-control @error('password') is-invalid @enderror" 
                               name="password" placeholder="PASSWORD" required>
                        <i class="bi bi-eye-slash password-toggle-icon" id="password1-toggle"></i>
                        @error('password') <div class="invalid-feedback">{{ $message }}</div> @enderror
                    </div>
                    <div class="col position-relative">
                        <input type="password" class="form-control @error('password_confirmation') is-invalid @enderror" 
                               name="password_confirmation" placeholder="CONFIRM PASSWORD" required>
                        <i class="bi bi-eye-slash password-toggle-icon" id="password2-toggle"></i>
                        @error('password_confirmation') <div class="invalid-feedback">{{ $message }}</div> @enderror
                    </div>
                </div>

                <div class="form-check mb-3 text-start">
                    <input class="form-check-input" type="checkbox" id="terms" name="terms" required>
                    <label class="form-check-label" for="terms">
                        I agree to the <a href="#" target="_blank">Terms of Service and Privacy</a>
                    </label>
                </div>

                <button type="submit" class="btn btn-register w-100 fw-bold mb-2">
                    CREATE ACCOUNT
                </button>

                <p class="small">
                    Already have an account? 
                    <a href="{{ route('sign_in') }}"><strong>Sign In here</strong></a>
                </p>
            </form>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{ asset('js/signup.js') }}"></script>

</body>
</html>