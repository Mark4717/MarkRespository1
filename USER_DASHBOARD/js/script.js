// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Selectors
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    const viewAllBtn = document.getElementById('viewAllAppointments');
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    // Appointment Data Storage
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    let emergencyRequests = JSON.parse(localStorage.getItem('emergencyRequests')) || [];
    
    // User Profile Data Storage
    let userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
        name: 'JOHN DOE',
        type: 'STUDENT',
        idNumber: '2020-12345',
        department: 'BS Information Technology',
        email: 'john.doe@chmsu.edu.ph',
        contact: '+63 912 345 6789',
        address: '123 University Street, Bacolod City',
        birthdate: '2000-01-01',
        gender: 'Male',
        emergencyContact: 'MARIA DOE',
        emergencyPhone: '+63 923 456 7890',
        bloodType: 'O+',
        allergies: 'None',
        medicalConditions: 'None'
    };

    // Initialize user profile
    function initUserProfile() {
        updateProfileDisplay();
    }

    /**
     * Update all profile displays throughout the app
     */
    function updateProfileDisplay() {
        // Update main header and overview
        const userNameElement = document.getElementById('userName');
        if (userNameElement) userNameElement.textContent = userProfile.name;
        
        // Update profile modal
        const profileName = document.getElementById('profileName');
        const profileType = document.getElementById('profileType');
        const profileId = document.getElementById('profileId');
        const profileDept = document.getElementById('profileDept');
        const profileEmail = document.getElementById('profileEmail');
        const profileContact = document.getElementById('profileContact');
        
        if (profileName) profileName.textContent = userProfile.name;
        if (profileType) profileType.textContent = userProfile.type;
        if (profileId) profileId.textContent = userProfile.idNumber;
        if (profileDept) profileDept.textContent = userProfile.department;
        if (profileEmail) profileEmail.textContent = userProfile.email;
        if (profileContact) profileContact.textContent = userProfile.contact;
    }

    /**
     * Show toast notification
     */
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
            <div id="${toastId}" class="toast align-items-center text-white ${bgColor} border-0" role="alert" aria-live="assertive" aria-atomic="true">
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
        
        setTimeout(() => {
            toastElement.remove();
        }, 3500);
    }

    /**
     * Save data to localStorage
     */
    function saveData() {
        localStorage.setItem('appointments', JSON.stringify(appointments));
        localStorage.setItem('emergencyRequests', JSON.stringify(emergencyRequests));
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }

    /**
     * Update Dashboard Statistics
     */
    function updateDashboardStats() {
        const totalAppointments = appointments.length;
        const pendingCount = appointments.filter(a => a.status === 'Pending').length;
        const approvedCount = appointments.filter(a => a.status === 'Approved').length;
        
        // Get upcoming visits (approved appointments with future dates)
        const today = new Date().toISOString().split('T')[0];
        const upcomingVisits = appointments.filter(a => 
            a.status === 'Approved' && a.date >= today
        ).length;

        // Update stat cards
        const totalElement = document.getElementById('totalAppointments');
        const pendingElement = document.getElementById('pendingAppointments');
        const approvedElement = document.getElementById('approvedAppointments');
        const upcomingElement = document.getElementById('upcomingVisits');
        
        if (totalElement) totalElement.textContent = totalAppointments;
        if (pendingElement) pendingElement.textContent = pendingCount;
        if (approvedElement) approvedElement.textContent = approvedCount;
        if (upcomingElement) upcomingElement.textContent = upcomingVisits;

        // Update medical records stats
        updateMedicalRecordsStats();
    }

    /**
     * Update Medical Records Statistics
     */
    function updateMedicalRecordsStats() {
        // Count total visits (completed appointments)
        const totalVisits = appointments.filter(a => a.status === 'Completed').length;
        
        // Count medical certificates
        const totalCertificates = appointments.filter(a => 
            a.service === 'Medical Certificate' && a.status === 'Completed'
        ).length;
        
        // Get last visit date
        const completedAppointments = appointments.filter(a => a.status === 'Completed');
        let lastVisit = 'N/A';
        
        if (completedAppointments.length > 0) {
            // Sort by date (most recent first) and get the latest
            const sortedVisits = completedAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));
            const lastVisitDate = sortedVisits[0].date;
            lastVisit = formatDate(lastVisitDate);
        }

        // Update the stats in the medical records section
        const totalVisitsElement = document.getElementById('totalVisits');
        const totalCertificatesElement = document.getElementById('totalCertificates');
        const lastVisitElement = document.getElementById('lastVisitDate');
        
        if (totalVisitsElement) totalVisitsElement.textContent = totalVisits;
        if (totalCertificatesElement) totalCertificatesElement.textContent = totalCertificates;
        if (lastVisitElement) lastVisitElement.textContent = lastVisit;
    }

    /**
     * Format date for display
     */
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    /**
     * Format date for display in medical records (with time)
     */
    function formatDateTime(dateString, timeString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString(undefined, options);
        return timeString ? `${formattedDate} at ${timeString}` : formattedDate;
    }

    /**
     * Render Recent Appointments in Overview
     */
    function renderRecentAppointments() {
        const recentContainer = document.getElementById('recentAppointmentsList');
        if (!recentContainer) return;

        recentContainer.innerHTML = '';

        // Combine and sort appointments and emergencies by date
        const allItems = [
            ...appointments.map(a => ({ ...a, type: 'appointment' })),
            ...emergencyRequests.map(e => ({ ...e, type: 'emergency' }))
        ].sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

        // Get 5 most recent items
        const recentItems = allItems.slice(0, 5);
        
        if (recentItems.length === 0) {
            recentContainer.innerHTML = '<div class="list-item p-3 text-center"><small class="opacity-75">No recent appointments</small></div>';
            return;
        }

        recentItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'list-item d-flex justify-content-between p-3';
            
            if (item.type === 'emergency') {
                itemElement.innerHTML = `
                    <div class="col-md-8">
                        <h6 class="m-0 fw-bold text-danger">🚨 EMERGENCY: ${item.type}</h6>
                        <small><i class="bi bi-geo-alt me-1"></i>${item.location}</small>
                        <small class="d-block"><i class="bi bi-telephone me-1"></i>${item.contact}</small>
                    </div>
                    <span class="badge-custom badge-pending rounded-pill px-3">URGENT</span>
                `;
            } else {
                const statusClass = item.status === 'Pending' ? 'badge-pending' : 
                                   item.status === 'Approved' ? 'badge-approved' : 
                                   item.status === 'Completed' ? 'badge-completed' : 'badge-cancelled';
                
                itemElement.innerHTML = `
                    <div class="col-md-8">
                        <h6 class="m-0 fw-bold">${item.service}</h6>
                        <small><i class="bi bi-calendar3 me-1"></i>${formatDate(item.date)} 
                            <i class="bi bi-clock me-1"></i>${item.time}</small>
                    </div>
                    <span class="badge-custom ${statusClass} rounded-pill px-3">${item.status}</span>
                `;
            }
            recentContainer.appendChild(itemElement);
        });
    }

    /**
     * Render Emergency Requests in Emergency Section
     */
    function renderEmergencyRequests() {
        const emergencyList = document.getElementById('emergencyRequestsList');
        if (!emergencyList) return;

        emergencyList.innerHTML = '';

        if (emergencyRequests.length === 0) {
            emergencyList.innerHTML = '<div class="text-center p-3"><small>No emergency requests found</small></div>';
            return;
        }

        emergencyRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).forEach(emergency => {
            const emergencyCard = document.createElement('div');
            emergencyCard.className = 'card-item-light mb-3 p-3';
            emergencyCard.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="fw-bold text-danger">🚨 Emergency Request</h6>
                        <p class="mb-1"><strong>Type:</strong> ${emergency.type}</p>
                        <p class="mb-1"><strong>Location:</strong> ${emergency.location}</p>
                        <p class="mb-1"><strong>Symptoms:</strong> ${emergency.symptoms}</p>
                        <p class="mb-1"><strong>Contact:</strong> ${emergency.contact}</p>
                        <small class="text-muted">Submitted: ${new Date(emergency.createdAt).toLocaleString()}</small>
                    </div>
                    <span class="badge-custom ${emergency.status === 'Pending' ? 'badge-pending' : 'badge-completed'}">
                        ${emergency.status}
                    </span>
                </div>
            `;
            emergencyList.appendChild(emergencyCard);
        });
    }

    /**
     * Render Appointments in My Appointments Section
     */
    function renderMyAppointments(filter = 'ALL') {
        const appointmentList = document.getElementById('appointmentList');
        const loader = document.getElementById('appointmentLoader');
        const noAppointments = document.getElementById('noAppointmentsMessage');
        
        if (!appointmentList) return;

        // Show loader
        if (loader) loader.classList.remove('d-none');
        if (noAppointments) noAppointments.classList.add('d-none');
        appointmentList.innerHTML = '';

        // Simulate loading
        setTimeout(() => {
            if (loader) loader.classList.add('d-none');

            let filteredAppointments = [...appointments];
            
            // Apply filter
            if (filter !== 'ALL') {
                filteredAppointments = appointments.filter(a => a.status.toUpperCase() === filter);
            }

            // Sort by date (most recent first)
            filteredAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Add emergency requests to the list when filter is ALL or PENDING
            if (filter === 'ALL' || filter === 'PENDING') {
                const pendingEmergencies = emergencyRequests.filter(e => e.status === 'Pending');
                filteredAppointments = [...filteredAppointments, ...pendingEmergencies.map(e => ({
                    ...e,
                    isEmergency: true
                }))];
            }

            if (filteredAppointments.length === 0) {
                if (noAppointments) noAppointments.classList.remove('d-none');
                return;
            }

            filteredAppointments.forEach(item => {
                if (item.isEmergency) {
                    // Render emergency item
                    const emergencyCard = document.createElement('div');
                    emergencyCard.className = 'card-item-light mb-3 p-3 border border-danger border-2';
                    emergencyCard.innerHTML = `
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="flex-grow-1">
                                <h5 class="fw-bold text-danger">🚨 EMERGENCY REQUEST</h5>
                                <div class="row">
                                    <div class="col-md-6">
                                        <p class="mb-1"><strong>Patient:</strong> ${item.patientName}</p>
                                        <p class="mb-1"><strong>Type:</strong> ${item.type}</p>
                                        <p class="mb-1"><strong>Location:</strong> ${item.location}</p>
                                    </div>
                                    <div class="col-md-6">
                                        <p class="mb-1"><strong>Contact:</strong> ${item.contact}</p>
                                        <p class="mb-1"><strong>Symptoms:</strong> ${item.symptoms}</p>
                                        <small class="text-muted">${new Date(item.createdAt).toLocaleString()}</small>
                                    </div>
                                </div>
                            </div>
                            <span class="badge-custom badge-pending">URGENT</span>
                        </div>
                    `;
                    appointmentList.appendChild(emergencyCard);
                } else {
                    // Render regular appointment
                    const statusClass = item.status === 'Pending' ? 'badge-pending' : 
                                       item.status === 'Approved' ? 'badge-approved' : 
                                       item.status === 'Completed' ? 'badge-completed' : 'badge-cancelled';
                    
                    const apptCard = document.createElement('div');
                    apptCard.className = 'card-item-light mb-3 p-3';
                    apptCard.id = `appointment-${item.id}`;
                    apptCard.innerHTML = `
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h5 class="fw-bold mb-0">${item.service}</h5>
                                    <span class="badge-custom ${statusClass}">${item.status}</span>
                                </div>
                                
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <p class="mb-1"><strong><i class="bi bi-calendar"></i> Date:</strong> ${formatDate(item.date)}</p>
                                        <p class="mb-1"><strong><i class="bi bi-clock"></i> Time:</strong> ${item.time}</p>
                                        <p class="mb-1"><strong><i class="bi bi-chat"></i> Reason:</strong> ${item.reason || 'Not specified'}</p>
                                    </div>
                                    <div class="col-md-6">
                                        ${item.urgent ? '<p class="text-danger"><i class="bi bi-exclamation-triangle-fill"></i> Urgent Request</p>' : ''}
                                        <p class="mb-1"><small class="text-muted">Submitted: ${new Date(item.createdAt).toLocaleDateString()}</small></p>
                                    </div>
                                </div>
                                
                                ${item.status === 'Pending' ? `
                                    <div class="mt-3 pt-2 border-top">
                                        <button class="btn btn-sm btn-edit-card me-2 edit-appt" data-id="${item.id}">
                                            <i class="bi bi-pencil"></i> EDIT
                                        </button>
                                        <button class="btn btn-sm btn-cancel-card cancel-appt" data-id="${item.id}">
                                            <i class="bi bi-x-circle"></i> CANCEL
                                        </button>
                                    </div>
                                ` : ''}
                                
                                ${item.status === 'Approved' ? `
                                    <div class="mt-2 p-2 bg-success bg-opacity-10 rounded">
                                        <small><i class="bi bi-check-circle-fill text-success"></i> Your appointment has been approved. Please arrive 10 minutes early.</small>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `;
                    appointmentList.appendChild(apptCard);
                }
            });

            // Add event listeners for edit and cancel buttons
            document.querySelectorAll('.edit-appt').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    editAppointment(id);
                });
            });

            document.querySelectorAll('.cancel-appt').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    cancelAppointment(id);
                });
            });

        }, 300);
    }

    /**
     * Edit Appointment
     */
    function editAppointment(id) {
        const appointment = appointments.find(a => a.id === id);
        if (!appointment || appointment.status !== 'Pending') {
            showToast('Only pending appointments can be edited', 'warning');
            return;
        }

        // Create edit modal
        const modalHTML = `
            <div class="modal fade" id="editAppointmentModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">Edit Appointment</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="editAppointmentForm">
                                <div class="mb-3">
                                    <label class="form-label">Service Type</label>
                                    <select class="form-select" id="editService" required>
                                        <option value="Consultation" ${appointment.service === 'Consultation' ? 'selected' : ''}>Consultation</option>
                                        <option value="Medical Certificate" ${appointment.service === 'Medical Certificate' ? 'selected' : ''}>Medical Certificate</option>
                                        <option value="General Check-up" ${appointment.service === 'General Check-up' ? 'selected' : ''}>General Check-up</option>
                                        <option value="Follow-up Visit" ${appointment.service === 'Follow-up Visit' ? 'selected' : ''}>Follow-up Visit</option>
                                        <option value="Dental Check-up" ${appointment.service === 'Dental Check-up' ? 'selected' : ''}>Dental Check-up</option>
                                        <option value="Laboratory" ${appointment.service === 'Laboratory' ? 'selected' : ''}>Laboratory</option>
                                    </select>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Date</label>
                                        <input type="date" class="form-control" id="editDate" value="${appointment.date}" required min="${new Date().toISOString().split('T')[0]}">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Time</label>
                                        <input type="time" class="form-control" id="editTime" value="${appointment.time}" required>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Reason for Visit</label>
                                    <textarea class="form-control" id="editReason" rows="3" required>${appointment.reason || ''}</textarea>
                                </div>
                                <div class="form-check mb-3">
                                    <input class="form-check-input" type="checkbox" id="editUrgent" ${appointment.urgent ? 'checked' : ''}>
                                    <label class="form-check-label">Mark as Urgent</label>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-success" id="saveEditBtn">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('editAppointmentModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Initialize modal
        const editModal = new bootstrap.Modal(document.getElementById('editAppointmentModal'));
        editModal.show();

        // Handle save
        document.getElementById('saveEditBtn').addEventListener('click', () => {
            const updatedData = {
                service: document.getElementById('editService').value,
                date: document.getElementById('editDate').value,
                time: document.getElementById('editTime').value,
                reason: document.getElementById('editReason').value,
                urgent: document.getElementById('editUrgent').checked
            };

            // Validate
            if (!updatedData.service || !updatedData.date || !updatedData.time || !updatedData.reason) {
                showToast('Please fill in all fields', 'danger');
                return;
            }

            // Update appointment
            const index = appointments.findIndex(a => a.id === id);
            if (index !== -1) {
                appointments[index] = {
                    ...appointments[index],
                    ...updatedData,
                    lastEdited: new Date().toISOString()
                };
                
                saveData();
                editModal.hide();
                
                showToast('Appointment updated successfully!', 'success');
                
                // Refresh views
                updateDashboardStats();
                renderRecentAppointments();
                renderMyAppointments(getActiveFilter());
                
                // Remove modal from DOM after hiding
                setTimeout(() => {
                    document.getElementById('editAppointmentModal').remove();
                }, 500);
            }
        });
    }

    /**
     * Cancel Appointment
     */
    function cancelAppointment(id) {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            const index = appointments.findIndex(a => a.id === id);
            if (index !== -1) {
                appointments[index].status = 'Cancelled';
                appointments[index].cancelledAt = new Date().toISOString();
                saveData();
                
                showToast('Appointment cancelled successfully', 'warning');
                
                // Refresh views
                updateDashboardStats();
                renderRecentAppointments();
                renderMyAppointments(getActiveFilter());
            }
        }
    }

    /**
     * Get active filter tab
     */
    function getActiveFilter() {
        const activeTab = document.querySelector('.filter-tab.active');
        return activeTab ? activeTab.getAttribute('data-filter') : 'ALL';
    }

    /**
     * Book Appointment
     */
    function bookAppointment(formData) {
        const newAppointment = {
            id: Date.now().toString(),
            service: formData.service,
            date: formData.date,
            time: formData.time,
            reason: formData.reason,
            urgent: formData.urgent,
            status: 'Pending',
            createdAt: new Date().toISOString(),
            patientName: userProfile.name,
            patientId: userProfile.idNumber
        };

        appointments.push(newAppointment);
        saveData();
        
        showToast('Appointment booked successfully!', 'success');
        
        // Update all views
        updateDashboardStats();
        renderRecentAppointments();
        renderMyAppointments(getActiveFilter());
        
        // Redirect to My Appointments
        showSection('my-appt-section');
    }

    /**
     * Submit Emergency Request
     */
    function submitEmergencyRequest(formData) {
        const newEmergency = {
            id: 'EMG-' + Date.now().toString(),
            patientName: formData.patientName,
            contact: formData.contact,
            location: formData.location,
            type: formData.type,
            symptoms: formData.symptoms,
            status: 'Pending',
            createdAt: new Date().toISOString()
        };

        emergencyRequests.push(newEmergency);
        saveData();
        
        showToast('Emergency request submitted! Clinic staff will contact you immediately.', 'danger');
        
        // Update views
        updateDashboardStats();
        renderRecentAppointments();
        renderEmergencyRequests();
        renderMyAppointments(getActiveFilter());
        
        // Show confirmation in emergency section
        showEmergencyConfirmation();
        
        // Clear form
        document.getElementById('emergencyForm').reset();
    }

    /**
     * Show emergency confirmation
     */
    function showEmergencyConfirmation() {
        const alertBox = document.getElementById('emergencyAlert');
        if (alertBox) {
            const originalContent = alertBox.innerHTML;
            alertBox.innerHTML = `
                <i class="bi bi-check-circle-fill me-3 fs-4"></i>
                <div>
                    <strong>EMERGENCY REQUEST RECEIVED</strong><br>
                    <small>Clinic staff has been notified. Please stay by your phone.</small>
                </div>
            `;
            alertBox.classList.remove('alert-danger-custom');
            alertBox.classList.add('alert-success');
            
            // Reset after 10 seconds
            setTimeout(() => {
                alertBox.innerHTML = originalContent;
                alertBox.classList.remove('alert-success');
                alertBox.classList.add('alert-danger-custom');
            }, 10000);
        }
    }

    /**
     * Show section (SPA Navigation)
     */
    function showSection(sectionId) {
        sections.forEach(sec => {
            sec.classList.toggle('d-none', sec.id !== sectionId);
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-section') === sectionId);
        });

        window.scrollTo(0, 0);

        if (window.innerWidth < 992 && sidebar) {
            sidebar.classList.add('collapsed');
        }

        // Refresh section data when shown
        if (sectionId === 'my-appt-section') {
            renderMyAppointments(getActiveFilter());
        } else if (sectionId === 'records-section') {
            renderMedicalRecords();
        } else if (sectionId === 'emergency-section') {
            renderEmergencyRequests();
        }
    }

    /**
     * Render Medical Records - Complete medical history
     */
    function renderMedicalRecords() {
        // First update the stats
        updateMedicalRecordsStats();
        
        // Then render the detailed medical history
        const recordsList = document.getElementById('medicalRecordsList');
        if (!recordsList) return;

        const completedAppointments = appointments.filter(a => a.status === 'Completed');
        
        if (completedAppointments.length === 0) {
            recordsList.innerHTML = '<div class="text-center p-4"><small class="opacity-75">No medical records available. Completed appointments will appear here.</small></div>';
            return;
        }

        // Sort by date (most recent first)
        completedAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        recordsList.innerHTML = '';
        
        completedAppointments.forEach((record, index) => {
            const recordElement = document.createElement('div');
            recordElement.className = index < completedAppointments.length - 1 ? 'mb-4 pb-3 border-bottom border-light' : 'mb-3';
            
            // Determine if this is a medical certificate
            const isMedicalCertificate = record.service === 'Medical Certificate';
            const certificateBadge = isMedicalCertificate ? 
                '<span class="badge bg-info ms-2">Medical Certificate Issued</span>' : '';
            
            recordElement.innerHTML = `
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="fw-bold mb-0">
                        ${record.service}
                        ${certificateBadge}
                    </h6>
                    <small class="text-muted">Visit #${completedAppointments.length - index}</small>
                </div>
                <div class="row">
                    <div class="col-md-3">
                        <small><strong>Date:</strong> ${formatDateTime(record.date, record.time)}</small>
                    </div>
                    <div class="col-md-3">
                        <small><strong>Diagnosis:</strong> ${record.diagnosis || 'Pending diagnosis'}</small>
                    </div>
                    <div class="col-md-3">
                        <small><strong>Prescription:</strong> ${record.prescription || 'None prescribed'}</small>
                    </div>
                    <div class="col-md-3">
                        <small><strong>Doctor's Notes:</strong> ${record.notes || 'No notes'}</small>
                    </div>
                </div>
                ${record.followUp ? `
                    <div class="mt-2 p-2 bg-warning bg-opacity-10 rounded">
                        <small><i class="bi bi-calendar-check me-1"></i> <strong>Follow-up:</strong> ${formatDate(record.followUp)}</small>
                    </div>
                ` : ''}
            `;
            recordsList.appendChild(recordElement);
        });
        
        // Add summary at the bottom
        const summaryElement = document.createElement('div');
        summaryElement.className = 'mt-4 p-3 bg-primary bg-opacity-10 rounded';
        
        // Calculate additional statistics
        const uniqueConditions = new Set();
        completedAppointments.forEach(record => {
            if (record.diagnosis && record.diagnosis !== 'Pending diagnosis') {
                uniqueConditions.add(record.diagnosis);
            }
        });
        
        const averageVisitsPerMonth = (completedAppointments.length / 3).toFixed(1); // Assuming 3 months of data
        
        summaryElement.innerHTML = `
            <small class="fw-bold">Medical History Summary</small>
            <div class="row mt-2">
                <div class="col-md-3">
                    <small>Total Clinic Visits: <strong>${completedAppointments.length}</strong></small>
                </div>
                <div class="col-md-3">
                    <small>Medical Certificates: <strong>${appointments.filter(a => a.service === 'Medical Certificate' && a.status === 'Completed').length}</strong></small>
                </div>
                <div class="col-md-3">
                    <small>Unique Conditions: <strong>${uniqueConditions.size}</strong></small>
                </div>
                <div class="col-md-3">
                    <small>Avg. Visits/Month: <strong>${averageVisitsPerMonth}</strong></small>
                </div>
            </div>
        `;
        
        recordsList.appendChild(summaryElement);
    }

    /**
     * Complete an appointment (for demo/admin purposes)
     * In a real app, this would be done by clinic staff
     */
    function completeAppointment(id, diagnosis, prescription, notes) {
        const index = appointments.findIndex(a => a.id === id);
        if (index !== -1 && appointments[index].status === 'Approved') {
            appointments[index] = {
                ...appointments[index],
                status: 'Completed',
                diagnosis: diagnosis || 'Routine check-up',
                prescription: prescription || 'None',
                notes: notes || 'Patient advised to rest and follow up as needed',
                completedAt: new Date().toISOString()
            };
            saveData();
            
            showToast('Appointment marked as completed', 'success');
            
            // Refresh views
            updateDashboardStats();
            renderRecentAppointments();
            renderMyAppointments(getActiveFilter());
            renderMedicalRecords();
        }
    }

    /**
     * Open Profile Edit Modal - ULTRA SIMPLIFIED VERSION
     */
    function openProfileEditModal() {
        // Close the profile modal first if it's open
        const profileModal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
        if (profileModal) {
            profileModal.hide();
        }
        
        // Small delay to allow first modal to close
        setTimeout(() => {
            // Create edit profile modal - ONLY ESSENTIAL FIELDS
            const modalHTML = `
                <div class="modal fade" id="editProfileModal" tabindex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-md">
                        <div class="modal-content">
                            <div class="modal-header bg-primary text-white">
                                <h5 class="modal-title" id="editProfileModalLabel">
                                    <i class="bi bi-pencil-square me-2"></i>EDIT PROFILE
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form id="editProfileForm">
                                    <!-- Essential Information Only -->
                                    <div class="card">
                                        <div class="card-header bg-light">
                                            <h6 class="mb-0 fw-bold"><i class="bi bi-person me-2"></i>Personal Information</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <label class="form-label small fw-bold">Full Name</label>
                                                <input type="text" class="form-control" id="editName" value="${userProfile.name}" required>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label small fw-bold">User Type</label>
                                                <select class="form-select" id="editType">
                                                    <option value="STUDENT" ${userProfile.type === 'STUDENT' ? 'selected' : ''}>Student</option>
                                                    <option value="FACULTY" ${userProfile.type === 'FACULTY' ? 'selected' : ''}>Faculty</option>
                                                    <option value="STAFF" ${userProfile.type === 'STAFF' ? 'selected' : ''}>Staff</option>
                                                </select>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label small fw-bold">ID Number</label>
                                                <input type="text" class="form-control" id="editIdNumber" value="${userProfile.idNumber}" required>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label small fw-bold">Department/Course</label>
                                                <select class="form-select" id="editDepartment" required>
                                                    <option value="BS Criminology" ${userProfile.department === 'BS Criminology' ? 'selected' : ''}>BS Criminology</option>
                                                    <option value="BS Information Technology" ${userProfile.department === 'BS Information Technology' ? 'selected' : ''}>BS Information Technology</option>
                                                    <option value="BS Fisheries" ${userProfile.department === 'BS Fisheries' ? 'selected' : ''}>BS Fisheries</option>
                                                    <option value="BS Elementary Education" ${userProfile.department === 'BS Elementary Education' ? 'selected' : ''}>BS Elementary Education</option>
                                                    <option value="BS Secondary Education" ${userProfile.department === 'BS Secondary Education' ? 'selected' : ''}>BS Secondary Education</option>
                                                    <option value="BS Business Administration" ${userProfile.department === 'BS Business Administration' ? 'selected' : ''}>BS Business Administration</option>
                                                </select>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label small fw-bold">Email Address</label>
                                                <input type="email" class="form-control" id="editEmail" value="${userProfile.email}" required>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label small fw-bold">Contact Number</label>
                                                <input type="tel" class="form-control" id="editContact" value="${userProfile.contact}" placeholder="+63 XXX XXX XXXX" required>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                    <i class="bi bi-x-circle me-2"></i>CANCEL
                                </button>
                                <button type="button" class="btn btn-success" id="saveProfileBtn">
                                    <i class="bi bi-check-circle me-2"></i>SAVE CHANGES
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Remove existing modal if any
            const existingModal = document.getElementById('editProfileModal');
            if (existingModal) {
                existingModal.remove();
            }

            // Add modal to body
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Initialize modal
            const editModal = new bootstrap.Modal(document.getElementById('editProfileModal'));
            editModal.show();

            // Handle save
            document.getElementById('saveProfileBtn').addEventListener('click', () => {
                saveProfileChanges(editModal);
            });
        }, 300);
    }

    /**
     * Save Profile Changes (updated for simplified form)
     */
    function saveProfileChanges(modal) {
        // Validate required fields
        const requiredFields = [
            'editName', 'editIdNumber', 'editDepartment', 'editEmail', 'editContact'
        ];

        for (let fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            if (!field || !field.value.trim()) {
                showToast('Please fill in all required fields!', 'danger');
                if (field) field.focus();
                return;
            }
        }

        // Validate email format
        const email = document.getElementById('editEmail').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Please enter a valid email address!', 'danger');
            return;
        }

        // Validate contact number (basic PH format)
        const contact = document.getElementById('editContact').value;
        const phoneRegex = /^(\+63|0)[0-9]{10}$/;
        if (!phoneRegex.test(contact.replace(/\s/g, ''))) {
            showToast('Please enter a valid contact number (e.g., +63 XXX XXX XXXX)!', 'danger');
            return;
        }

        // Update user profile (keep all existing data, only update edited fields)
        const updatedProfile = {
            ...userProfile, // Keep all existing data
            name: document.getElementById('editName').value.toUpperCase(),
            type: document.getElementById('editType').value,
            idNumber: document.getElementById('editIdNumber').value,
            department: document.getElementById('editDepartment').value,
            email: document.getElementById('editEmail').value,
            contact: document.getElementById('editContact').value,
            lastUpdated: new Date().toISOString()
        };

        // Save to localStorage
        userProfile = updatedProfile;
        saveData();

        // Update display
        updateProfileDisplay();

        // Close modal
        modal.hide();

        // Show success message
        showToast('Profile updated successfully!', 'success');

        // Remove modal from DOM after hiding
        setTimeout(() => {
            document.getElementById('editProfileModal').remove();
        }, 500);
    }

    /**
     * Add sample data for demonstration with medical records
     */
    function addSampleData() {
        if (appointments.length === 0) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const lastWeek = new Date(today);
            lastWeek.setDate(lastWeek.getDate() - 7);
            const twoWeeksAgo = new Date(today);
            twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
            const threeWeeksAgo = new Date(today);
            threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);
            const lastMonth = new Date(today);
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            const twoMonthsAgo = new Date(today);
            twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
            
            const sampleAppointments = [
                // Completed appointments for medical records
                {
                    id: '1',
                    service: 'General Check-up',
                    date: twoWeeksAgo.toISOString().split('T')[0],
                    time: '09:00',
                    reason: 'Annual physical examination',
                    urgent: false,
                    status: 'Completed',
                    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
                    patientName: userProfile.name,
                    patientId: userProfile.idNumber,
                    diagnosis: 'Normal findings, healthy individual',
                    prescription: 'Multivitamins once daily',
                    notes: 'Blood pressure normal, weight within normal range. Advised to maintain healthy lifestyle.',
                    completedAt: new Date(Date.now() - 86400000 * 13).toISOString()
                },
                {
                    id: '2',
                    service: 'Medical Certificate',
                    date: threeWeeksAgo.toISOString().split('T')[0],
                    time: '14:30',
                    reason: 'Medical clearance for requirements',
                    urgent: false,
                    status: 'Completed',
                    createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
                    patientName: userProfile.name,
                    patientId: userProfile.idNumber,
                    diagnosis: 'Fit to take physical education classes',
                    prescription: 'None',
                    notes: 'Student is in good health and can participate in all physical activities.',
                    completedAt: new Date(Date.now() - 86400000 * 24).toISOString()
                },
                {
                    id: '3',
                    service: 'Consultation',
                    date: lastMonth.toISOString().split('T')[0],
                    time: '11:00',
                    reason: 'Follow-up consultation',
                    urgent: false,
                    status: 'Completed',
                    createdAt: new Date(Date.now() - 86400000 * 40).toISOString(),
                    patientName: userProfile.name,
                    patientId: userProfile.idNumber,
                    diagnosis: 'Seasonal allergies',
                    prescription: 'Antihistamines as needed',
                    notes: 'Patient reports sneezing and itchy eyes. Prescribed cetirizine 10mg.',
                    completedAt: new Date(Date.now() - 86400000 * 39).toISOString()
                },
                {
                    id: '4',
                    service: 'Medical Certificate',
                    date: twoMonthsAgo.toISOString().split('T')[0],
                    time: '10:00',
                    reason: 'Medical certificate for absences',
                    urgent: false,
                    status: 'Completed',
                    createdAt: new Date(Date.now() - 86400000 * 70).toISOString(),
                    patientName: userProfile.name,
                    patientId: userProfile.idNumber,
                    diagnosis: 'Acute upper respiratory infection',
                    prescription: 'Antibiotics, rest for 3 days',
                    notes: 'Patient diagnosed with URI. Advised to rest and drink plenty of fluids.',
                    completedAt: new Date(Date.now() - 86400000 * 69).toISOString()
                },
                {
                    id: '5',
                    service: 'General Check-up',
                    date: lastWeek.toISOString().split('T')[0],
                    time: '15:30',
                    reason: 'Regular check-up',
                    urgent: false,
                    status: 'Completed',
                    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
                    patientName: userProfile.name,
                    patientId: userProfile.idNumber,
                    diagnosis: 'Normal findings',
                    prescription: 'None',
                    notes: 'Patient in good health. Continued healthy lifestyle advised.',
                    completedAt: new Date(Date.now() - 86400000 * 9).toISOString()
                },
                // Pending and approved appointments
                {
                    id: '6',
                    service: 'General Check-up',
                    date: tomorrow.toISOString().split('T')[0],
                    time: '09:00',
                    reason: 'Annual physical examination',
                    urgent: false,
                    status: 'Approved',
                    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
                    patientName: userProfile.name,
                    patientId: userProfile.idNumber
                },
                {
                    id: '7',
                    service: 'Medical Certificate',
                    date: today.toISOString().split('T')[0],
                    time: '14:30',
                    reason: 'Medical clearance for requirements',
                    urgent: false,
                    status: 'Pending',
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                    patientName: userProfile.name,
                    patientId: userProfile.idNumber
                },
                {
                    id: '8',
                    service: 'Dental Check-up',
                    date: new Date(today.setDate(today.getDate() + 5)).toISOString().split('T')[0],
                    time: '11:00',
                    reason: 'Tooth pain',
                    urgent: true,
                    status: 'Approved',
                    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
                    patientName: userProfile.name,
                    patientId: userProfile.idNumber
                }
            ];
            
            appointments = sampleAppointments;
            saveData();
        }
    }

    /**
     * Simulate status updates (for demo)
     */
    function simulateStatusUpdates() {
        setInterval(() => {
            const pendingAppts = appointments.filter(a => a.status === 'Pending');
            if (pendingAppts.length > 0 && Math.random() > 0.7) {
                const randomAppt = pendingAppts[Math.floor(Math.random() * pendingAppts.length)];
                randomAppt.status = 'Approved';
                randomAppt.approvedAt = new Date().toISOString();
                saveData();
                
                updateDashboardStats();
                renderRecentAppointments();
                if (!document.getElementById('my-appt-section').classList.contains('d-none')) {
                    renderMyAppointments(getActiveFilter());
                }
                
                showToast(`Your appointment for ${randomAppt.service} has been approved!`, 'success');
            }
        }, 45000);
    }

    /**
     * Add profile picture upload functionality (placeholder)
     */
    function addProfilePictureUpload() {
        const avatar = document.querySelector('.profile-avatar-large');
        if (avatar) {
            avatar.style.cursor = 'pointer';
            avatar.addEventListener('click', () => {
                showToast('Profile picture upload coming soon!', 'info');
            });
        }
    }

    /**
     * Export profile data
     */
    function exportProfileData() {
        const profileData = {
            ...userProfile,
            appointments: appointments,
            emergencyRequests: emergencyRequests,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(profileData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `chmsu_profile_${userProfile.idNumber}_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        showToast('Profile data exported successfully!', 'success');
    }

    // ============= EVENT LISTENERS =============

    // Sidebar Toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    // Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showSection(this.getAttribute('data-section'));
        });
    });

    // Overview Buttons
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            showSection('my-appt-section');
        });
    }

    const overviewBookBtn = document.getElementById('overviewBookBtn');
    if (overviewBookBtn) {
        overviewBookBtn.addEventListener('click', () => {
            showSection('book-section');
        });
    }

    const overviewEmergencyBtn = document.getElementById('overviewEmergencyBtn');
    if (overviewEmergencyBtn) {
        overviewEmergencyBtn.addEventListener('click', () => {
            showSection('emergency-section');
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                showToast('Logged out successfully', 'info');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        });
    }

    // Cancel Booking
    const cancelBooking = document.getElementById('cancelBooking');
    if (cancelBooking) {
        cancelBooking.addEventListener('click', () => {
            if (confirm('Cancel booking? All entered data will be lost.')) {
                document.getElementById('appointmentForm').reset();
                showSection('overview-section');
            }
        });
    }

    // Appointment Form
    const apptForm = document.getElementById('appointmentForm');
    if (apptForm) {
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('appointmentDate');
        if (dateInput) dateInput.setAttribute('min', today);

        apptForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                service: document.getElementById('serviceType').value,
                date: document.getElementById('appointmentDate').value,
                time: document.getElementById('appointmentTime').value,
                reason: document.getElementById('reasonForVisit').value,
                urgent: document.getElementById('urgentCheck').checked
            };

            bookAppointment(formData);
            apptForm.reset();
        });
    }

    // Emergency Form
    const emergencyForm = document.getElementById('emergencyForm');
    if (emergencyForm) {
        emergencyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                patientName: document.getElementById('emergencyPatientName').value,
                contact: document.getElementById('emergencyContact').value,
                location: document.getElementById('emergencyLocation').value,
                type: document.getElementById('emergencyType').value,
                symptoms: document.getElementById('emergencySymptoms').value
            };

            submitEmergencyRequest(formData);
        });
    }

    // Filter Tabs
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            renderMyAppointments(this.getAttribute('data-filter'));
        });
    });

    // Profile Trigger - shows the profile modal (not edit)
    const profileTrigger = document.querySelector('.profile-trigger');
    if (profileTrigger) {
        profileTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            // The Bootstrap modal will show automatically due to data-bs-toggle="modal"
            // No need to do anything here
        });
    }

    // EDIT PROFILE BUTTON - this opens the edit modal when clicked
    const editProfileBtn = document.querySelector('.btn-edit-profile');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            openProfileEditModal();
        });
    }

    // Keyboard shortcut for export (Ctrl+E)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            exportProfileData();
        }
    });

    // ============= INITIALIZATION =============
    function init() {
        addSampleData();
        initUserProfile();
        updateDashboardStats();
        renderRecentAppointments();
        renderMyAppointments('ALL');
        renderEmergencyRequests();
        renderMedicalRecords(); // This will now show complete medical history
        addProfilePictureUpload();
        simulateStatusUpdates();
    }

    init();
});