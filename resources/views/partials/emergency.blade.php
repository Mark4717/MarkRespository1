<!-- Emergency Request Section -->
<section id="emergency-section" class="content-section d-none">
    <div class="alert alert-danger-custom d-flex align-items-center p-3 mb-3" id="emergencyAlert">
        <i class="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
        <div>
            <strong>EMERGENCY MEDICAL REQUEST</strong><br>
            <small>
                @if($user->user_type === 'student')
                    For life-threatening emergencies, call 911 immediately or use the emergency hotline below
                @else
                    As {{ ucfirst($user->user_type) }}, contact the clinic administration or use emergency services
                @endif
            </small>
        </div>
    </div>

    <div class="row g-3 mb-4">
        <div class="col-md-6">
            <div class="hotline-card p-3 text-center">
                <i class="bi bi-telephone-fill fs-4"></i>
                <h6 class="mt-2">CHMSU Clinic Emergency</h6>
                <strong>+63 (34) 123-4567</strong>
            </div>
        </div>
        <div class="col-md-6">
            <div class="hotline-card p-3 text-center">
                <i class="bi bi-telephone-fill fs-4"></i>
                <h6 class="mt-2">National Emergency Hotline</h6>
                <strong>911</strong>
            </div>
        </div>
    </div>

    <div class="dark-list-container p-4">
        <h5 class="fw-bold mb-3">EMERGENCY REQUEST FORM</h5>
        <form id="emergencyForm" action="{{ route('dashboard.emergency') }}" method="POST">
            @csrf
            <div class="mb-3">
                <label class="small fw-bold">Patient Full Name *</label>
                <input type="text" class="form-control custom-input" id="emergencyPatientName" placeholder="Enter full name" value="{{ $user->first_name }} {{ $user->last_name }}" required>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="small fw-bold">Contact Number *</label>
                    <input type="tel" class="form-control custom-input" id="emergencyContact" placeholder="+63 XXX XXX XXXX" required>
                </div>
                <div class="col-md-6">
                    <label class="small fw-bold">Current Location *</label>
                    <input type="text" class="form-control custom-input" id="emergencyLocation" placeholder="Building/Room/Landmark" required>
                </div>
            </div>
            <div class="mb-3">
                <label class="small fw-bold">Type of Emergency *</label>
                <select class="form-control custom-input" id="emergencyType" required>
                    <option value="" selected disabled>Select emergency type...</option>
                    <option value="Medical Emergency">Medical Emergency</option>
                    <option value="Accident/Injury">Accident/Injury</option>
                    <option value="Breathing Difficulty">Breathing Difficulty</option>
                    <option value="Chest Pain">Chest Pain</option>
                    <option value="Unconsciousness">Unconsciousness</option>
                    <option value="Severe Bleeding">Severe Bleeding</option>
                    <option value="Severe Allergic Reaction">Severe Allergic Reaction</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="mb-4">
                <label class="small fw-bold">Symptoms and Condition *</label>
                <textarea class="form-control custom-input" id="emergencySymptoms" rows="3" placeholder="Describe the symptoms and current condition" required></textarea>
            </div>
            <div class="text-center">
                <button type="submit" class="btn btn-emergency-custom px-5 rounded-pill" id="submitEmergency">
                    <i class="bi bi-exclamation-triangle me-2"></i>SUBMIT EMERGENCY REQUEST
                </button>
            </div>
        </form>
    </div>

    <div class="dark-list-container mt-4 p-4">
        <h5 class="fw-bold mb-3">Your Emergency Requests</h5>
        <div id="emergencyRequestsList"></div>
    </div>
</section>