<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - CHMSU Online Clinic</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

    <div class="container mt-5">
        <div class="card shadow">
            <div class="card-body text-center">
                <h1 class="mb-4">Welcome, {{ auth()->user()->first_name }} {{ auth()->user()->last_name }}!</h1>
                <p class="lead">You are logged in as <strong>{{ auth()->user()->user_type }}</strong></p>
                <p>Email: {{ auth()->user()->email }}</p>
                <p>School ID: {{ auth()->user()->school_id ?? 'Not set' }}</p>
                <p>Department: {{ auth()->user()->department }}</p>

                <form action="{{ route('logout') }}" method="POST" class="mt-4">
                    @csrf
                    <button type="submit" class="btn btn-danger">Logout</button>
                </form>
            </div>
        </div>
    </div>

</body>
</html>