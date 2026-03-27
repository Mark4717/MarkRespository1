document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebarToggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section');
    const pageTitle = document.getElementById('pageTitle');
    const statusFilter = document.getElementById('statusFilter');
    const appointmentTableBody = document.getElementById('appointmentTableBody');

    const patientList = document.getElementById('patientList');
    const noSelectedPlaceholder = document.getElementById('noPatientSelected');
    const detailsPanel = document.getElementById('patientDetailsPanel');
    const patientSearch = document.getElementById('patientSearch');

    const newRecordToggleBtn = document.getElementById('newRecordToggleBtn');
    const newRecordForm = document.getElementById('newRecordForm');
    const cancelRecordBtn = document.getElementById('cancelRecordBtn');
    const saveRecordBtn = document.getElementById('saveRecordBtn');
    const medicalRecordsList = document.getElementById('medicalRecordsList');
    const recordPatientName = document.getElementById('recordPatientName');
    const recordVisitType = document.getElementById('recordVisitType');
    const recordDiagnosis = document.getElementById('recordDiagnosis');
    const recordPrescription = document.getElementById('recordPrescription');
    const recordNotes = document.getElementById('recordNotes');
    
    const modalElement = document.getElementById('recordDetailModal');
    let modal = null;
    if (modalElement) {
        modal = new bootstrap.Modal(modalElement);
    }
    
    const editRecordModal = document.getElementById('editRecordModal');
    const editRecordId = document.getElementById('editRecordId');
    const editPatientName = document.getElementById('editPatientName');
    const editVisitType = document.getElementById('editVisitType');
    const editDiagnosis = document.getElementById('editDiagnosis');
    const editPrescription = document.getElementById('editPrescription');
    const editNotes = document.getElementById('editNotes');
    const closeEditModalBtn = document.getElementById('closeEditModalBtn');
    const cancelEditModalBtn = document.getElementById('cancelEditModalBtn');
    const saveEditRecordBtn = document.getElementById('saveEditRecordBtn');
    let editModal = null;
    
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
        if (!isLoggedIn || isLoggedIn !== 'true') {
            // Redirect to signin page if not logged in
            window.location.href = "signin_admin.html";
        }
    if (editRecordModal) {
        editModal = new bootstrap.Modal(editRecordModal);
    }
    
    let appointments = [];
    
    function loadAppointments() {
        const savedAppointments = localStorage.getItem('clinicAppointments');
        if (savedAppointments) {
            try {
                appointments = JSON.parse(savedAppointments);
            } catch (e) {
                appointments = [];
            }
        } else {
            appointments = [];
        }
        renderAppointments();
    }
    
    function saveAppointments() {
        localStorage.setItem('clinicAppointments', JSON.stringify(appointments));
    }
    
    function renderAppointments() {
        if (!appointmentTableBody) return;
        
        if (appointments.length === 0) {
            appointmentTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-5">
                        <i class="bi bi-calendar-x fs-1 text-dark opacity-50 mb-3 d-block"></i>
                        <h6 class="fw-bold text-dark">No appointments scheduled</h6>
                        <p class="small text-dark opacity-75">Create appointments from the system</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        appointmentTableBody.innerHTML = appointments.map(appointment => `
            <tr data-status="${appointment.status}" data-appointment-id="${appointment.id}">
                <td class="fw-bold text-dark">${escapeHtml(appointment.patientName)}</td>
                <td>${escapeHtml(appointment.service)}</td>
                <td>${appointment.date}<br><small class="text-muted">${appointment.time}</small></td>
                <td><span class="badge-status ${appointment.status}">${appointment.status.toUpperCase()}</span></td>
                <td>
                    ${getActionButtons(appointment)}
                </td>
            </tr>
        `).join('');
        
        document.querySelectorAll('#appointmentTableBody .approve, #appointmentTableBody .reject, #appointmentTableBody .btn-action-text').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const row = btn.closest('tr');
                const appointmentId = row.getAttribute('data-appointment-id');
                const appointment = appointments.find(a => a.id === appointmentId);
                if (appointment) {
                    if (btn.classList.contains('approve')) {
                        updateAppointmentStatus(appointmentId, 'approved');
                    } else if (btn.classList.contains('reject')) {
                        updateAppointmentStatus(appointmentId, 'cancelled');
                    } else if (btn.classList.contains('btn-action-text')) {
                        updateAppointmentStatus(appointmentId, 'completed');
                    }
                }
            });
        });
    }
    
    function getActionButtons(appointment) {
        if (appointment.status === 'pending') {
            return `
                <div class="action-wrapper">
                    <button class="btn-action approve" title="Approve"><i class="bi bi-check-lg"></i></button>
                    <button class="btn-action reject" title="Reject"><i class="bi bi-x-lg"></i></button>
                </div>
            `;
        } else if (appointment.status === 'approved') {
            return `
                <div class="action-wrapper">
                    <button class="btn btn-sm btn-action-text">MARK COMPLETE</button>
                </div>
            `;
        } else {
            return `<span class="text-muted small italic">No Action</span>`;
        }
    }
    
    function updateAppointmentStatus(appointmentId, newStatus) {
        const index = appointments.findIndex(a => a.id === appointmentId);
        if (index !== -1) {
            appointments[index].status = newStatus;
            saveAppointments();
            renderAppointments();
            
            if (statusFilter && statusFilter.value !== 'all') {
                filterAppointments();
            }
        }
    }
    
    function filterAppointments() {
        if (!statusFilter || !appointmentTableBody) return;
        
        const filterValue = statusFilter.value;
        const rows = appointmentTableBody.querySelectorAll('tr');
        
        rows.forEach(row => {
            if (filterValue === 'all') {
                row.style.display = '';
            } else {
                const status = row.getAttribute('data-status');
                row.style.display = status === filterValue ? '' : 'none';
            }
        });
    }
    
    let patientData = {};
    
    function loadPatients() {
        const savedPatients = localStorage.getItem('clinicPatients');
        if (savedPatients) {
            try {
                patientData = JSON.parse(savedPatients);
            } catch (e) {
                patientData = {};
            }
        } else {
            patientData = {};
        }
        renderPatientList();
    }
    
    function savePatients() {
        localStorage.setItem('clinicPatients', JSON.stringify(patientData));
    }
    
    function renderPatientList() {
        if (!patientList) return;
        
        const patientsArray = Object.entries(patientData);
        
        if (patientsArray.length === 0) {
            patientList.innerHTML = `
                <div class="text-center p-5" style="background-color: #abc9d8; border-radius: 25px;">
                    <i class="bi bi-person-plus fs-1 text-dark opacity-50 mb-3 d-block"></i>
                    <h6 class="fw-bold text-dark">No patients registered</h6>
                    <p class="small text-dark opacity-75">Add patients from medical records section</p>
                </div>
            `;
            return;
        }
        
        patientList.innerHTML = patientsArray.map(([id, data]) => `
            <div class="patient-card" data-patient-id="${id}">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="fw-bold mb-0">${escapeHtml(data.name)}</h6>
                    <span class="patient-number">${id.toUpperCase()}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="patient-type">${escapeHtml(data.type || 'PATIENT')}</span>
                    <span class="patient-date"><i class="bi bi-calendar3 me-1"></i>${data.lastVisit || 'No visits'}</span>
                </div>
                <div class="mt-2">
                    <span class="patient-service"><i class="bi bi-stethoscope me-1"></i>${data.lastService || 'No records'}</span>
                </div>
            </div>
        `).join('');
        
        document.querySelectorAll('.patient-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const clickedCard = e.currentTarget;
                if (noSelectedPlaceholder) noSelectedPlaceholder.classList.add('d-none');
                if (detailsPanel) detailsPanel.classList.remove('d-none');
                document.querySelectorAll('.patient-card').forEach(c => c.classList.remove('active-card'));
                clickedCard.classList.add('active-card');
                const patientId = clickedCard.getAttribute('data-patient-id');
                const data = patientData[patientId];
                if (data) {
                    const detailName = document.getElementById('detailPatientName');
                    const detailType = document.getElementById('detailUserType');
                    const detailEmail = document.getElementById('detailEmail');
                    const detailVisits = document.getElementById('detailTotalVisits');
                    const detailLast = document.getElementById('detailLastVisit');
                    const detailHistory = document.getElementById('detailMedicalHistory');
                    
                    if (detailName) detailName.textContent = data.name;
                    if (detailType) detailType.textContent = data.type || 'PATIENT';
                    if (detailEmail) detailEmail.textContent = data.email || 'No email provided';
                    if (detailVisits) detailVisits.textContent = data.totalVisits || 0;
                    if (detailLast) detailLast.textContent = data.lastVisit || 'No visits';
                    if (detailHistory) detailHistory.innerHTML = data.medicalHistory || '<p class="mb-0">No medical history available.</p>';
                }
            });
        });
    }
    
    function updatePatientMedicalHistory(patientId, oldRecord, newRecord) {
        const patient = patientData[patientId];
        if (!patient) return;
        
        const oldRecordText = `• ${oldRecord.service} (${oldRecord.date}): ${oldRecord.diagnosis}`;
        patient.medicalHistory = patient.medicalHistory.replace(oldRecordText, '');
        
        const newRecordText = `<p class='mb-2'>• ${newRecord.service} (${newRecord.date}): ${newRecord.diagnosis}</p>`;
        patient.medicalHistory = (patient.medicalHistory || '') + newRecordText;
        
        patient.medicalHistory = patient.medicalHistory.replace(/\n\s*\n/g, '\n');
        
        savePatients();
        renderPatientList();
    }
    
    let medicalRecords = [];
    
    function loadMedicalRecords() {
        const savedRecords = localStorage.getItem('medicalRecords');
        if (savedRecords) {
            try {
                medicalRecords = JSON.parse(savedRecords);
            } catch (e) {
                medicalRecords = [];
            }
        } else {
            medicalRecords = [];
        }
        renderMedicalRecords();
    }
    
    function saveMedicalRecords() {
        localStorage.setItem('medicalRecords', JSON.stringify(medicalRecords));
    }
    
    function addOrUpdatePatient(patientName, patientId, visitType, date, isUpdate = false, oldRecord = null) {
        const id = patientId.toLowerCase();
        const existingPatient = patientData[id];
        
        if (existingPatient) {
            if (!isUpdate) {
                existingPatient.totalVisits = (existingPatient.totalVisits || 0) + 1;
                existingPatient.lastVisit = date;
                existingPatient.lastService = visitType;
                existingPatient.medicalHistory = (existingPatient.medicalHistory || '') + 
                    `<p class='mb-2'>• ${visitType} (${date}): New medical record added</p>`;
            }
        } else {
            patientData[id] = {
                name: patientName,
                type: 'PATIENT',
                email: `${patientName.toLowerCase().replace(/\s/g, '.')}@chmsu.edu.ph`,
                totalVisits: 1,
                lastVisit: date,
                lastService: visitType,
                medicalHistory: `<p class='mb-2'>• ${visitType} (${date}): First medical record</p>`
            };
        }
        
        savePatients();
        renderPatientList();
    }

    // ========== REPORT DATA ==========
    let serviceReportData = {
        'Consultation': 0,
        'Medical Certificate': 0,
        'General Checkup': 0,
        'Emergency Care': 0,
        'Dental': 0,
        'Follow up visit': 0
    };
    
    let monthlyTrends = {
        'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0, 'Jun': 0,
        'Jul': 0, 'Aug': 0, 'Sep': 0, 'Oct': 0, 'Nov': 0, 'Dec': 0
    };
    
    let currentReportType = 'service';
    
    function updateReportData() {
        const resetData = {
            'Consultation': 0,
            'Medical Certificate': 0,
            'General Checkup': 0,
            'Emergency Care': 0,
            'Dental': 0,
            'Follow up visit': 0
        };
        
        const resetMonthly = {
            'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0, 'Jun': 0,
            'Jul': 0, 'Aug': 0, 'Sep': 0, 'Oct': 0, 'Nov': 0, 'Dec': 0
        };
        
        medicalRecords.forEach(record => {
            if (resetData[record.service] !== undefined) {
                resetData[record.service]++;
            } else {
                resetData[record.service] = (resetData[record.service] || 0) + 1;
            }
            
            if (record.date) {
                const dateParts = record.date.split(' ');
                const monthAbbr = dateParts[0];
                if (resetMonthly[monthAbbr] !== undefined) {
                    resetMonthly[monthAbbr]++;
                }
            }
        });
        
        serviceReportData = resetData;
        monthlyTrends = resetMonthly;
    }
    
    function updateDashboardStats() {
        const totalAppointments = appointments.length;
        const pendingRequests = appointments.filter(a => a.status === 'pending').length;
        const approved = appointments.filter(a => a.status === 'approved').length;
        const cancelled = appointments.filter(a => a.status === 'cancelled').length;
        const todaySchedule = appointments.filter(a => {
            const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            return a.date === today && (a.status === 'pending' || a.status === 'approved');
        }).length;
        
        const statTotal = document.getElementById('statTotalAppointments');
        const statPending = document.getElementById('statPendingRequests');
        const statApproved = document.getElementById('statApproved');
        const statCancelled = document.getElementById('statCancelled');
        const statToday = document.getElementById('statTodaySchedule');
        
        if (statTotal) statTotal.textContent = totalAppointments;
        if (statPending) statPending.textContent = pendingRequests;
        if (statApproved) statApproved.textContent = approved;
        if (statCancelled) statCancelled.textContent = cancelled;
        if (statToday) statToday.textContent = todaySchedule;
    }
    
    function renderHorizontalBarChart(data, title) {
        const container = document.getElementById('horizontalBarChartContainer');
        const chartTitle = document.getElementById('chartTitle');
        if (!container) return;
        
        if (chartTitle) chartTitle.textContent = title;
        
        const nonZeroEntries = Object.entries(data).filter(([_, value]) => value > 0);
        
        if (nonZeroEntries.length === 0) {
            container.innerHTML = '<div class="text-center p-5"><i class="bi bi-bar-chart-line fs-1 text-dark opacity-50 mb-3 d-block"></i><p class="text-dark">No data available. Add medical records to see statistics.</p></div>';
            return;
        }
        
        const maxValue = Math.max(...nonZeroEntries.map(([_, value]) => value));
        const sortedEntries = nonZeroEntries.sort((a, b) => b[1] - a[1]);
        
        let html = '';
        for (const [service, count] of sortedEntries) {
            const percentage = maxValue > 0 ? (count / maxValue) * 100 : 0;
            html += `
                <div class="horizontal-bar-item">
                    <div class="bar-label">
                        <span>${service.toUpperCase()}</span>
                        <span>${count} visits</span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${percentage}%;">
                            ${percentage > 15 ? Math.round(percentage) + '%' : ''}
                        </div>
                    </div>
                </div>
            `;
        }
        container.innerHTML = html;
    }
    
    function updateServiceBreakdown(data) {
        const breakdownContainer = document.getElementById('serviceBreakdownList');
        if (!breakdownContainer) return;
        
        const nonZeroEntries = Object.entries(data).filter(([_, value]) => value > 0);
        
        if (nonZeroEntries.length === 0) {
            breakdownContainer.innerHTML = '<div class="col-12 text-center p-4"><p class="text-dark opacity-75 mb-0">No service data available</p></div>';
            return;
        }
        
        const sortedEntries = nonZeroEntries.sort((a, b) => b[1] - a[1]);
        let html = '';
        sortedEntries.forEach(([service, count]) => {
            html += `
                <div class="col-md-4 col-sm-6">
                    <div class="breakdown-item d-flex justify-content-between align-items-center">
                        <span class="breakdown-service">${service}</span>
                        <span class="breakdown-count">${count}</span>
                    </div>
                </div>
            `;
        });
        breakdownContainer.innerHTML = html;
    }
    
    function updateReportStats() {
        const totalAppointments = Object.values(serviceReportData).reduce((a, b) => a + b, 0);
        const totalPatients = Object.keys(patientData).length;
        const completionRate = totalAppointments > 0 ? 100 : 0;
        
        const reportTotal = document.getElementById('reportTotalAppointments');
        const reportPatients = document.getElementById('reportTotalPatients');
        const reportRate = document.getElementById('reportCompletionRate');
        
        if (reportTotal) reportTotal.textContent = totalAppointments;
        if (reportPatients) reportPatients.textContent = totalPatients;
        if (reportRate) reportRate.textContent = completionRate + '%';
    }
    
    function loadReports(reportType) {
        updateReportData();
        updateReportStats();
        currentReportType = reportType;
        if (reportType === 'service') {
            renderHorizontalBarChart(serviceReportData, 'Service Distribution (Number of Visits)');
            updateServiceBreakdown(serviceReportData);
        } else if (reportType === 'monthly') {
            renderHorizontalBarChart(monthlyTrends, 'Monthly Patient Trends');
            updateServiceBreakdown(monthlyTrends);
        }
    }
    
    async function exportToPDF() {
        const reportContainer = document.querySelector('.reports-container');
        if (!reportContainer) return;
        
        const cloneContainer = reportContainer.cloneNode(true);
        cloneContainer.style.padding = '20px';
        cloneContainer.style.backgroundColor = 'white';
        cloneContainer.style.width = '100%';
        
        const headerDiv = document.createElement('div');
        headerDiv.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #1a4d6b; padding-bottom: 10px;">
                <h1 style="color: #1a4d6b; margin: 0;">CHMSU Clinic</h1>
                <h3 style="color: #0086bf;">Admin Report</h3>
                <p>Generated on: ${new Date().toLocaleString()}</p>
            </div>
        `;
        cloneContainer.insertBefore(headerDiv, cloneContainer.firstChild);
        
        const tempDiv = document.createElement('div');
        tempDiv.appendChild(cloneContainer);
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '0';
        document.body.appendChild(tempDiv);
        
        try {
            const opt = {
                margin: [0.5, 0.5, 0.5, 0.5],
                filename: `CHMSU_Report_${new Date().toISOString().slice(0, 19)}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, letterRendering: true },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            };
            await html2pdf().set(opt).from(tempDiv).save();
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('Error generating PDF. Please try again.');
        } finally {
            document.body.removeChild(tempDiv);
        }
    }
    
    function exportToExcel() {
        let data = [];
        
        if (currentReportType === 'service') {
            data = [['Service Type', 'Number of Visits']];
            Object.entries(serviceReportData).forEach(([service, count]) => {
                data.push([service, count]);
            });
            data.push([], ['Summary', '']);
            const total = Object.values(serviceReportData).reduce((a, b) => a + b, 0);
            data.push(['Total Appointments', total]);
            data.push(['Total Patients', Object.keys(patientData).length]);
            data.push(['Report Generated', new Date().toLocaleString()]);
        } else {
            data = [['Month', 'Number of Visits']];
            Object.entries(monthlyTrends).forEach(([month, count]) => {
                data.push([month, count]);
            });
            data.push([], ['Summary', '']);
            const total = Object.values(monthlyTrends).reduce((a, b) => a + b, 0);
            data.push(['Total Visits (Selected Period)', total]);
            data.push(['Report Generated', new Date().toLocaleString()]);
        }
        
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'CHMSU_Report');
        ws['!cols'] = [{wch: 25}, {wch: 15}];
        XLSX.writeFile(wb, `CHMSU_Report_${new Date().toISOString().slice(0, 19)}.xlsx`);
    }
    
    function updateStats() {
        const total = medicalRecords.length;
        const currentMonth = new Date().toLocaleString('en-US', { month: 'short' });
        const thisMonthCount = medicalRecords.filter(r => r.date && r.date.includes(currentMonth)).length;
        const frequent = Math.min(5, Math.floor(total * 0.6));
        
        const totalRecords = document.getElementById('totalRecordsCount');
        const thisMonth = document.getElementById('thisMonthCount');
        const frequentVisits = document.getElementById('frequentVisitsCount');
        
        if (totalRecords) totalRecords.innerText = total;
        if (thisMonth) thisMonth.innerText = thisMonthCount;
        if (frequentVisits) frequentVisits.innerText = frequent;
    }

    function renderMedicalRecords() {
        if (!medicalRecordsList) return;
        
        if (medicalRecords.length === 0) {
            medicalRecordsList.innerHTML = `
                <div class="col-12 text-center p-5">
                    <i class="bi bi-file-earmark-medical fs-1 text-dark opacity-50 mb-3 d-block"></i>
                    <h6 class="fw-bold text-dark">No medical records yet</h6>
                    <p class="small text-dark opacity-75">Click "NEW RECORD" to create your first medical record</p>
                </div>
            `;
            updateStats();
            return;
        }
        
        medicalRecordsList.innerHTML = '';
        medicalRecords.forEach(record => {
            const card = document.createElement('div');
            card.className = 'record-card';
            card.setAttribute('data-record-id', record.id);
            card.innerHTML = `
                <div class="record-card-header">
                    <span class="record-name">${escapeHtml(record.patientName)}</span>
                    <span class="record-number">${record.patientNumber}</span>
                </div>
                <div class="record-detail-line"><i class="bi bi-calendar3"></i> ${record.date}</div>
                <div class="record-detail-line"><span class="record-service">${record.service}</span></div>
                <div class="mt-2 small text-dark"><i class="bi bi-chat"></i> ${record.diagnosis.substring(0, 35)}${record.diagnosis.length > 35 ? '...' : ''}</div>
                <div class="record-actions mt-3 d-flex gap-2 justify-content-end">
                    <button class="btn-edit-record btn-sm" data-id="${record.id}" style="background: #0086bf; color: white; border: none; border-radius: 20px; padding: 4px 12px;">
                        <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="btn-delete-record btn-sm" data-id="${record.id}" style="background: #b8485c; color: white; border: none; border-radius: 20px; padding: 4px 12px;">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </div>
            `;
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.btn-edit-record') && !e.target.closest('.btn-delete-record')) {
                    openRecordDetailModal(record);
                }
            });
            medicalRecordsList.appendChild(card);
        });
        
        document.querySelectorAll('.btn-edit-record').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const recordId = btn.getAttribute('data-id');
                openEditRecordModal(recordId);
            });
        });
        
        document.querySelectorAll('.btn-delete-record').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const recordId = btn.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this medical record? This action cannot be undone.')) {
                    deleteMedicalRecord(recordId);
                }
            });
        });
        
        updateStats();
    }
    
    function openEditRecordModal(recordId) {
        const record = medicalRecords.find(r => r.id === recordId);
        if (!record) return;
        
        if (editRecordId) editRecordId.value = record.id;
        if (editPatientName) editPatientName.value = record.patientName;
        if (editVisitType) editVisitType.value = record.service;
        if (editDiagnosis) editDiagnosis.value = record.diagnosis;
        if (editPrescription) editPrescription.value = record.prescription;
        if (editNotes) editNotes.value = record.notes;
        
        if (editModal) editModal.show();
    }
    
    function saveEditedRecord() {
        const recordId = editRecordId ? editRecordId.value : null;
        if (!recordId) return;
        
        const index = medicalRecords.findIndex(r => r.id === recordId);
        if (index === -1) return;
        
        const oldRecord = { ...medicalRecords[index] };
        
        const newPatientName = editPatientName ? editPatientName.value.trim().toUpperCase() : '';
        const newVisitType = editVisitType ? editVisitType.value : '';
        const newDiagnosis = editDiagnosis ? editDiagnosis.value.trim() || 'No diagnosis' : 'No diagnosis';
        const newPrescription = editPrescription ? editPrescription.value.trim() || 'No prescription' : 'No prescription';
        const newNotes = editNotes ? editNotes.value.trim() || 'No additional notes' : 'No additional notes';
        
        if (!newPatientName) {
            alert('Patient name is required!');
            return;
        }
        
        medicalRecords[index] = {
            ...medicalRecords[index],
            patientName: newPatientName,
            service: newVisitType,
            diagnosis: newDiagnosis,
            prescription: newPrescription,
            notes: newNotes
        };
        
        saveMedicalRecords();
        
        if (oldRecord.patientName !== newPatientName) {
            const oldPatientId = oldRecord.patientId;
            const newPatientId = 'p' + Date.now();
            medicalRecords[index].patientId = newPatientId;
            medicalRecords[index].patientNumber = newPatientId.toUpperCase();
            
            addOrUpdatePatient(newPatientName, newPatientId, newVisitType, oldRecord.date, false);
        }
        
        updateReportData();
        
        renderMedicalRecords();
        
        if (editModal) editModal.hide();
        alert('Medical record updated successfully!');
        
        const reportsSection = document.getElementById('section-reports');
        if (reportsSection && !reportsSection.classList.contains('d-none')) {
            loadReports(currentReportType);
        }
        
        updateDashboardStats();
    }
    
    function deleteMedicalRecord(recordId) {
        const record = medicalRecords.find(r => r.id === recordId);
        if (!record) return;
        
        medicalRecords = medicalRecords.filter(r => r.id !== recordId);
        saveMedicalRecords();
        
        const patientId = record.patientId.toLowerCase();
        const patientRecords = medicalRecords.filter(r => r.patientId === patientId);
        
        if (patientRecords.length === 0) {
            delete patientData[patientId];
        } else {
            const latestRecord = patientRecords.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
            patientData[patientId].totalVisits = patientRecords.length;
            patientData[patientId].lastVisit = latestRecord.date;
            patientData[patientId].lastService = latestRecord.service;
            
            const recordText = `• ${record.service} (${record.date}): ${record.diagnosis}`;
            patientData[patientId].medicalHistory = patientData[patientId].medicalHistory.replace(recordText, '');
            patientData[patientId].medicalHistory = patientData[patientId].medicalHistory.replace(/<p class='mb-2'>\s*<\/p>/g, '');
        }
        
        savePatients();
        
        updateReportData();
        
        renderMedicalRecords();
        renderPatientList();
        
        alert('Medical record deleted successfully!');
        
        const reportsSection = document.getElementById('section-reports');
        if (reportsSection && !reportsSection.classList.contains('d-none')) {
            loadReports(currentReportType);
        }
        
        updateDashboardStats();
    }
    
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function openRecordDetailModal(record) {
        const modalName = document.getElementById('modalRecordName');
        const modalNumber = document.getElementById('modalRecordNumber');
        const modalDate = document.getElementById('modalRecordDate');
        const modalType = document.getElementById('modalRecordType');
        const modalDiagnosis = document.getElementById('modalRecordDiagnosis');
        const modalPrescription = document.getElementById('modalRecordPrescription');
        const modalNotes = document.getElementById('modalRecordNotes');
        
        if (modalName) modalName.innerText = record.patientName;
        if (modalNumber) modalNumber.innerText = record.patientNumber;
        if (modalDate) modalDate.innerText = record.date;
        if (modalType) modalType.innerText = record.service;
        if (modalDiagnosis) modalDiagnosis.innerText = record.diagnosis;
        if (modalPrescription) modalPrescription.innerText = record.prescription;
        if (modalNotes) modalNotes.innerText = record.notes;
        
        if (modal) modal.show();
    }

    if (saveRecordBtn) {
        saveRecordBtn.addEventListener('click', () => {
            if (!recordPatientName || !recordVisitType) return;
            
            const patientName = recordPatientName.value.trim().toUpperCase();
            const patientId = 'p' + Date.now();
            const pNumber = patientId.toUpperCase();

            if (!patientName) {
                alert("Please enter a patient name.");
                return;
            }
            const visitType = recordVisitType.value;
            const diagnosis = recordDiagnosis ? (recordDiagnosis.value.trim() || 'No diagnosis') : 'No diagnosis';
            const prescription = recordPrescription ? (recordPrescription.value.trim() || 'No prescription') : 'No prescription';
            const notes = recordNotes ? (recordNotes.value.trim() || 'No additional notes') : 'No additional notes';
            const today = new Date();
            const formattedDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            
            const newRecord = {
                id: 'r' + Date.now(),
                patientId: patientId,
                patientName: patientName,
                patientNumber: pNumber,
                date: formattedDate,
                service: visitType,
                diagnosis: diagnosis,
                prescription: prescription,
                notes: notes
            };
            medicalRecords.push(newRecord);
            saveMedicalRecords();
            
            addOrUpdatePatient(patientName, patientId, visitType, formattedDate, false);
            
            updateReportData();
            
            renderMedicalRecords();
            if (newRecordForm) newRecordForm.classList.add('d-none');
            if (recordDiagnosis) recordDiagnosis.value = '';
            if (recordPrescription) recordPrescription.value = '';
            if (recordNotes) recordNotes.value = '';
            if (recordPatientName) recordPatientName.value = '';
            alert('Medical record saved successfully!');
            
            updateDashboardStats();
            
            const reportsSection = document.getElementById('section-reports');
            if (reportsSection && !reportsSection.classList.contains('d-none')) {
                loadReports(currentReportType);
            }
        });
    }

    if (cancelRecordBtn) {
        cancelRecordBtn.addEventListener('click', () => {
            if (newRecordForm) newRecordForm.classList.add('d-none');
            if (recordDiagnosis) recordDiagnosis.value = '';
            if (recordPrescription) recordPrescription.value = '';
            if (recordNotes) recordNotes.value = '';
            if (recordPatientName) recordPatientName.value = '';
        });
    }

    if (newRecordToggleBtn) {
        newRecordToggleBtn.addEventListener('click', () => {
            if (newRecordForm) {
                newRecordForm.classList.toggle('d-none');
                if (!newRecordForm.classList.contains('d-none')) newRecordForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }
    
    if (closeEditModalBtn) {
        closeEditModalBtn.addEventListener('click', () => {
            if (editModal) editModal.hide();
        });
    }
    
    if (cancelEditModalBtn) {
        cancelEditModalBtn.addEventListener('click', () => {
            if (editModal) editModal.hide();
        });
    }
    
    if (saveEditRecordBtn) {
        saveEditRecordBtn.addEventListener('click', saveEditedRecord);
    }
    
    if (patientSearch) {
        patientSearch.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.patient-card').forEach(card => {
                const nameElem = card.querySelector('h6');
                const typeElem = card.querySelector('.patient-type');
                const name = nameElem ? nameElem.textContent.toLowerCase() : '';
                const type = typeElem ? typeElem.textContent.toLowerCase() : '';
                card.style.display = (name.includes(term) || type.includes(term)) ? 'block' : 'none';
            });
        });
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', filterAppointments);
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (sidebar) {
                sidebar.classList.toggle('collapsed');
                setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const target = link.getAttribute('data-section');
            sections.forEach(section => {
                section.classList.add('d-none');
                if (section.id === `section-${target}`) {
                    section.classList.remove('d-none');
                    if (target === 'medical-records') {
                        if (newRecordForm) newRecordForm.classList.add('d-none');
                        renderMedicalRecords();
                    }
                    if (target === 'reports') {
                        loadReports(currentReportType);
                    }
                    if (target === 'patients') {
                        renderPatientList();
                    }
                    if (target === 'appointment') {
                        renderAppointments();
                        if (statusFilter) filterAppointments();
                    }
                }
            });
            const span = link.querySelector('span');
            if (pageTitle && span) pageTitle.textContent = span.textContent;
        });
    });

    const applyFilterBtn = document.getElementById('applyReportFilter');
    const reportTypeSelect = document.getElementById('reportTypeSelect');
    const exportPDFBtn = document.getElementById('exportPDF');
    const exportExcelBtn = document.getElementById('exportExcel');
    
    if (applyFilterBtn && reportTypeSelect) {
        applyFilterBtn.addEventListener('click', () => {
            const selectedType = reportTypeSelect.value;
            loadReports(selectedType);
        });
    }
    
    if (exportPDFBtn) {
        exportPDFBtn.addEventListener('click', exportToPDF);
    }
    
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', exportToExcel);
    }

    // Dashboard Charts
    const commonOpt = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } };
    
    const barChartCanvas = document.getElementById('barChart');
    if (barChartCanvas) {
        new Chart(barChartCanvas, { 
            type: 'bar', 
            data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], datasets: [{ data: [0, 0, 0, 0, 0], backgroundColor: '#1a4d6b', borderRadius: 8 }] }, 
            options: commonOpt 
        });
    }
    
    const lineChartCanvas = document.getElementById('lineChart');
    if (lineChartCanvas) {
        new Chart(lineChartCanvas, { 
            type: 'line', 
            data: { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], datasets: [{ data: [0, 0, 0, 0], borderColor: '#2d6a71', tension: 0.3, fill: true, backgroundColor: 'rgba(45,106,113,0.1)' }] }, 
            options: commonOpt 
        });
    }
    
    const pieChartCanvas = document.getElementById('pieChart');
    if (pieChartCanvas) {
        new Chart(pieChartCanvas, { 
            type: 'pie', 
            data: { labels: ['No Data'], datasets: [{ data: [1], backgroundColor: ['#e9ecef'] }] }, 
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } } 
        });
    }

    // ========== SYSTEM SECTION ==========
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    
    function loadSchedule() {
        const saved = localStorage.getItem('clinicSchedule');
        if (saved) {
            try {
                const schedule = JSON.parse(saved);
                days.forEach(day => {
                    const dayData = schedule[day];
                    if (dayData) {
                        const startInput = document.getElementById(`${day}-start`);
                        const endInput = document.getElementById(`${day}-end`);
                        if (startInput && dayData.start) startInput.value = dayData.start;
                        if (endInput && dayData.end) endInput.value = dayData.end;
                        
                        const toggleBtn = document.querySelector(`.status-toggle[data-day="${day}"]`);
                        if (toggleBtn) {
                            if (dayData.active) {
                                toggleBtn.classList.remove('inactive');
                                toggleBtn.classList.add('active');
                                toggleBtn.innerHTML = '<i class="bi bi-power"></i><span>ACTIVE</span>';
                                if (startInput) startInput.disabled = false;
                                if (endInput) endInput.disabled = false;
                                const scheduleItem = document.getElementById(`schedule-${day}`);
                                if (scheduleItem) scheduleItem.classList.remove('closed');
                            } else {
                                toggleBtn.classList.remove('active');
                                toggleBtn.classList.add('inactive');
                                toggleBtn.innerHTML = '<i class="bi bi-power"></i><span>INACTIVE</span>';
                                if (startInput) startInput.disabled = true;
                                if (endInput) endInput.disabled = true;
                                const scheduleItem = document.getElementById(`schedule-${day}`);
                                if (scheduleItem) scheduleItem.classList.add('closed');
                            }
                        }
                    }
                });
            } catch (e) {
                console.error('Error loading schedule:', e);
            }
        }
    }
    
    function saveSchedule() {
        const schedule = {};
        days.forEach(day => {
            const toggleBtn = document.querySelector(`.status-toggle[data-day="${day}"]`);
            const isActive = toggleBtn && toggleBtn.classList.contains('active');
            const startInput = document.getElementById(`${day}-start`);
            const endInput = document.getElementById(`${day}-end`);
            
            schedule[day] = {
                active: isActive,
                start: startInput ? startInput.value : '07:30',
                end: endInput ? endInput.value : '17:00'
            };
        });
        
        localStorage.setItem('clinicSchedule', JSON.stringify(schedule));
        alert('Clinic schedule saved successfully!');
    }
    
    function setupScheduleToggles() {
        document.querySelectorAll('.status-toggle').forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const day = this.getAttribute('data-day');
                const isActive = this.classList.contains('active');
                const startInput = document.getElementById(`${day}-start`);
                const endInput = document.getElementById(`${day}-end`);
                const scheduleItem = document.getElementById(`schedule-${day}`);
                
                if (isActive) {
                    this.classList.remove('active');
                    this.classList.add('inactive');
                    this.innerHTML = '<i class="bi bi-power"></i><span>INACTIVE</span>';
                    if (startInput) startInput.disabled = true;
                    if (endInput) endInput.disabled = true;
                    if (scheduleItem) scheduleItem.classList.add('closed');
                } else {
                    this.classList.remove('inactive');
                    this.classList.add('active');
                    this.innerHTML = '<i class="bi bi-power"></i><span>ACTIVE</span>';
                    if (startInput) startInput.disabled = false;
                    if (endInput) endInput.disabled = false;
                    if (scheduleItem) scheduleItem.classList.remove('closed');
                }
            });
        });
    }
    
    const saveScheduleBtn = document.getElementById('saveScheduleBtn');
    if (saveScheduleBtn) {
        saveScheduleBtn.addEventListener('click', saveSchedule);
    }
    
    // ==================== SERVICES ====================
    let services = [];
    let currentEditId = null;
    
    const editServiceModal = document.getElementById('editServiceModal');
    const editServiceNameInput = document.getElementById('editServiceNameInput');
    const editServiceDescInput = document.getElementById('editServiceDescInput');
    const editServiceStatusSelect = document.getElementById('editServiceStatusSelect');
    const closeServiceModalBtn = document.getElementById('closeServiceModalBtn');
    const cancelServiceModalBtn = document.getElementById('cancelServiceModalBtn');
    const saveServiceEditBtn = document.getElementById('saveServiceEditBtn');
    
    function loadServices() {
        const saved = localStorage.getItem('clinicServices');
        if (saved) {
            try {
                services = JSON.parse(saved);
            } catch (e) {
                services = [];
            }
        } else {
            services = [];
        }
        renderServices();
    }
    
    function openEditServiceModal(serviceId) {
        const service = services.find(s => s.id === serviceId);
        if (!service) return;
        
        currentEditId = serviceId;
        if (editServiceNameInput) editServiceNameInput.value = service.name;
        if (editServiceDescInput) editServiceDescInput.value = service.description || '';
        if (editServiceStatusSelect) editServiceStatusSelect.value = service.active ? 'active' : 'inactive';
        
        if (editServiceModal) editServiceModal.classList.add('active');
    }
    
    function closeEditServiceModal() {
        if (editServiceModal) editServiceModal.classList.remove('active');
        currentEditId = null;
        if (editServiceNameInput) editServiceNameInput.value = '';
        if (editServiceDescInput) editServiceDescInput.value = '';
        if (editServiceStatusSelect) editServiceStatusSelect.value = 'active';
    }
    
    function saveServiceEdit() {
        if (!currentEditId) return;
        
        const newName = editServiceNameInput ? editServiceNameInput.value.trim() : '';
        if (!newName) {
            alert('Service name is required!');
            return;
        }
        
        const newDesc = editServiceDescInput ? editServiceDescInput.value.trim() : '';
        const newStatus = editServiceStatusSelect ? editServiceStatusSelect.value : 'active';
        
        const index = services.findIndex(s => s.id === currentEditId);
        if (index !== -1) {
            services[index] = {
                ...services[index],
                name: newName.toUpperCase(),
                description: newDesc || 'No description available.',
                active: newStatus === 'active'
            };
            saveServices();
            closeEditServiceModal();
            
            const toastMsg = document.createElement('div');
            toastMsg.textContent = '✓ Service updated successfully!';
            toastMsg.style.cssText = 'position:fixed; bottom:20px; right:20px; background:#1a4d6b; color:white; padding:12px 24px; border-radius:40px; z-index:9999; animation:fadeInOut 2s ease; font-weight:500;';
            document.body.appendChild(toastMsg);
            setTimeout(() => toastMsg.remove(), 2000);
        }
    }
    
    if (!document.querySelector('#serviceToastStyle')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'serviceToastStyle';
        styleSheet.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(20px); }
                15% { opacity: 1; transform: translateY(0); }
                85% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    function renderServices() {
        const container = document.getElementById('servicesList');
        if (!container) return;
        
        if (services.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 40px; color: #1a4d6b;"><i class="bi bi-inbox fs-1 d-block mb-3"></i>No services available. Click "ADD SERVICES" to create one.</div>';
            return;
        }
        
        container.innerHTML = services.map(service => `
            <div class="service-item ${!service.active ? 'inactive' : ''}" data-id="${service.id}">
                <div class="service-header">
                    <span class="service-name">${escapeHtml(service.name)}</span>
                    <span class="service-badge ${service.active ? 'active' : 'inactive'}">
                        ${service.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                </div>
                <div class="service-description">
                    ${escapeHtml(service.description) || 'No description available.'}
                </div>
                <div class="service-actions">
                    <button class="btn-edit" data-id="${service.id}">
                        <i class="bi bi-pencil"></i> EDIT DESCRIPTION
                    </button>
                    <button class="btn-delete" data-id="${service.id}">
                        <i class="bi bi-trash"></i> DELETE
                    </button>
                </div>
            </div>
        `).join('');
        
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                openEditServiceModal(id);
            });
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this service?')) {
                    services = services.filter(s => s.id !== id);
                    saveServices();
                }
            });
        });
    }
    
    function saveServices() {
        localStorage.setItem('clinicServices', JSON.stringify(services));
        renderServices();
    }
    
    if (closeServiceModalBtn) {
        closeServiceModalBtn.addEventListener('click', closeEditServiceModal);
    }
    if (cancelServiceModalBtn) {
        cancelServiceModalBtn.addEventListener('click', closeEditServiceModal);
    }
    if (saveServiceEditBtn) {
        saveServiceEditBtn.addEventListener('click', saveServiceEdit);
    }
    if (editServiceModal) {
        editServiceModal.addEventListener('click', (e) => {
            if (e.target === editServiceModal) {
                closeEditServiceModal();
            }
        });
    }
    
    const addServiceBtn = document.getElementById('addServiceBtn');
    if (addServiceBtn) {
        addServiceBtn.addEventListener('click', () => {
            const newName = prompt('Enter service name:', '');
            if (newName && newName.trim()) {
                const newService = {
                    id: Date.now().toString(),
                    name: newName.trim().toUpperCase(),
                    description: 'Click EDIT DESCRIPTION to add details about this service.',
                    active: true
                };
                services.push(newService);
                saveServices();
            }
        });
    }
    
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    function switchTab(tabId) {
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeContent = document.getElementById(`${tabId}-tab`);
        if (activeContent) activeContent.classList.add('active');
        
        const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
        if (activeBtn) activeBtn.classList.add('active');
    }
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            if (tabId) switchTab(tabId);
        });
    });
    
    // Logout
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
            // Clear login session
                localStorage.removeItem('adminLoggedIn');
                localStorage.removeItem('adminEmail');
            
                alert('Logged out successfully!');
            // Redirect to signin page
                window.location.href = 'signin_admin.html';
            }
        });
    }
    
    loadSchedule();
    setupScheduleToggles();
    loadServices();
    loadPatients();
    loadMedicalRecords();
    loadAppointments();
    updateReportData();
    
    updateDashboardStats();
    renderMedicalRecords();
    loadReports('service');
});
