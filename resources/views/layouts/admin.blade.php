<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $title ?? 'CHMSU Clinic Admin' }}</title>
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
        @include('partials.admin.sidebar')
        <div class="flex-grow-1 d-flex flex-column">
            @include('partials.admin.header')
            <main class="p-4 overflow-auto">
                <div class="container-fluid">
                    @yield('content')
                </div>
            </main>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{ asset('js/admin_dashboard.js') }}"></script>
</body>
</html>
