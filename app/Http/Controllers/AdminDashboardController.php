<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\ClinicSchedule;
use App\Models\ClinicService;
use App\Models\EmergencyRequest;
use App\Models\MedicalRecord;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class AdminDashboardController extends Controller
{
    private const DEFAULT_SCHEDULE = [
        ['day_key' => 'mon', 'day_name' => 'MONDAY', 'start_time' => '07:30', 'end_time' => '17:00', 'is_active' => true, 'sort_order' => 1],
        ['day_key' => 'tue', 'day_name' => 'TUESDAY', 'start_time' => '07:30', 'end_time' => '17:00', 'is_active' => true, 'sort_order' => 2],
        ['day_key' => 'wed', 'day_name' => 'WEDNESDAY', 'start_time' => '07:00', 'end_time' => '17:00', 'is_active' => true, 'sort_order' => 3],
        ['day_key' => 'thu', 'day_name' => 'THURSDAY', 'start_time' => '07:30', 'end_time' => '16:00', 'is_active' => true, 'sort_order' => 4],
        ['day_key' => 'fri', 'day_name' => 'FRIDAY', 'start_time' => '07:30', 'end_time' => '15:00', 'is_active' => true, 'sort_order' => 5],
        ['day_key' => 'sat', 'day_name' => 'SATURDAY', 'start_time' => null, 'end_time' => null, 'is_active' => false, 'sort_order' => 6],
        ['day_key' => 'sun', 'day_name' => 'SUNDAY', 'start_time' => null, 'end_time' => null, 'is_active' => false, 'sort_order' => 7],
    ];

    public function index()
    {
        $this->authorizeAdmin();

        return view('pages.admin.dashboard', [
            'user' => Auth::user(),
        ]);
    }

    public function data(): JsonResponse
    {
        $this->authorizeAdmin();
        $this->syncCompletedAppointmentsToMedicalRecords();

        return response()->json([
            'appointments' => $this->formattedAppointments(),
            'patients' => $this->formattedPatients(),
            'medicalRecords' => $this->formattedMedicalRecords(),
            'emergencyRequests' => $this->formattedEmergencyRequests(),
            'services' => $this->formattedServices(),
            'schedule' => $this->formattedSchedule(),
        ]);
    }

    public function updateAppointmentStatus(Request $request, Appointment $appointment): JsonResponse
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending', 'approved', 'completed', 'cancelled'])],
        ]);

        $statusMap = [
            'pending' => 'Pending',
            'approved' => 'Approved',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
        ];

        $appointment->status = $statusMap[$validated['status']];
        $appointment->approved_at = $validated['status'] === 'approved' ? now() : $appointment->approved_at;
        $appointment->save();

        if ($validated['status'] === 'completed') {
            $this->ensureMedicalRecordForCompletedAppointment($appointment);
        }

        return response()->json([
            'message' => 'Appointment status updated successfully.',
            'appointment' => $this->formatAppointment($appointment->load('user')),
        ]);
    }

    public function updateEmergencyStatus(Request $request, EmergencyRequest $emergencyRequest): JsonResponse
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'status' => ['required', Rule::in(['received', 'in-treatment', 'completed'])],
        ]);

        $statusMap = [
            'received' => 'Received',
            'in-treatment' => 'In Treatment',
            'completed' => 'Completed',
        ];

        $emergencyRequest->status = $statusMap[$validated['status']];

        if (in_array($validated['status'], ['received', 'in-treatment'], true) && ! $emergencyRequest->responded_at) {
            $emergencyRequest->responded_at = now();
        }

        $emergencyRequest->save();

        return response()->json([
            'message' => 'Emergency request updated successfully.',
            'emergencyRequest' => $this->formatEmergencyRequest($emergencyRequest->fresh()->load('user')),
        ]);
    }

    public function storeMedicalRecord(Request $request): JsonResponse
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'patient_id' => ['nullable', 'integer', 'exists:users,id'],
            'patient_name' => ['required', 'string', 'max:255'],
            'visit_type' => ['required', 'string', 'max:255'],
            'diagnosis' => ['nullable', 'string'],
            'prescription' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $patient = $this->findPatient($validated['patient_name'], $validated['patient_id'] ?? null);

        if (! $patient) {
            return response()->json([
                'message' => 'Patient account not found. Use the full name of an existing user.',
            ], 422);
        }

        $record = MedicalRecord::create([
            'user_id' => $patient->id,
            'visit_date' => now()->toDateString(),
            'service_type' => $validated['visit_type'],
            'diagnosis' => $validated['diagnosis'] ?: 'No diagnosis',
            'medications' => $validated['prescription'] ?: 'No prescription',
            'notes' => $validated['notes'] ?: 'No additional notes',
            'record_type' => $this->normalizeRecordType($validated['visit_type']),
        ]);

        return response()->json([
            'message' => 'Medical record saved successfully.',
            'record' => $this->formatMedicalRecord($record->load('user')),
        ]);
    }

    public function updateMedicalRecord(Request $request, MedicalRecord $medicalRecord): JsonResponse
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'patient_id' => ['nullable', 'integer', 'exists:users,id'],
            'patient_name' => ['required', 'string', 'max:255'],
            'visit_type' => ['required', 'string', 'max:255'],
            'diagnosis' => ['nullable', 'string'],
            'prescription' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $patient = $this->findPatient($validated['patient_name'], $validated['patient_id'] ?? null);

        if (! $patient) {
            return response()->json([
                'message' => 'Patient account not found. Use the full name of an existing user.',
            ], 422);
        }

        $medicalRecord->update([
            'user_id' => $patient->id,
            'service_type' => $validated['visit_type'],
            'diagnosis' => $validated['diagnosis'] ?: 'No diagnosis',
            'medications' => $validated['prescription'] ?: 'No prescription',
            'notes' => $validated['notes'] ?: 'No additional notes',
            'record_type' => $this->normalizeRecordType($validated['visit_type']),
        ]);

        return response()->json([
            'message' => 'Medical record updated successfully.',
            'record' => $this->formatMedicalRecord($medicalRecord->fresh()->load('user')),
        ]);
    }

    public function destroyMedicalRecord(MedicalRecord $medicalRecord): JsonResponse
    {
        $this->authorizeAdmin();

        $medicalRecord->delete();

        return response()->json([
            'message' => 'Medical record deleted successfully.',
        ]);
    }

    public function saveSchedule(Request $request): JsonResponse
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'schedule' => ['required', 'array'],
            'schedule.*.day_name' => ['required', 'string'],
            'schedule.*.start' => ['nullable', 'date_format:H:i'],
            'schedule.*.end' => ['nullable', 'date_format:H:i'],
            'schedule.*.active' => ['required', 'boolean'],
        ]);

        foreach ($validated['schedule'] as $dayKey => $day) {
            ClinicSchedule::updateOrCreate(
                ['day_key' => $dayKey],
                [
                    'day_name' => $day['day_name'],
                    'start_time' => $day['active'] ? $day['start'] : null,
                    'end_time' => $day['active'] ? $day['end'] : null,
                    'is_active' => $day['active'],
                    'sort_order' => $this->scheduleSortOrder($dayKey),
                ]
            );
        }

        return response()->json([
            'message' => 'Clinic schedule saved successfully.',
            'schedule' => $this->formattedSchedule(),
        ]);
    }

    public function storeService(Request $request): JsonResponse
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:clinic_services,name'],
            'description' => ['nullable', 'string'],
            'active' => ['required', 'boolean'],
        ]);

        $service = ClinicService::create([
            'name' => strtoupper(trim($validated['name'])),
            'description' => $validated['description'] ?: 'No description available.',
            'is_active' => $validated['active'],
        ]);

        return response()->json([
            'message' => 'Service added successfully.',
            'service' => $this->formatService($service),
        ]);
    }

    public function updateService(Request $request, ClinicService $clinicService): JsonResponse
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('clinic_services', 'name')->ignore($clinicService->id)],
            'description' => ['nullable', 'string'],
            'active' => ['required', 'boolean'],
        ]);

        $clinicService->update([
            'name' => strtoupper(trim($validated['name'])),
            'description' => $validated['description'] ?: 'No description available.',
            'is_active' => $validated['active'],
        ]);

        return response()->json([
            'message' => 'Service updated successfully.',
            'service' => $this->formatService($clinicService->fresh()),
        ]);
    }

    public function destroyService(ClinicService $clinicService): JsonResponse
    {
        $this->authorizeAdmin();

        $clinicService->delete();

        return response()->json([
            'message' => 'Service deleted successfully.',
        ]);
    }

    private function authorizeAdmin(): void
    {
        abort_unless(Auth::check() && Auth::user()->user_type === 'admin', 403);
    }

    private function formattedAppointments(): array
    {
        return Appointment::with('user')
            ->orderByDesc('appointment_date')
            ->orderByDesc('appointment_time')
            ->get()
            ->map(fn (Appointment $appointment) => $this->formatAppointment($appointment))
            ->all();
    }

    private function formattedPatients(): array
    {
        return User::where('user_type', '!=', 'admin')
            ->with(['medicalRecords' => fn ($query) => $query->latest('visit_date')])
            ->get()
            ->map(function (User $user) {
                $records = $user->medicalRecords->sortByDesc('visit_date')->values();
                $latestRecord = $records->first();

                return [
                    'id' => (string) $user->id,
                    'number' => strtoupper($user->school_id),
                    'name' => trim($user->first_name . ' ' . $user->last_name),
                    'type' => strtoupper($user->user_type),
                    'email' => $user->email,
                    'totalVisits' => $records->count(),
                    'lastVisit' => $latestRecord?->visit_date?->format('M j, Y') ?? 'No visits',
                    'lastService' => $latestRecord?->record_type ?? 'No records',
                    'medicalHistory' => $records->isEmpty()
                        ? '<p class="mb-0">No medical history available.</p>'
                        : $records->map(function (MedicalRecord $record) {
                            return '<p class="mb-2">• '
                                . e($record->record_type)
                                . ' ('
                                . e($record->visit_date?->format('M j, Y'))
                                . '): '
                                . e($record->diagnosis ?: 'No diagnosis')
                                . '</p>';
                        })->implode(''),
                ];
            })
            ->values()
            ->all();
    }

    private function formattedMedicalRecords(): array
    {
        return MedicalRecord::with('user')
            ->orderByDesc('visit_date')
            ->orderByDesc('id')
            ->get()
            ->map(fn (MedicalRecord $record) => $this->formatMedicalRecord($record))
            ->all();
    }

    private function formattedEmergencyRequests(): array
    {
        return EmergencyRequest::with('user')
            ->orderByRaw("
                CASE
                    WHEN status = 'Pending' THEN 0
                    WHEN status = 'Received' THEN 1
                    WHEN status = 'In Treatment' THEN 2
                    WHEN status = 'Completed' THEN 3
                    ELSE 4
                END
            ")
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (EmergencyRequest $request) => $this->formatEmergencyRequest($request))
            ->all();
    }

    private function formatEmergencyRequest(EmergencyRequest $request): array
    {
        return [
            'id' => (string) $request->id,
            'patientName' => $request->patient_name,
            'contactNumber' => $request->contact_number,
            'location' => $request->current_location,
            'emergencyType' => $request->emergency_type,
            'symptoms' => $request->symptoms,
            'status' => str($request->status)->lower()->replace(' ', '-')->value(),
            'statusLabel' => $request->status,
            'submittedAt' => $request->created_at?->format('M j, Y g:i A'),
            'requestedBy' => trim(($request->user?->first_name ?? '') . ' ' . ($request->user?->last_name ?? '')),
        ];
    }

    private function formattedServices(): array
    {
        return ClinicService::orderBy('name')
            ->get()
            ->map(fn (ClinicService $service) => $this->formatService($service))
            ->all();
    }

    private function formattedSchedule(): array
    {
        $savedSchedule = ClinicSchedule::orderBy('sort_order')->get()->keyBy('day_key');

        return collect(self::DEFAULT_SCHEDULE)
            ->mapWithKeys(function (array $defaultDay) use ($savedSchedule) {
                /** @var ClinicSchedule|null $savedDay */
                $savedDay = $savedSchedule->get($defaultDay['day_key']);

                return [
                    $defaultDay['day_key'] => [
                        'day_name' => $defaultDay['day_name'],
                        'start' => $savedDay?->start_time ? Carbon::parse($savedDay->start_time)->format('H:i') : $defaultDay['start_time'],
                        'end' => $savedDay?->end_time ? Carbon::parse($savedDay->end_time)->format('H:i') : $defaultDay['end_time'],
                        'active' => $savedDay?->is_active ?? $defaultDay['is_active'],
                    ],
                ];
            })
            ->all();
    }

    private function formatAppointment(Appointment $appointment): array
    {
        return [
            'id' => (string) $appointment->id,
            'patientName' => trim(($appointment->user?->first_name ?? '') . ' ' . ($appointment->user?->last_name ?? '')),
            'service' => $appointment->service_type,
            'date' => $appointment->appointment_date?->format('M j, Y'),
            'time' => Carbon::parse($appointment->appointment_time)->format('g:i A'),
            'reason' => $appointment->reason_for_visit,
            'urgent' => (bool) $appointment->urgent,
            'status' => strtolower($appointment->status),
        ];
    }

    private function formatMedicalRecord(MedicalRecord $record): array
    {
        return [
            'id' => (string) $record->id,
            'patientId' => (string) $record->user_id,
            'patientName' => trim(($record->user?->first_name ?? '') . ' ' . ($record->user?->last_name ?? '')),
            'patientNumber' => strtoupper($record->user?->school_id ?? 'N/A'),
            'date' => $record->visit_date?->format('M j, Y'),
            'visitType' => $record->service_type,
            'service' => $record->service_type ?: $record->record_type,
            'diagnosis' => $record->diagnosis ?: 'No diagnosis',
            'prescription' => $record->medications ?: 'No prescription',
            'notes' => $record->notes ?: 'No additional notes',
        ];
    }

    private function formatService(ClinicService $service): array
    {
        return [
            'id' => (string) $service->id,
            'name' => $service->name,
            'description' => $service->description ?: 'No description available.',
            'active' => $service->is_active,
        ];
    }

    private function findPatient(string $fullName, ?int $patientId = null): ?User
    {
        if ($patientId) {
            return User::where('id', $patientId)
                ->where('user_type', '!=', 'admin')
                ->first();
        }

        $search = preg_replace('/\s+/', ' ', trim($fullName));

        return User::where('user_type', '!=', 'admin')
            ->get()
            ->first(function (User $user) use ($search) {
                return strcasecmp(trim($user->first_name . ' ' . $user->last_name), $search) === 0;
            });
    }

    private function normalizeRecordType(string $visitType): string
    {
        return match (strtolower(trim($visitType))) {
            'general checkup' => 'Check-up',
            'general check-up' => 'Check-up',
            'dental' => 'Check-up',
            'dental check-up' => 'Check-up',
            'follow up visit' => 'Follow-up',
            default => $visitType,
        };
    }

    private function ensureMedicalRecordForCompletedAppointment(Appointment $appointment): void
    {
        MedicalRecord::firstOrCreate(
            ['appointment_id' => $appointment->id],
            [
                'user_id' => $appointment->user_id,
                'visit_date' => $appointment->appointment_date?->toDateString() ?? now()->toDateString(),
                'service_type' => $appointment->service_type,
                'diagnosis' => 'Appointment marked as completed.',
                'notes' => $appointment->reason_for_visit ?: 'Generated from completed appointment.',
                'record_type' => $this->normalizeRecordType($appointment->service_type),
            ]
        );
    }

    private function syncCompletedAppointmentsToMedicalRecords(): void
    {
        Appointment::where('status', 'Completed')
            ->get()
            ->each(function (Appointment $appointment) {
                $this->ensureMedicalRecordForCompletedAppointment($appointment);
            });
    }

    private function scheduleSortOrder(string $dayKey): int
    {
        return collect(self::DEFAULT_SCHEDULE)
            ->firstWhere('day_key', $dayKey)['sort_order'] ?? 99;
    }
}
