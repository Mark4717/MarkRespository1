<!-- Book Appointment Section -->
<section id="book-section" class="content-section d-none">
    <h1 class="fw-bold">BOOK APPOINTMENT</h1>
    <p class="mb-4">Schedule your medical appointment with our clinic</p>
    <div class="dark-list-container p-4">
        <h5 class="fw-bold mb-3">Appointment Details</h5>
        <form id="appointmentForm" action="{{ route('dashboard.book-appointment') }}" method="POST">
            @csrf
            <div class="mb-3">
                <label class="form-label small">Service Type *</label>
                <select class="form-select custom-input" id="serviceType" name="service_type" required>
                    <option value="" selected disabled>Choose a service...</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Medical Certificate">Medical Certificate</option>
                    <option value="General Check-up">General Check-up</option>
                    <option value="Follow-up Visit">Follow-up Visit</option>
                    <option value="Dental Check-up">Dental Check-up</option>
                </select>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="form-label small">Preferred Date *</label>
                    <input type="date" id="appointmentDate" name="appointment_date" class="form-control custom-input" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label small">Preferred Time *</label>
                    <input type="time" id="appointmentTime" name="appointment_time" class="form-control custom-input" required>
                </div>
            </div>
            <div class="mb-3">
                <label class="form-label small">Reason for Visit *</label>
                <textarea class="form-control custom-input" id="reasonForVisit" name="reason_for_visit" rows="4" placeholder="Please describe your symptoms or reason for visit" required></textarea>
            </div>
            <div class="form-check mb-4">
                <input class="form-check-input" type="checkbox" id="urgentCheck" name="urgent_check">
                <label class="form-check-label" for="urgentCheck"><span class="text-warning">Check this if you need immediate medical attention. Emergency cases will be prioritized.</span></label>
            </div>
            <div class="info-box p-3 mb-4 rounded">
                <small><strong>Please Note:</strong></small>
                <ul class="small mb-0 mt-2">
                    <li>Appointments are subject to doctor availability</li>
                    <li>You will receive a notification once approved</li>
                    <li>Please arrive 10 minutes before your scheduled time</li>
                    <li>Bring your School ID and any relevant medical documents</li>
                </ul>
            </div>
            <div class="d-flex justify-content-center gap-3">
                <button type="button" class="btn btn-cancel-card px-5 rounded-pill" id="cancelBooking">CANCEL</button>
                <button type="submit" class="btn btn-submit px-5 rounded-pill">SUBMIT APPOINTMENT</button>
            </div>
        </form>
    </div>
</section>