// CHMSU Online Clinic - Main Application Script

document.addEventListener('DOMContentLoaded', () => {
    // ============= DATA STORAGE =============
    // Always source the values from the database; clear stale localStorage content
    localStorage.removeItem('appointments');
    localStorage.removeItem('emergencyRequests');
    localStorage.removeItem('userProfile');

    let appointments = [];
    let emergencyRequests = [];
    
    // User Profile - Default empty/guest state (will be overwritten by Blade data)
    let userProfile = {
        name: 'GUEST USER',
        type: 'STUDENT',
        idNumber: '',
        department: '',
        email: '',
        contact: '',
        lastUpdated: new Date().toISOString()
    };

    // View state for medical records
    let currentView = 'timeline';
    let searchTerm = '';

    // ============= DOM ELEMENTS =============
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    const viewAllBtn = document.getElementById('viewAllAppointments');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const logoutBtn = document.getElementById('logoutBtn');
    const cancelBooking = document.getElementById('cancelBooking');
    const apptForm = document.getElementById('appointmentForm');
    const emergencyForm = document.getElementById('emergencyForm');
    const editProfileBtn = document.getElementById('editProfileBtn');

    console.log('Found navLinks:', navLinks.length);
    console.log('Found sections:', sections.length);

    // Initialize profile display with server-rendered data
    updateProfileDisplay();

    // ============= HELPER FUNCTIONS =============
    function saveData() {
        localStorage.setItem('appointments', JSON.stringify(appointments));
        localStorage.setItem('emergencyRequests', JSON.stringify(emergencyRequests));
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }

    function showToast(message, type = 'success') {
        const toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) return;
        
        const toastId = 'toast-' + Date.now();
        const bgColor = type === 'success' ? 'bg-success' : 
                        type === 'danger' ? 'bg-danger' : 
                        type === 'warning' ? 'bg-warning' : 'bg-info';
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'danger' ? 'exclamation-triangle' : 
                    type === 'warning' ? 'exclamation-triangle' : 'info-circle';
        
        const toastHTML = `
            <div id="${toastId}" class="toast align-items-center text-white ${bgColor} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="bi bi-${icon} me-2"></i>
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
        toast.show();
        setTimeout(() => toastElement.remove(), 3500);
    }

    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    function formatShortDate(dateString) {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    function updateProfileDisplay() {
        const profileNameEl = document.getElementById('profileName');
        const profileTypeEl = document.getElementById('profileType');
        const profileIdEl = document.getElementById('profileId');
        const profileDeptEl = document.getElementById('profileDept');
        const profileEmailEl = document.getElementById('profileEmail');
        const profileContactEl = document.getElementById('profileContact');

        // If userProfile already has user data (from edit), push it to DOM
        if (userProfile.name && userProfile.name !== 'GUEST USER' && profileNameEl) {
            profileNameEl.textContent = userProfile.name;
        } else if (profileNameEl) {
            userProfile.name = profileNameEl.textContent.trim();
        }

        if (userProfile.type && profileTypeEl) {
            profileTypeEl.textContent = userProfile.type;
        } else if (profileTypeEl) {
            userProfile.type = profileTypeEl.textContent.trim();
        }

        if (userProfile.idNumber && profileIdEl) {
            profileIdEl.textContent = userProfile.idNumber;
        } else if (profileIdEl) {
            userProfile.idNumber = profileIdEl.textContent.trim();
        }

        if (userProfile.department && profileDeptEl) {
            profileDeptEl.textContent = userProfile.department;
        } else if (profileDeptEl) {
            userProfile.department = profileDeptEl.textContent.trim();
        }

        if (userProfile.email && profileEmailEl) {
            profileEmailEl.textContent = userProfile.email;
        } else if (profileEmailEl) {
            userProfile.email = profileEmailEl.textContent.trim();
        }

        if (userProfile.contact && profileContactEl) {
            profileContactEl.textContent = userProfile.contact || 'Not set';
        } else if (profileContactEl) {
            userProfile.contact = profileContactEl.textContent.trim();
        }

        // Keep localStorage in sync
        saveData();
    }

    // ============= STATISTICS FUNCTIONS =============
    function updateDashboardStats() {
        const totalAppointments = appointments.length;
        const pendingCount = appointments.filter(a => a.status === 'Pending').length;
        const approvedCount = appointments.filter(a => a.status === 'Approved').length;
        const today = new Date().toISOString().split('T')[0];
        const upcomingVisits = appointments.filter(a => a.status === 'Approved' && a.date >= today).length;

        const totalElement = document.getElementById('totalAppointments');
        const pendingElement = document.getElementById('pendingAppointments');
        const approvedElement = document.getElementById('approvedAppointments');
        const upcomingElement = document.getElementById('upcomingVisits');
        
        if (totalElement) totalElement.textContent = totalAppointments;
        if (pendingElement) pendingElement.textContent = pendingCount;
        if (approvedElement) approvedElement.textContent = approvedCount;
        if (upcomingElement) upcomingElement.textContent = upcomingVisits;

        updateMedicalRecordsStats();
    }

    function updateMedicalRecordsStats() {
        const completedAppointments = appointments.filter(a => a.status === 'Completed');
        const totalVisits = completedAppointments.length;
        const totalCertificates = appointments.filter(a => a.service_type === 'Medical Certificate' && a.status === 'Completed').length;
        
        let lastVisit = 'N/A';
        if (completedAppointments.length > 0) {
            const sortedVisits = [...completedAppointments].sort((a, b) => new Date(b.appointment_date || b.date) - new Date(a.appointment_date || a.date));
            lastVisit = formatShortDate(sortedVisits[0].appointment_date || sortedVisits[0].date);
        }

        const totalVisitsElement = document.getElementById('totalVisits');
        const totalCertificatesElement = document.getElementById('totalCertificates');
        const lastVisitElement = document.getElementById('lastVisitDate');
        
        if (totalVisitsElement) totalVisitsElement.textContent = totalVisits;
        if (totalCertificatesElement) totalCertificatesElement.textContent = totalCertificates;
        if (lastVisitElement) lastVisitElement.textContent = lastVisit;
    }

    // ============= BACKEND LOADERS =============
    function loadAppointments() {
        fetch('/dashboard/appointments')
            .then(response => response.json())
            .then(data => {
                appointments = data;
                updateDashboardStats();
                renderRecentAppointments();
                renderMyAppointments(getActiveFilter());
            })
            .catch(error => {
                console.error('Error loading appointments:', error);
            });
    }

    function loadEmergencyRequests() {
        fetch('/dashboard/emergency-requests')
            .then(response => response.json())
            .then(data => {
                emergencyRequests = data;
                renderEmergencyRequests();
                renderRecentAppointments();
            })
            .catch(error => {
                console.error('Error loading emergency requests:', error);
                emergencyRequests = JSON.parse(localStorage.getItem('emergencyRequests')) || [];
                renderEmergencyRequests();
            });
    }

    // ============= CORE ACTIONS =============
    function bookAppointment(formData) {
        fetch('/dashboard/book-appointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({
                service_type: formData.service,
                appointment_date: formData.date,
                appointment_time: formData.time,
                reason_for_visit: formData.reason,
                urgent_check: formData.urgent ? 1 : 0
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast('Appointment booked successfully!', 'success');
                loadAppointments();
                showSection('my-appt-section');
            } else {
                showToast(data.message || 'Failed to book appointment.', 'danger');
            }
        })
        .catch(error => {
            console.error('Book appointment error:', error);
            showToast('Failed to book appointment. Please try again.', 'danger');
        });
    }

    function submitEmergencyRequest(formData) {
        fetch('/dashboard/emergency', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({
                emergency_patient_name: formData.patientName,
                emergency_contact: formData.contact,
                emergency_location: formData.location,
                emergency_type: formData.type,
                emergency_symptoms: formData.symptoms
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast('Emergency request submitted! Clinic staff will contact you.', 'danger');
                // refresh emergency requests list from server
                loadEmergencyRequests();
                document.getElementById('emergencyForm').reset();
                const alertBox = document.getElementById('emergencyAlert');
                if (alertBox) {
                    const originalContent = alertBox.innerHTML;
                    alertBox.innerHTML = `
                        <i class="bi bi-check-circle-fill me-3 fs-4"></i>
                        <div><strong>REQUEST RECEIVED</strong><br><small>Clinic staff has been notified.</small></div>
                    `;
                    alertBox.classList.remove('alert-danger-custom');
                    alertBox.classList.add('alert-success');
                    setTimeout(() => {
                        alertBox.innerHTML = originalContent;
                        alertBox.classList.remove('alert-success');
                        alertBox.classList.add('alert-danger-custom');
                    }, 5000);
                }
            } else {
                showToast(data.message || 'Failed to submit emergency request.', 'danger');
            }
        })
        .catch(error => {
            console.error('Emergency request error:', error);
            showToast('Failed to submit emergency request. Please try again.', 'danger');
        });
    }

    // ============= RENDER FUNCTIONS =============
    function renderRecentAppointments() {
        const recentContainer = document.getElementById('recentAppointmentsList');
        if (!recentContainer) return;
        recentContainer.innerHTML = '';

        const allItems = [
            ...appointments.map(a => ({ ...a, type: 'appointment' })),
            ...emergencyRequests.map(e => ({ ...e, type: 'emergency' }))
        ].sort((a, b) => new Date(b.created_at || b.appointment_date) - new Date(a.created_at || a.appointment_date));

        const recentItems = allItems.slice(0, 5);
        
        if (recentItems.length === 0) {
            recentContainer.innerHTML = '<div class="list-item p-3 text-center"><small class="opacity-75">No recent appointments. Book your first appointment!</small></div>';
            return;
        }

        recentItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'list-item d-flex justify-content-between p-3';
            
            if (item.type === 'emergency') {
                itemElement.innerHTML = `
                    <div class="col-md-8">
                        <h6 class="m-0 fw-bold text-danger">🚨 EMERGENCY: ${item.emergency_type}</h6>
                        <small><i class="bi bi-geo-alt me-1"></i>${item.current_location}</small>
                    </div>
                    <span class="badge-custom badge-pending rounded-pill px-3">URGENT</span>
                `;
            } else {
                const statusClass = item.status === 'Pending' ? 'badge-pending' : 
                                item.status === 'Approved' ? 'badge-approved' : 
                                item.status === 'Completed' ? 'badge-completed' : 'badge-cancelled';
                itemElement.innerHTML = `
                    <div class="col-md-8">
                        <h6 class="m-0 fw-bold">${item.service_type}</h6>
                        <small><i class="bi bi-calendar3 me-1"></i>${formatDate(item.appointment_date)} ${item.appointment_time ? `at ${item.appointment_time}` : ''}</small>
                    </div>
                    <span class="badge-custom ${statusClass} rounded-pill px-3">${item.status}</span>
                `;
            }
            recentContainer.appendChild(itemElement);
        });
    }

    function renderMyAppointments(filter = 'ALL') {
        const appointmentList = document.getElementById('appointmentList');
        const loader = document.getElementById('appointmentLoader');
        const noAppointments = document.getElementById('noAppointmentsMessage');
        
        if (!appointmentList) return;
        if (loader) loader.classList.remove('d-none');
        if (noAppointments) noAppointments.classList.add('d-none');
        appointmentList.innerHTML = '';

        setTimeout(() => {
            if (loader) loader.classList.add('d-none');

            let filteredAppointments = [...appointments];
            if (filter !== 'ALL') {
                filteredAppointments = appointments.filter(a => a.status.toUpperCase() === filter);
            }
            filteredAppointments.sort((a, b) => new Date(b.created_at || b.appointment_date) - new Date(a.created_at || a.appointment_date));

            if (filter === 'ALL' || filter === 'PENDING') {
                const pendingEmergencies = emergencyRequests.filter(e => e.status === 'Pending');
                filteredAppointments = [...filteredAppointments, ...pendingEmergencies.map(e => ({ ...e, isEmergency: true }))];
            }

            if (filteredAppointments.length === 0) {
                if (noAppointments) noAppointments.classList.remove('d-none');
                return;
            }

            filteredAppointments.forEach(item => {
                if (item.isEmergency) {
                    const emergencyCard = document.createElement('div');
                    emergencyCard.className = 'card-item-light mb-3 p-3 border border-danger border-2';
                    emergencyCard.innerHTML = `
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h5 class="fw-bold text-danger">🚨 EMERGENCY REQUEST</h5>
                                <p class="mb-1"><strong>Patient:</strong> ${item.patient_name}</p>
                                <p class="mb-1"><strong>Type:</strong> ${item.emergency_type}</p>
                                <p class="mb-1"><strong>Location:</strong> ${item.current_location}</p>
                                <small class="text-muted">${new Date(item.created_at).toLocaleString()}</small>
                            </div>
                            <span class="badge-custom badge-pending">URGENT</span>
                        </div>
                    `;
                    appointmentList.appendChild(emergencyCard);
                } else {
                    const statusClass = item.status === 'Pending' ? 'badge-pending' : 
                                    item.status === 'Approved' ? 'badge-approved' : 
                                    item.status === 'Completed' ? 'badge-completed' : 'badge-cancelled';
                    
                    const apptCard = document.createElement('div');
                    apptCard.className = 'card-item-light mb-3 p-3';
                    apptCard.innerHTML = `
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h5 class="fw-bold mb-0">${item.service_type}</h5>
                                    <span class="badge-custom ${statusClass}">${item.status}</span>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <p class="mb-1"><strong><i class="bi bi-calendar"></i> Date:</strong> ${formatDate(item.appointment_date)}</p>
                                        <p class="mb-1"><strong><i class="bi bi-clock"></i> Time:</strong> ${item.appointment_time}</p>
                                        <p class="mb-1"><strong><i class="bi bi-chat"></i> Reason:</strong> ${item.reason_for_visit || 'Not specified'}</p>
                                    </div>
                                    <div class="col-md-6">
                                        ${item.urgent ? '<p class="text-danger"><i class="bi bi-exclamation-triangle-fill"></i> Urgent Request</p>' : ''}
                                        <p class="mb-1"><small class="text-muted">Submitted: ${new Date(item.created_at).toLocaleDateString()}</small></p>
                                    </div>
                                </div>
                                ${item.status === 'Pending' ? `
                                    <div class="mt-3 pt-2 border-top">
                                        <button class="btn btn-sm btn-cancel-card cancel-appt" data-id="${item.id}">
                                            <i class="bi bi-x-circle"></i> CANCEL
                                        </button>
                                    </div>
                                ` : ''}
                                ${item.status === 'Approved' ? `
                                    <div class="mt-2 p-2 bg-success bg-opacity-10 rounded">
                                        <small><i class="bi bi-check-circle-fill text-success"></i> Your appointment has been approved.</small>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `;
                    appointmentList.appendChild(apptCard);
                }
            });

            document.querySelectorAll('.cancel-appt').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    if (!confirm('Are you sure you want to cancel this appointment?')) return;

                    fetch('/dashboard/cancel-appointment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                        },
                        body: JSON.stringify({ appointment_id: id })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            showToast('Appointment cancelled successfully', 'warning');
                            loadAppointments();
                        } else {
                            showToast(data.message || 'Failed to cancel appointment.', 'danger');
                        }
                    })
                    .catch(error => {
                        console.error('Cancel appointment error:', error);
                        showToast('Failed to cancel appointment. Please try again.', 'danger');
                    });
                });
            });
        }, 300);
    }

    function getActiveFilter() {
        const activeTab = document.querySelector('.filter-tab.active');
        return activeTab ? activeTab.getAttribute('data-filter') : 'ALL';
    }

    function renderEmergencyRequests() {
        const emergencyList = document.getElementById('emergencyRequestsList');
        if (!emergencyList) return;
        emergencyList.innerHTML = '';

        if (emergencyRequests.length === 0) {
            emergencyList.innerHTML = '<div class="text-center p-3"><small>No emergency requests yet</small></div>';
            return;
        }

        emergencyRequests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).forEach(emergency => {
            const emergencyCard = document.createElement('div');
            emergencyCard.className = 'card-item-light mb-3 p-3';
            emergencyCard.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="fw-bold text-danger">🚨 ${emergency.emergency_type}</h6>
                        <p class="mb-1"><strong>Location:</strong> ${emergency.current_location}</p>
                        <p class="mb-1"><strong>Symptoms:</strong> ${emergency.symptoms}</p>
                        <small class="text-muted">Submitted: ${new Date(emergency.created_at).toLocaleString()}</small>
                    </div>
                    <span class="badge-custom badge-pending">PENDING</span>
                </div>
            `;
            emergencyList.appendChild(emergencyCard);
        });
    }

    function renderMedicalRecords() {
        updateMedicalRecordsStats();
        const medicalRecordsList = document.getElementById('medicalRecordsList');
        if (!medicalRecordsList) return;
        
        const completedAppointments = appointments.filter(a => a.status === 'Completed');
        
        if (completedAppointments.length === 0) {
            medicalRecordsList.innerHTML = '<div class="text-center p-4"><i class="bi bi-folder2-open fs-1 opacity-50"></i><p class="mt-2">No medical records available</p></div>';
            return;
        }
        
        const sortedRecords = [...completedAppointments].sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));
        
        medicalRecordsList.innerHTML = sortedRecords.map(record => `
            <div class="card-item-light mb-3 p-3">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="fw-bold">${record.service_type}</h6>
                        <small class="text-muted">${formatDate(record.appointment_date)} ${record.appointment_time ? `at ${record.appointment_time}` : ''}</small>
                        <p class="mt-2 mb-1"><strong>Reason:</strong> ${record.reason_for_visit || 'Not specified'}</p>
                        ${record.diagnosis ? `<p class="mb-1"><strong>Diagnosis:</strong> ${record.diagnosis}</p>` : ''}
                        ${record.notes ? `<p class="mb-0"><small><strong>Doctor's Notes:</strong> ${record.notes}</small></p>` : ''}
                    </div>
                    <span class="badge-custom badge-completed">COMPLETED</span>
                </div>
            </div>
        `).join('');
    }

    // ============= EDIT PROFILE MODAL =============
    function openProfileEditModal() {
        // Close the view profile modal first
        const profileModalElement = document.getElementById('profileModal');
        const profileModal = bootstrap.Modal.getInstance(profileModalElement);
        if (profileModal) profileModal.hide();
        
        setTimeout(() => {
            // Create edit modal HTML with simple but elegant design
            const modalHTML = `
                <div class="modal fade edit-profile-modal" id="editProfileModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">
                                    <i class="bi bi-pencil-square me-2"></i>EDIT PROFILE
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form id="editProfileForm">
                                    <div class="mb-3">
                                        <label class="form-label">FULL NAME</label>
                                        <input type="text" class="form-control" id="editName" value="${escapeHtml(userProfile.name || '')}" placeholder="Enter your full name">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">USER TYPE</label>
                                        <select class="form-select" id="editType">
                                            <option value="STUDENT" ${userProfile.type === 'STUDENT' ? 'selected' : ''}>Student</option>
                                            <option value="FACULTY" ${userProfile.type === 'FACULTY' ? 'selected' : ''}>Faculty</option>
                                            <option value="STAFF" ${userProfile.type === 'STAFF' ? 'selected' : ''}>Staff</option>
                                        </select>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">ID NUMBER</label>
                                        <input type="text" class="form-control" id="editIdNumber" value="${escapeHtml(userProfile.idNumber || '')}" placeholder="Enter your ID number">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">DEPARTMENT / COURSE</label>
                                        <input type="text" class="form-control" id="editDepartment" value="${escapeHtml(userProfile.department || '')}" placeholder="Enter your department or course">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">EMAIL ADDRESS</label>
                                        <input type="email" class="form-control" id="editEmail" value="${escapeHtml(userProfile.email || '')}" placeholder="Enter your email address">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">CONTACT NUMBER</label>
                                        <input type="tel" class="form-control" id="editContact" value="${escapeHtml(userProfile.contact || '')}" placeholder="Enter your contact number">
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-cancel-edit" data-bs-dismiss="modal">
                                    <i class="bi bi-x-lg me-1"></i>CANCEL
                                </button>
                                <button type="button" class="btn btn-save-edit" id="saveProfileBtn">
                                    <i class="bi bi-check-lg me-1"></i>SAVE CHANGES
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Remove existing modal if any
            const existingModal = document.getElementById('editProfileModal');
            if (existingModal) existingModal.remove();
            
            // Add modal to body
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Show the modal
            const editModalElement = document.getElementById('editProfileModal');
            const editModal = new bootstrap.Modal(editModalElement);
            editModal.show();
            
            // Save button event
            document.getElementById('saveProfileBtn').addEventListener('click', () => {
                const fullName = document.getElementById('editName').value.trim() || 'GUEST USER';
                const department = document.getElementById('editDepartment').value.trim();
                const email = document.getElementById('editEmail').value.trim();
                const contact = document.getElementById('editContact').value.trim();

                const payload = {
                    full_name: fullName,
                    department,
                    email,
                    contact
                };

                fetch('/dashboard/profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    },
                    body: JSON.stringify(payload)
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        userProfile = {
                            ...userProfile,
                            name: fullName.toUpperCase(),
                            department,
                            email,
                            contact,
                            lastUpdated: new Date().toISOString()
                        };

                        saveData();
                        updateProfileDisplay();
                        editModal.hide();
                        showToast('Profile updated successfully!', 'success');
                    } else {
                        showToast(data.message || 'Failed to save profile. Please try again.', 'danger');
                    }
                })
                .catch(error => {
                    console.error('Profile update error:', error);
                    showToast('Failed to save profile. Please try again.', 'danger');
                });

                // Clean up modal after close
                setTimeout(() => {
                    const modalElement = document.getElementById('editProfileModal');
                    if (modalElement) modalElement.remove();
                }, 300);
            });
            
            // Clean up modal when closed
            editModalElement.addEventListener('hidden.bs.modal', () => {
                setTimeout(() => {
                    const modalElement = document.getElementById('editProfileModal');
                    if (modalElement) modalElement.remove();
                }, 300);
            });
        }, 300);
    }
    
    // Helper function to escape HTML
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function showSection(sectionId) {
        console.log('Showing section:', sectionId);
        sections.forEach(sec => {
            const shouldHide = sec.id !== sectionId;
            sec.classList.toggle('d-none', shouldHide);
            console.log('Section', sec.id, shouldHide ? 'hidden' : 'shown');
        });
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('data-section') === sectionId));
        window.scrollTo(0, 0);
        if (window.innerWidth < 992 && sidebar) sidebar.classList.add('collapsed');
        
        if (sectionId === 'my-appt-section') renderMyAppointments(getActiveFilter());
        else if (sectionId === 'records-section') renderMedicalRecords();
        else if (sectionId === 'emergency-section') renderEmergencyRequests();
    }

    // ============= EVENT LISTENERS =============
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Nav link clicked:', this.getAttribute('data-section'));
            showSection(this.getAttribute('data-section'));
        });
    });

    if (viewAllBtn) viewAllBtn.addEventListener('click', () => showSection('my-appt-section'));
    
    const overviewBookBtn = document.getElementById('overviewBookBtn');
    if (overviewBookBtn) overviewBookBtn.addEventListener('click', () => showSection('book-section'));
    
    const overviewEmergencyBtn = document.getElementById('overviewEmergencyBtn');
    if (overviewEmergencyBtn) overviewEmergencyBtn.addEventListener('click', () => showSection('emergency-section'));

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                showToast('Logged out successfully', 'info');
                setTimeout(() => window.location.reload(), 1500);
            }
        });
    }

    if (cancelBooking) {
        cancelBooking.addEventListener('click', () => {
            if (confirm('Cancel booking? All entered data will be lost.')) {
                document.getElementById('appointmentForm').reset();
                showSection('overview-section');
            }
        });
    }

    if (apptForm) {
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('appointmentDate');
        if (dateInput) dateInput.setAttribute('min', today);

        apptForm.addEventListener('submit', (e) => {
            e.preventDefault();
            bookAppointment({
                service: document.getElementById('serviceType').value,
                date: document.getElementById('appointmentDate').value,
                time: document.getElementById('appointmentTime').value,
                reason: document.getElementById('reasonForVisit').value,
                urgent: document.getElementById('urgentCheck').checked
            });
            apptForm.reset();
        });
    }

    if (emergencyForm) {
        emergencyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitEmergencyRequest({
                patientName: document.getElementById('emergencyPatientName').value,
                contact: document.getElementById('emergencyContact').value,
                location: document.getElementById('emergencyLocation').value,
                type: document.getElementById('emergencyType').value,
                symptoms: document.getElementById('emergencySymptoms').value
            });
        });
    }

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            renderMyAppointments(this.getAttribute('data-filter'));
        });
    });

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', openProfileEditModal);
    }

    // ============= INITIALIZATION =============
    updateProfileDisplay();
    loadAppointments();
    loadEmergencyRequests();
    loadMedicalRecords();
});