<!-- Overview Section -->
<section id="overview-section" class="content-section">
    <h1 class="fw-bold">WELCOME BACK {{ $user->first_name }} {{ $user->last_name }}!</h1>
    <p class="mb-4">
        @if($user->user_type === 'student')
            Here's an overview of your appointment and health records as a {{ ucfirst($user->user_type) }}
        @elseif($user->user_type === 'faculty')
            Welcome to your faculty dashboard - manage your appointments and health records
        @else
            Welcome to your staff dashboard - access your clinic services and records
        @endif
    </p>
    <div class="row g-4 mb-4">
        <div class="col-md-3">
            <div class="stat-card h-100">
                <small>Total<br>Appointment</small>
                <div class="display-5 fw-bold mt-auto" id="totalAppointments">{{ $totalAppointments }}</div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card h-100">
                <small>Pending<br>Status</small>
                <div class="display-5 fw-bold mt-auto" id="pendingAppointments">{{ $pendingAppointments }}</div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card h-100">
                <small>Approved<br>Status</small>
                <div class="display-5 fw-bold mt-auto" id="approvedAppointments">{{ $completedAppointments }}</div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card h-100">
                <small>Upcoming<br>Visit</small>
                <div class="display-5 fw-bold mt-auto" id="upcomingVisits">{{ $totalMedicalRecords }}</div>
            </div>
        </div>
    </div>
    <div class="action-bar d-flex justify-content-between align-items-center p-3 mb-4 text-white">
        <div class="ps-2">
            <span class="d-block">Need Medical Assistance?</span>
            <small class="opacity-90">Book an Appointment or Request Emergency care</small>
        </div>
        <div class="d-flex gap-2">
            <button class="btn btn-book px-4 rounded-pill" id="overviewBookBtn">BOOK APPOINTMENT</button>
            <button class="btn btn-emergency-custom px-4 rounded-pill" id="overviewEmergencyBtn">EMERGENCY CARE</button>
        </div>
    </div>
    <div class="dark-list-container">
        <div class="list-header d-flex justify-content-between p-3">
            <div class="col-md-5">
                <h6 class="m-0 fw-bold">Recent Appointments</h6>
                <small class="opacity-75">Your latest medical appointments</small>
            </div>
            <button id="viewAllAppointments" class="btn btn-viewall rounded-pill px-4">VIEW ALL</button>
        </div>
        <div id="recentAppointmentsList"></div>
    </div>
</section>