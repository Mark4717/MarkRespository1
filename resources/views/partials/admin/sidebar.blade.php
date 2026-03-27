<nav class="sidebar p-3 d-flex flex-column" id="sidebar" aria-label="Admin navigation">
    <div class="text-center mb-4">
        <img src="{{ asset('images/logo.png') }}" alt="CHMSU Logo" class="sidebar-logo">
        <h5 class="text-white fw-bold mt-2 sidebar-text">CHMSU</h5>
    </div>

    <ul class="nav flex-column gap-2" id="sidebarNav">
        <li class="nav-item"><a class="nav-link active" href="#section-dashboard" data-section="dashboard" aria-current="page"><i class="bi bi-grid-fill"></i> <span class="ms-2">DASHBOARD</span></a></li>
        <li class="nav-item"><a class="nav-link" href="#section-appointment" data-section="appointment"><i class="bi bi-calendar-event"></i> <span class="ms-2">APPOINTMENT</span></a></li>
        <li class="nav-item"><a class="nav-link" href="#section-patients" data-section="patients"><i class="bi bi-people-fill"></i> <span class="ms-2">PATIENTS</span></a></li>
        <li class="nav-item"><a class="nav-link" href="#section-medical-records" data-section="medical-records"><i class="bi bi-file-earmark-medical"></i> <span class="ms-2">MEDICAL RECORDS</span></a></li>
        <li class="nav-item"><a class="nav-link" href="#section-reports" data-section="reports"><i class="bi bi-graph-up"></i> <span class="ms-2">REPORTS</span></a></li>
        <li class="nav-item"><a class="nav-link" href="#section-system" data-section="system"><i class="bi bi-gear-fill"></i> <span class="ms-2">SYSTEM</span></a></li>
    </ul>

    <form action="{{ route('logout') }}" method="POST" id="adminLogoutForm" class="mt-auto">
        @csrf
        <button type="submit" class="btn logout-btn w-100 rounded-pill d-flex align-items-center justify-content-center">
            <i class="bi bi-box-arrow-left"></i>
            <span class="ms-2 sidebar-text">LOG OUT</span>
        </button>
    </form>
</nav>
