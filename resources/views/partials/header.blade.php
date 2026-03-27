<!-- Header -->
<header class="main-header d-flex justify-content-between align-items-center px-4">
    <div class="header-logo d-flex align-items-center">
        <button id="sidebarToggle" class="btn me-3 text-dark fs-4 p-0" type="button" aria-label="Toggle user navigation" aria-controls="sidebar" aria-expanded="true">
            <i class="bi bi-list"></i>
        </button>
        <img src="{{ asset('assets/logos.png') }}" alt="Logo" width="50" class="me-2" onerror="this.style.display='none'">
        <div class="lh-1 text-dark">
            <span class="fw-bold d-block">CHMSU</span>
            <small>Online Clinic</small>
        </div>
    </div>
    <div class="profile-trigger" data-bs-toggle="modal" data-bs-target="#profileModal" role="button" tabindex="0" aria-label="Open profile details">
        <i class="bi bi-person-circle"></i>
    </div>
</header>
