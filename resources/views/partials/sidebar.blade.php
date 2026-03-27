<!-- Sidebar -->
<nav id="sidebar" class="vh-100 sticky-top d-flex flex-column" aria-label="User navigation">
    <ul class="nav flex-column px-0">
        <li class="nav-item">
            <a href="#overview-section" class="nav-link active" data-section="overview-section" aria-current="page">
                <i class="bi bi-search me-2"></i> OVERVIEW
            </a>
        </li>
        <li class="nav-item">
            <a href="#book-section" class="nav-link" data-section="book-section">
                <i class="bi bi-calendar-check me-2"></i> BOOK APPOINTMENT
            </a>
        </li>
        <li class="nav-item">
            <a href="#my-appt-section" class="nav-link" data-section="my-appt-section">
                <i class="bi bi-calendar3 me-2"></i> MY APPOINTMENT
            </a>
        </li>
        <li class="nav-item">
            <a href="#records-section" class="nav-link" data-section="records-section">
                <i class="bi bi-file-earmark-text me-2"></i> MEDICAL RECORDS
            </a>
        </li>
        <li class="nav-item">
            <a href="#emergency-section" class="nav-link" data-section="emergency-section">
                <i class="bi bi-alarm me-2"></i> EMERGENCY REQUEST
            </a>
        </li>
    </ul>
    <div class="sidebar-footer p-3 mt-auto mb-5 text-center">
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit" class="btn btn-logout px-5 rounded-pill shadow-sm" id="logoutBtn">LOG OUT</button>
        </form>
    </div>
</nav>
