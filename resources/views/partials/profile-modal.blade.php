<!-- Profile Modal (View Only) -->
<div class="modal fade" id="profileModal" tabindex="-1" aria-labelledby="profileModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content profile-modal-content p-4">
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Close"></button>
            <div class="text-center">
                <h2 class="fw-bold mb-4" id="profileModalLabel">PROFILE</h2>
                <div class="profile-avatar-large mx-auto mb-3"><i class="bi bi-person-fill"></i></div>
                <h3 class="fw-bold mb-0" id="profileName">{{ $user->first_name }} {{ $user->last_name }}</h3>
                <p class="text-uppercase fw-bold opacity-75" id="profileType">{{ ucfirst($user->user_type) }}</p>
                <div class="profile-details mt-4 text-start">
                    <p><strong>ID Number:</strong> <span id="profileId">{{ $user->school_id }}</span></p>
                    <p><strong>Course/Department:</strong> <span id="profileDept">{{ $user->department }}</span></p>
                    <p><strong>Email:</strong> <span id="profileEmail">{{ $user->email }}</span></p>
                    <p><strong>Contact:</strong> <span id="profileContact">{{ $user->contact ?: 'Not set' }}</span></p>
                </div>
                <button class="btn btn-edit-profile px-5 py-2 mt-4 rounded-3" id="editProfileBtn">EDIT PROFILE</button>
            </div>
        </div>
    </div>
</div>