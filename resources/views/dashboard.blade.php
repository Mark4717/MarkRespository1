@auth
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CHMSU Online Clinic - Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('userCss/userStyle.css') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
    @include('partials.header')
    <div class="d-flex">
        @include('partials.sidebar')
        <div class="flex-grow-1 main-content-wrapper">
            <main class="container-fluid px-5 pt-4">
                @include('partials.overview')
                @include('partials.book-appointment')
                @include('partials.my-appointments')
                @include('partials.medical-records')
                @include('partials.emergency')
            </main>
        </div>
    </div>

    @include('partials.profile-modal')
    @include('partials.footer-scripts')
</body>
</html>
@endauth