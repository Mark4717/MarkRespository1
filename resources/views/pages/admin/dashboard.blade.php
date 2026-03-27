<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>CHMSU Clinic Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <script src="https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <link rel="stylesheet" href="{{ asset('css/admin_dashboard.css') }}">
</head>
<body
    data-admin-data-url="{{ route('admin.data') }}"
    data-admin-appointment-status-url="{{ route('admin.appointments.status', ['appointment' => '__ID__']) }}"
    data-admin-emergency-status-url="{{ route('admin.emergency-requests.status', ['emergencyRequest' => '__ID__']) }}"
    data-admin-record-store-url="{{ route('admin.medical-records.store') }}"
    data-admin-record-update-url="{{ route('admin.medical-records.update', ['medicalRecord' => '__ID__']) }}"
    data-admin-record-destroy-url="{{ route('admin.medical-records.destroy', ['medicalRecord' => '__ID__']) }}"
    data-admin-schedule-url="{{ route('admin.system.schedule') }}"
    data-admin-service-store-url="{{ route('admin.services.store') }}"
    data-admin-service-update-url="{{ route('admin.services.update', ['clinicService' => '__ID__']) }}"
    data-admin-service-destroy-url="{{ route('admin.services.destroy', ['clinicService' => '__ID__']) }}"
>
    <div class="d-flex h-100">
        <nav class="sidebar p-3 d-flex flex-column" id="sidebar">
            <div class="text-center mb-4">
                <img src="{{ asset('images/logo.png') }}" alt="CHMSU Logo" class="sidebar-logo">
                <h5 class="text-white fw-bold mt-2 sidebar-text">CHMSU</h5>
            </div>

            <ul class="nav flex-column gap-2" id="sidebarNav">
                <li class="nav-item"><a class="nav-link active" href="#" data-section="dashboard"><i class="bi bi-grid-fill"></i> <span class="ms-2">DASHBOARD</span></a></li>
                <li class="nav-item"><a class="nav-link" href="#" data-section="appointment"><i class="bi bi-calendar-event"></i> <span class="ms-2">APPOINTMENT</span></a></li>
                <li class="nav-item"><a class="nav-link" href="#" data-section="patients"><i class="bi bi-people-fill"></i> <span class="ms-2">PATIENTS</span></a></li>
                <li class="nav-item"><a class="nav-link" href="#" data-section="medical-records"><i class="bi bi-file-earmark-medical"></i> <span class="ms-2">MEDICAL RECORDS</span></a></li>
                <li class="nav-item"><a class="nav-link" href="#" data-section="reports"><i class="bi bi-graph-up"></i> <span class="ms-2">REPORTS</span></a></li>
                <li class="nav-item"><a class="nav-link" href="#" data-section="system"><i class="bi bi-gear-fill"></i> <span class="ms-2">SYSTEM</span></a></li>
            </ul>

            <form action="{{ route('logout') }}" method="POST" id="adminLogoutForm" class="mt-auto">
                @csrf
                <button type="submit" class="btn logout-btn w-100 rounded-pill d-flex align-items-center justify-content-center">
                    <i class="bi bi-box-arrow-left"></i>
                    <span class="ms-2 sidebar-text">LOG OUT</span>
                </button>
            </form>
        </nav>
        <div class="flex-grow-1 d-flex flex-column">
            <header class="p-3 shadow-sm d-flex align-items-center">
                <button id="sidebarToggle" class="btn me-3">
                    <i class="bi bi-list fs-3 text-white"></i>
                </button>
                <h3 id="pageTitle" class="fw-bold mb-0 text-white">DASHBOARD</h3>
            </header>
            <main class="p-4 overflow-auto">
                <div class="container-fluid">
                    <section id="section-dashboard">
                        <div class="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
                            <div>
                                <h4 class="fw-bold text-primary-dark mb-1">ADMIN DASHBOARD</h4>
                                <p class="text-muted small mb-0">Welcome back, {{ $user->first_name }} {{ $user->last_name }}</p>
                            </div>
                        </div>
                        <div class="row g-3 mb-4">
                            <div class="col-md col-sm-6"><div class="stat-card card-blue"><span class="stat-number d-block fs-2 fw-bold" id="statTotalAppointments">0</span><span class="stat-label">TOTAL APPOINTMENT</span></div></div>
                            <div class="col-md col-sm-6"><div class="stat-card card-teal"><span class="stat-number d-block fs-2 fw-bold" id="statPendingRequests">0</span><span class="stat-label">PENDING REQUESTS</span></div></div>
                            <div class="col-md col-sm-6"><div class="stat-card card-blue"><span class="stat-number d-block fs-2 fw-bold" id="statApproved">0</span><span class="stat-label">APPROVED</span></div></div>
                            <div class="col-md col-sm-6"><div class="stat-card card-teal"><span class="stat-number d-block fs-2 fw-bold" id="statCancelled">0</span><span class="stat-label">CANCELLED</span></div></div>
                            <div class="col-md col-sm-12"><div class="stat-card card-dark"><span class="stat-number d-block fs-2 fw-bold" id="statTodaySchedule">0</span><span class="stat-label">TODAY'S SCHEDULE</span></div></div>
                        </div>
                        <div class="row g-4 mb-4">
                            <div class="col-lg-6"><div class="chart-container p-3"><h6 class="fw-bold mb-3">Monthly Visits</h6><div class="chart-wrapper"><canvas id="barChart"></canvas></div></div></div>
                            <div class="col-lg-6"><div class="chart-container p-3"><h6 class="fw-bold mb-3">Patient Trends</h6><div class="chart-wrapper"><canvas id="lineChart"></canvas></div></div></div>
                        </div>
                        <div class="row"><div class="col-12"><div class="chart-container p-3"><h6 class="fw-bold mb-3 text-center">Service Distribution</h6><div class="pie-wrapper"><canvas id="pieChart"></canvas></div></div></div></div>
                    </section>

                    <section id="section-appointment" class="d-none">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h4 class="fw-bold text-primary-dark mb-1">ADMIN APPOINTMENT</h4>
                                <p class="text-muted small">Manage and track all clinic appointments</p>
                            </div>
                            <div class="d-flex align-items-center gap-2">
                                <i class="bi bi-funnel fs-4 text-primary"></i>
                                <select id="statusFilter" class="form-select rounded-pill px-4 fw-bold filter-select">
                                    <option value="all">ALL STATUS</option>
                                    <option value="pending">PENDING</option>
                                    <option value="approved">APPROVED</option>
                                    <option value="completed">COMPLETED</option>
                                    <option value="cancelled">CANCELLED</option>
                                </select>
                            </div>
                        </div>
                        <div class="emergency-box mb-4">
                            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                                <div>
                                    <h6 class="fw-bold mb-1 text-primary-dark">Emergency Requests</h6>
                                    <p class="text-muted small mb-0">Most recent active emergency request</p>
                                </div>
                                <div class="d-flex align-items-center gap-2">
                                    <span class="emergency-box-badge" id="emergencyPendingCount">0 Active</span>
                                    <button type="button" class="btn btn-emergency-viewall" id="viewAllEmergenciesBtn" data-bs-toggle="modal" data-bs-target="#emergencyRequestsModal">VIEW ALL</button>
                                </div>
                            </div>
                            <div id="dashboardEmergencyList" class="emergency-box-list compact">
                                <p class="notification-empty mb-0">No emergency requests yet.</p>
                            </div>
                        </div>

                        <div class="appointment-table-container shadow-sm">
                            <table class="table appointment-table align-middle" id="appointmentTable">
                                <thead>
                                    <tr><th scope="col">PATIENT</th><th scope="col">SERVICE</th><th scope="col">DATE & TIME</th><th scope="col">STATUS</th><th scope="col">ACTION</th></tr>
                                </thead>
                                <tbody id="appointmentTableBody"></tbody>
                            </table>
                        </div>
                    </section>

                    <div class="modal fade" id="appointmentDetailModal" tabindex="-1" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered modal-lg">
                            <div class="modal-content record-modal-content">
                                <div class="modal-header border-0 pb-0">
                                    <h5 class="modal-title fw-bold text-primary-dark"><i class="bi bi-calendar-event me-2"></i>APPOINTMENT DETAILS</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body pt-0">
                                    <div class="row g-3">
                                        <div class="col-md-12"><div class="detail-field"><label class="detail-label">PATIENT NAME</label><span class="detail-value" id="modalAppointmentPatient">-</span></div></div>
                                        <div class="col-md-12"><div class="detail-field"><label class="detail-label">SERVICE</label><span class="detail-value" id="modalAppointmentService">-</span></div></div>
                                        <div class="col-md-6"><div class="detail-field"><label class="detail-label">DATE</label><span class="detail-value" id="modalAppointmentDate">-</span></div></div>
                                        <div class="col-md-6"><div class="detail-field"><label class="detail-label">TIME</label><span class="detail-value" id="modalAppointmentTime">-</span></div></div>
                                        <div class="col-md-12"><div class="detail-field"><label class="detail-label">STATUS</label><span class="detail-value" id="modalAppointmentStatus">-</span></div></div>
                                        <div class="col-md-12"><div class="detail-field"><label class="detail-label">URGENT REQUEST</label><span class="detail-value" id="modalAppointmentUrgent">-</span></div></div>
                                        <div class="col-12"><div class="detail-field"><label class="detail-label">REASON FOR VISIT</label><span class="detail-value" id="modalAppointmentReason">-</span></div></div>
                                    </div>
                                </div>
                                <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">CLOSE</button></div>
                            </div>
                        </div>
                    </div>

                    <section id="section-patients" class="d-none">
                        <div class="row g-4">
                            <div class="col-12"><h4 class="fw-bold text-primary-dark mb-0">ADMIN PATIENTS</h4><p class="text-muted small">View and manage patient records</p></div>
                            <div class="col-md-5">
                                <div class="patient-search-wrapper mb-4">
                                    <div class="input-group shadow-sm rounded-pill overflow-hidden bg-white border-2" style="border: 2px solid #6c9fb8;">
                                        <span class="input-group-text bg-white border-0 ps-3"><i class="bi bi-search text-dark"></i></span>
                                        <input type="text" class="form-control border-0 py-2" id="patientSearch" placeholder="SEARCH PATIENT">
                                    </div>
                                </div>
                                <div class="patient-list-container" id="patientList"></div>
                            </div>
                            <div class="col-md-7">
                                <div id="noPatientSelected" class="detail-placeholder d-flex flex-column align-items-center justify-content-center h-100 rounded-4" style="height: 650px; min-height: 650px;">
                                    <i class="bi bi-person-circle fs-1 text-dark opacity-50 mb-3"></i>
                                    <h5 class="fw-bold text-dark opacity-75">Select a patient to view details</h5>
                                </div>
                                <div id="patientDetailsPanel" class="d-none detail-info-container p-4 rounded-4">
                                    <div class="border-bottom border-dark border-2 pb-3 mb-4">
                                        <h2 class="fw-bold text-dark mb-0" id="detailPatientName">-</h2>
                                        <p class="fw-bold text-dark mb-0" id="detailUserType">-</p>
                                    </div>
                                    <div class="mb-4"><h6 class="fw-bold text-dark mb-2">EMAIL</h6><div class="detail-data-pill p-3 px-4" id="detailEmail">-</div></div>
                                    <div class="row g-3 mb-4">
                                        <div class="col-6"><div class="info-stat-card"><span class="fw-bold d-block mb-2">Total Visits</span><span class="display-4 fw-bold" id="detailTotalVisits">0</span></div></div>
                                        <div class="col-6"><div class="info-stat-card"><span class="fw-bold d-block mb-2">Last Visit</span><span class="fs-3 fw-bold" id="detailLastVisit">-</span></div></div>
                                    </div>
                                    <div><h6 class="fw-bold text-dark text-center mb-3">MEDICAL HISTORY</h6><div class="medical-history-box p-4" id="detailMedicalHistory"><p class="mb-0">No medical history available.</p></div></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="section-medical-records" class="d-none">
                        <div class="medical-records-header">
                            <div><h4 class="fw-bold text-primary-dark mb-0">ADMIN MEDICAL RECORDS</h4><p class="text-muted small">Create and manage patient medical records</p></div>
                            <button class="btn btn-new-record rounded-pill px-4 py-2 fw-bold" id="newRecordToggleBtn"><i class="bi bi-plus-circle me-1"></i> NEW RECORD</button>
                        </div>
                        <div class="med-stats-row">
                            <div class="med-stat-item"><span class="stat-number" id="totalRecordsCount">0</span><span class="stat-label">TOTAL RECORDS</span></div>
                            <div class="med-stat-item"><span class="stat-number" id="thisMonthCount">0</span><span class="stat-label">THIS MONTH</span></div>
                            <div class="med-stat-item"><span class="stat-number" id="frequentVisitsCount">0</span><span class="stat-label">FREQUENT VISITS</span></div>
                        </div>
                        <div id="newRecordForm" class="new-record-form-container d-none">
                            <h5 class="fw-bold text-primary-dark mb-4"><i class="bi bi-file-earmark-plus me-2"></i>CREATE NEW MEDICAL RECORD</h5>
                            <div class="row g-4">
                                <div class="col-md-6"><label class="form-label-dark">PATIENT NAME</label><select id="recordPatientId" class="med-input"><option value="">Select patient</option></select></div>
                                <div class="col-md-6"><label class="form-label-dark">VISIT TYPE</label><select id="recordVisitType" class="med-input"><option value="Consultation">Consultation</option><option value="General Checkup">General Checkup</option><option value="Dental">Dental</option><option value="Emergency">Emergency</option><option value="Medical Certificate">Medical Certificate</option></select></div>
                                <div class="col-12"><label class="form-label-dark">DIAGNOSIS</label><textarea id="recordDiagnosis" class="med-textarea" rows="2" placeholder="Enter diagnosis..."></textarea></div>
                                <div class="col-12"><label class="form-label-dark">PRESCRIPTION</label><textarea id="recordPrescription" class="med-textarea" rows="2" placeholder="Enter prescription..."></textarea></div>
                                <div class="col-12"><label class="form-label-dark">NOTES</label><textarea id="recordNotes" class="med-textarea" rows="2" placeholder="Additional notes..."></textarea></div>
                                <div class="col-12 d-flex justify-content-end gap-3 mt-3"><button class="btn btn-cancel-record" id="cancelRecordBtn" type="button">CANCEL</button><button class="btn btn-save-record" id="saveRecordBtn" type="button">SAVE RECORD</button></div>
                            </div>
                        </div>
                        <div class="records-card-list" id="medicalRecordsList"></div>
                    </section>

                    <div class="modal fade" id="recordDetailModal" tabindex="-1" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered modal-lg">
                            <div class="modal-content record-modal-content">
                                <div class="modal-header border-0 pb-0">
                                    <h5 class="modal-title fw-bold text-primary-dark"><i class="bi bi-file-earmark-medical me-2"></i>MEDICAL RECORD DETAILS</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body pt-0">
                                    <div class="row g-3">
                                        <div class="col-md-12"><div class="detail-field"><label class="detail-label">PATIENT NAME</label><span class="detail-value" id="modalRecordName">-</span></div></div>
                                        <div class="col-md-12"><div class="detail-field"><label class="detail-label">PATIENT NUMBER</label><span class="detail-value" id="modalRecordNumber">-</span></div></div>
                                        <div class="col-md-12"><div class="detail-field"><label class="detail-label">DATE</label><span class="detail-value" id="modalRecordDate">-</span></div></div>
                                        <div class="col-md-12"><div class="detail-field"><label class="detail-label">VISIT TYPE</label><span class="detail-value" id="modalRecordType">-</span></div></div>
                                        <div class="col-12"><div class="detail-field"><label class="detail-label">DIAGNOSIS</label><span class="detail-value" id="modalRecordDiagnosis">-</span></div></div>
                                        <div class="col-12"><div class="detail-field"><label class="detail-label">PRESCRIPTION</label><span class="detail-value" id="modalRecordPrescription">-</span></div></div>
                                        <div class="col-12"><div class="detail-field"><label class="detail-label">NOTES</label><span class="detail-value" id="modalRecordNotes">-</span></div></div>
                                    </div>
                                </div>
                                <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">CLOSE</button></div>
                            </div>
                        </div>
                    </div>

                    <div class="modal fade" id="editRecordModal" tabindex="-1" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered modal-lg">
                            <div class="modal-content record-modal-content">
                                <div class="modal-header border-0 pb-0">
                                    <h5 class="modal-title fw-bold text-primary-dark"><i class="bi bi-pencil-square me-2"></i>EDIT MEDICAL RECORD</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body pt-0">
                                    <input type="hidden" id="editRecordId">
                                    <div class="row g-3">
                                        <div class="col-md-12"><div class="detail-field"><label class="detail-label">PATIENT NAME</label><select id="editPatientId" class="form-select"><option value="">Select patient</option></select></div></div>
                                        <div class="col-md-12"><div class="detail-field"><label class="detail-label">VISIT TYPE</label><select id="editVisitType" class="form-select"><option value="Consultation">Consultation</option><option value="General Checkup">General Checkup</option><option value="Dental">Dental</option><option value="Emergency">Emergency</option><option value="Medical Certificate">Medical Certificate</option></select></div></div>
                                        <div class="col-12"><div class="detail-field"><label class="detail-label">DIAGNOSIS</label><textarea id="editDiagnosis" class="form-control" rows="2" placeholder="Enter diagnosis..."></textarea></div></div>
                                        <div class="col-12"><div class="detail-field"><label class="detail-label">PRESCRIPTION</label><textarea id="editPrescription" class="form-control" rows="2" placeholder="Enter prescription..."></textarea></div></div>
                                        <div class="col-12"><div class="detail-field"><label class="detail-label">NOTES</label><textarea id="editNotes" class="form-control" rows="2" placeholder="Additional notes..."></textarea></div></div>
                                    </div>
                                </div>
                                <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">CANCEL</button><button type="button" class="btn btn-primary" id="saveEditRecordBtn" style="background-color: #0086bf;">SAVE CHANGES</button></div>
                            </div>
                        </div>
                    </div>

                    <div class="modal fade" id="emergencyRequestsModal" tabindex="-1" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered modal-xl">
                            <div class="modal-content record-modal-content">
                                <div class="modal-header border-0 pb-0">
                                    <h5 class="modal-title fw-bold text-primary-dark"><i class="bi bi-exclamation-diamond-fill me-2"></i>EMERGENCY REQUESTS</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body pt-0">
                                    <div id="emergencyModalList" class="emergency-box-list modal-list">
                                        <p class="notification-empty mb-0">No emergency requests yet.</p>
                                    </div>
                                </div>
                                <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">CLOSE</button></div>
                            </div>
                        </div>
                    </div>

                    <section id="section-reports" class="d-none">
                        <div class="reports-container">
                            <div class="reports-header mb-4"><h4 class="fw-bold text-primary-dark mb-1">ADMIN REPORTS</h4><p class="text-muted small">Generate and view clinic performance reports</p></div>
                            <div class="report-filter-card p-4 rounded-4 mb-4">
                                <div class="row align-items-end g-3">
                                    <div class="col-md-5"><label class="fw-bold text-dark mb-2">REPORT TYPE</label><select id="reportTypeSelect" class="form-select rounded-pill border-2" style="border-color: #6c9fb8;"><option value="service">Service Distribution</option><option value="monthly">Monthly Trends</option></select></div>
                                    <div class="col-md-3"><button id="applyReportFilter" class="btn btn-apply-filter rounded-pill px-4 py-2">APPLY FILTER</button></div>
                                    <div class="col-md-4 text-md-end"><div class="d-flex gap-2 justify-content-md-end"><button id="exportPDF" class="btn btn-export-pdf rounded-pill px-4"><i class="bi bi-file-pdf me-1"></i> PDF</button><button id="exportExcel" class="btn btn-export-excel rounded-pill px-4"><i class="bi bi-file-excel me-1"></i> EXCEL</button></div></div>
                                </div>
                            </div>
                            <div class="row g-3 mb-4">
                                <div class="col-md-4"><div class="stat-card card-blue text-center p-3"><span class="stat-number d-block fs-2 fw-bold" id="reportTotalAppointments">0</span><span class="stat-label">TOTAL APPOINTMENTS</span></div></div>
                                <div class="col-md-4"><div class="stat-card card-teal text-center p-3"><span class="stat-number d-block fs-2 fw-bold" id="reportTotalPatients">0</span><span class="stat-label">TOTAL PATIENTS</span></div></div>
                                <div class="col-md-4"><div class="stat-card card-dark text-center p-3"><span class="stat-number d-block fs-2 fw-bold" id="reportCompletionRate">0%</span><span class="stat-label">COMPLETION RATE</span></div></div>
                            </div>
                            <div class="report-chart-card p-4 rounded-4 mb-4"><h5 class="fw-bold text-primary-dark mb-4" id="chartTitle">Service Distribution (Number of Visits)</h5><div id="horizontalBarChartContainer" class="horizontal-bars-container"></div></div>
                            <div class="report-breakdown-card p-4 rounded-4"><h6 class="fw-bold text-primary-dark mb-3">SERVICE BREAKDOWN</h6><div id="serviceBreakdownList" class="row g-3"></div></div>
                        </div>
                    </section>

                    <section id="section-system" class="d-none">
                        <div class="system-section">
                            <div class="system-title"><h1>ADMIN SYSTEM</h1><p>Manage clinic settings and configurations</p></div>
                            <div class="system-tabs">
                                <button class="tab-btn active" data-tab="schedule"><i class="bi bi-calendar-week"></i>CLINIC SCHEDULE</button>
                                <button class="tab-btn" data-tab="services"><i class="bi bi-grid-3x3-gap-fill"></i>AVAILABLE SERVICES</button>
                            </div>
                            <div class="tab-content active" id="schedule-tab">
                                <div class="schedule-card"><div class="schedule-content"><div class="schedule-list">
                                    <div class="schedule-item" id="schedule-mon"><div class="day-info"><div class="day-name">MONDAY</div><div class="time-range"><input type="time" id="mon-start" class="time-picker" value="07:30"><span>to</span><input type="time" id="mon-end" class="time-picker" value="17:00"></div></div><button class="status-toggle active" data-day="mon"><i class="bi bi-power"></i><span>ACTIVE</span></button></div>
                                    <div class="schedule-item" id="schedule-tue"><div class="day-info"><div class="day-name">TUESDAY</div><div class="time-range"><input type="time" id="tue-start" class="time-picker" value="07:30"><span>to</span><input type="time" id="tue-end" class="time-picker" value="17:00"></div></div><button class="status-toggle active" data-day="tue"><i class="bi bi-power"></i><span>ACTIVE</span></button></div>
                                    <div class="schedule-item" id="schedule-wed"><div class="day-info"><div class="day-name">WEDNESDAY</div><div class="time-range"><input type="time" id="wed-start" class="time-picker" value="07:00"><span>to</span><input type="time" id="wed-end" class="time-picker" value="17:00"></div></div><button class="status-toggle active" data-day="wed"><i class="bi bi-power"></i><span>ACTIVE</span></button></div>
                                    <div class="schedule-item" id="schedule-thu"><div class="day-info"><div class="day-name">THURSDAY</div><div class="time-range"><input type="time" id="thu-start" class="time-picker" value="07:30"><span>to</span><input type="time" id="thu-end" class="time-picker" value="16:00"></div></div><button class="status-toggle active" data-day="thu"><i class="bi bi-power"></i><span>ACTIVE</span></button></div>
                                    <div class="schedule-item" id="schedule-fri"><div class="day-info"><div class="day-name">FRIDAY</div><div class="time-range"><input type="time" id="fri-start" class="time-picker" value="07:30"><span>to</span><input type="time" id="fri-end" class="time-picker" value="15:00"></div></div><button class="status-toggle active" data-day="fri"><i class="bi bi-power"></i><span>ACTIVE</span></button></div>
                                    <div class="schedule-item closed" id="schedule-sat"><div class="day-info"><div class="day-name">SATURDAY</div><div class="closed-label">CLOSED</div></div><button class="status-toggle inactive" data-day="sat"><i class="bi bi-power"></i><span>INACTIVE</span></button></div>
                                    <div class="schedule-item closed" id="schedule-sun"><div class="day-info"><div class="day-name">SUNDAY</div><div class="closed-label">CLOSED</div></div><button class="status-toggle inactive" data-day="sun"><i class="bi bi-power"></i><span>INACTIVE</span></button></div>
                                </div><button id="saveScheduleBtn" class="save-schedule-btn"><i class="bi bi-save"></i>SAVE CHANGES</button></div></div>
                            </div>
                            <div class="tab-content" id="services-tab"><div class="services-card"><div class="services-content"><div id="servicesList" class="services-list"></div><button id="addServiceBtn" class="add-service-btn"><i class="bi bi-plus-circle"></i>ADD SERVICES</button></div></div></div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    </div>

    <div class="modal-overlay" id="editServiceModal">
        <div class="modal-container">
            <div class="modal-header"><h3>EDIT SERVICE</h3><button class="modal-close" id="closeServiceModalBtn">&times;</button></div>
            <div class="modal-body">
                <div class="form-group"><label>SERVICE NAME</label><input type="text" id="editServiceNameInput" class="form-input" placeholder="Enter service name"></div>
                <div class="form-group"><label>DESCRIPTION</label><textarea id="editServiceDescInput" class="form-textarea" rows="4" placeholder="Enter service description"></textarea></div>
                <div class="form-group"><label>STATUS</label><select id="editServiceStatusSelect" class="form-select"><option value="active">ACTIVE</option><option value="inactive">INACTIVE</option></select></div>
            </div>
            <div class="modal-footer"><button class="btn-cancel" id="cancelServiceModalBtn">CANCEL</button><button class="btn-save" id="saveServiceEditBtn">SAVE CHANGES</button></div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{ asset('js/admin_dashboard.js') }}"></script>
</body>
</html>













