<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CHMSU Online Clinic</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/styles.css')}}">
</head>
<body>
<!--header-->
<nav class="navbar navbar-expand-lg navbar-dark sticky-top custom-nav">
    <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="#">
            <img src="images/LOGO1.png" alt="Logo" width="40" class="me-2"> 
            <span>CHMSU Online Clinic</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav mx-auto">
                <li class="nav-item"><a class="nav-link active" href="#home">HOME</a></li>
                <li class="nav-item"><a class="nav-link" href="#about">ABOUT</a></li>
                <li class="nav-item"><a class="nav-link" href="#services">SERVICES</a></li>
                <li class="nav-item"><a class="nav-link" href="#contact">CONTACT</a></li>
            </ul>
            <div class="d-flex gap-3">
                <a href="{{ route('sign_in')}}">
                 <button class="uiverse-button">SIGN IN</button>
                </a>
                <a href="{{ route('signup')}}">
                 <button class="uiverse-button">SIGN UP</button>
                </a>
                
            </div>
        </div>
    </div>
</nav>
<!--home-->
<section id="home" class="hero-section d-flex align-items-center">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-lg-6 text-white">
                <h1 class="display-4 fw-bold">Book your Clinic Appointment Online.</h1>
                <p class="fs-2 fw-light">Fast, Easy & Secure.</p>
                <div class="mt-4">
                    <button class="btn btn-book-custom me-3">Book Appointment</button>
                    <button class="btn btn-emergency-custom">Emergency Request</button>
                </div>
            </div>
            <div class="col-lg-6 text-center">
                <img src="images/logo.png" alt="CHMSU Seal" class="img-fluid hero-logo">
            </div>
        </div>
    </div>
</section>
<!--about-->
<section id="about" class="about-section py-5 bg-light-teal">
    <div class="container text-center">
        <h2 class="display-5 fw-bold mb-5">ABOUT</h2>
        <p class="lead mb-5 mx-auto" style="max-width: 900px;">
            The Carlos Hilado Memorial State University Online Clinic Appointment System provides students, faculty ,and staff with convenient access to healthcare services. Our platform steamlines the appointment booking process, reduces waiting times, and ensure quality medical care for the entire university community.
        </p>
        <div class="row g-4 justify-content-center">
            <div class="col-md-4">
                <div class="stat-card p-4 h-100">
                    <i class="bi bi-shield-check fs-2 mb-3 d-block"></i>
                    <h4 class="fw-bold">+8000</h4>
                    <p class="small mb-0">Student Served</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="stat-card p-4 h-100">
                    <i class="bi bi-laptop fs-2 mb-3 d-block"></i>
                    <h4 class="fw-bold">24/7</h4>
                    <p class="small mb-0">Online Booking</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="stat-card p-4 h-100">
                    <i class="bi bi-building-check fs-2 mb-3 d-block"></i>
                    <h4 class="fw-bold">Campus Based</h4>
                    <p class="small mb-0">Carlos Hilado Memorial State Univesity-Binalbagan Campus</p>
                </div>
            </div>
        </div>
    </div>
</section>
<!--services-->
<section id="services" class="services-section py-5">
    <div class="container text-center">
        <h2 class="display-5 fw-bold mb-5 text-white">OUR SERVICES</h2>
        <p class="lead mb-5 mx-auto text-white" style="max-width: 900px;">
            Comprehensive healthcare services tailored to meet the needs of our university community.
        </p>
        <div class="row g-4 justify-content-center">
            <div class="col-md-4">
                <div class="service-card p-4 h-100">
                    <i class="bi bi-clipboard2-pulse fs-1 mb-3"></i>
                    <h3>Consultation</h3>
                    <p>Schedule a one-on-one session with our medical staff to discuss health concerns and receive professional advice.</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="service-card p-4 h-100">
                    <i class="bi bi-file-earmark-medical fs-1 mb-3"></i>
                    <h3>Medical Clearance</h3>
                    <p>Efficiently process medical certificates and clearances required for academic, OJT, or school activities.</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="service-card p-4 h-100">
                    <i class="bi bi-heart-pulse fs-1 mb-3"></i>
                    <h3>Health Checkup</h3>
                    <p>Regular physical examinations and vital signs monitoring to maintain your overall wellness throughout the semester.</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="service-card p-4 h-100">
                    <i class="bi bi-hospital fs-1 mb-3"></i>
                    <h3>First Aid Support</h3>
                    <p>Immediate medical assistance and first-aid response for urgent health situations occurring on university grounds.</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="service-card p-4 h-100">
                    <i class="bi bi-calendar-check fs-1 mb-3"></i>
                    <h3>Patient Monitoring</h3>
                    <p>Coordinated follow-up visits to ensure your recovery is progressing as planned after an initial treatment.</p>
                </div>
            </div>
        </div>
    </div>
</section>
<!--contact-->
<section id="contact" class="contact-section py-5 bg-light-teal">
    <div class="container">
        <h2 class="display-5 fw-bold mb-5 text-center">Contact</h2>
        <p class="lead mb-5 mx-auto text-center" style="max-width: 900px;">
            Get in touch with our clinic for any inquries or assistance.
        </p>
        <div class="row g-4 text-center">
            <div class="col-md-3">
                <div class="contact-card p-4 shadow-sm bg-white rounded-3 h-100">
                    <i class="bi bi-geo-alt-fill fs-2 text-primary"></i>
                    <h5 class="mt-3 fw-bold">Location</h5>
                    <p class="small text-muted">CHMSU Binalbagan Campus, Negros Occidental</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="contact-card p-4 shadow-sm bg-white rounded-3 h-100">
                    <i class="bi bi-telephone-fill fs-2 text-primary"></i>
                    <h5 class="mt-3 fw-bold">Contact #</h5>
                    <p class="small text-muted">+63 912 345 6789</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="contact-card p-4 shadow-sm bg-white rounded-3 h-100">
                    <i class="bi bi-envelope-fill fs-2 text-primary"></i>
                    <h5 class="mt-3 fw-bold">Email Address</h5>
                    <p class="small text-muted">clinic.binalbagan@chmsu.edu.ph</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="contact-card p-4 shadow-sm bg-white rounded-3 border-danger-top h-100">
                    <i class="bi bi-exclamation-triangle-fill fs-2 text-danger"></i>
                    <h5 class="mt-3 fw-bold text-danger">Emergency</h5>
                    <p class="small fw-bold text-danger">911 / (034) 123-4567</p>
                </div>
            </div>
        </div>
    </div>
</section>
<!--footer-->
<footer class="footer py-4 text-center text-white">
    <img src="images/LOGO1.png" width="50" alt="Logo">
    <p class="mt-2 mb-0">CHMSU ONLINE CLINIC</p>
    <small>Your Health Priority</small>
    <hr class="w-50 mx-auto my-3">
    <p class="mb-0 small">@2026 Carlos Hilado Memorial State University. All rights reserved.</p>
</footer>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="{{ asset('js/script.js')}}"></script>
</body>
</html>