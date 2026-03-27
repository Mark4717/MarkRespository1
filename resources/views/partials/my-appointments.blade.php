<!-- My Appointments Section -->
<section id="my-appt-section" class="content-section d-none">
    <h1 class="fw-bold">MY APPOINTMENTS</h1>
    <p class="mb-4">View and manage your appointments</p>

    <div class="dark-list-container p-4">
        <div class="filter-bar mb-4">
            <button type="button" class="filter-tab active" data-filter="ALL" aria-pressed="true">ALL</button>
            <button type="button" class="filter-tab" data-filter="PENDING" aria-pressed="false">PENDING</button>
            <button type="button" class="filter-tab" data-filter="APPROVED" aria-pressed="false">APPROVED</button>
            <button type="button" class="filter-tab" data-filter="COMPLETED" aria-pressed="false">COMPLETED</button>
            <button type="button" class="filter-tab" data-filter="CANCELLED" aria-pressed="false">CANCELLED</button>
        </div>

        <div id="appointmentList" class="appointment-list"></div>

        <div id="appointmentLoader" class="d-none">
            <div class="spinner"></div>
            <p class="text-center mt-2">Loading appointments...</p>
        </div>

        <div id="noAppointmentsMessage" class="text-center p-5 d-none">
            <i class="bi bi-calendar-x fs-1 opacity-50"></i>
            <p class="mt-3">No appointments found</p>
        </div>
    </div>
</section>
