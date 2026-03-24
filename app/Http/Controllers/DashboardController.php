<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Appointment;
use App\Models\MedicalRecord;
use App\Models\EmergencyRequest;

class DashboardController extends Controller
{
    /**
     * Display the dashboard
     */
    public function index()
    {
        $user = Auth::user();

        // Get user statistics
        $totalAppointments = $user->appointments()->count();
        $pendingAppointments = $user->appointments()->where('status', 'Pending')->count();
        $completedAppointments = $user->appointments()->where('status', 'Completed')->count();
        $totalMedicalRecords = $user->medicalRecords()->count();
        $totalEmergencyRequests = $user->emergencyRequests()->count();

        return view('dashboard', compact(
            'user',
            'totalAppointments',
            'pendingAppointments',
            'completedAppointments',
            'totalMedicalRecords',
            'totalEmergencyRequests'
        ));
    }

    /**
     * Get user appointments data (for AJAX requests)
     */
    public function getAppointments()
    {
        $user = Auth::user();
        $appointments = $user->appointments()
            ->orderBy('appointment_date', 'desc')
            ->orderBy('appointment_time', 'desc')
            ->get();

        return response()->json($appointments);
    }

    /**
     * Get user medical records (for AJAX requests)
     */
    public function getMedicalRecords()
    {
        $user = Auth::user();
        $medicalRecords = $user->medicalRecords()
            ->with('appointment')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($medicalRecords);
    }

    /**
     * Submit appointment booking
     */
    public function bookAppointment(Request $request)
    {
        $request->validate([
            'service_type' => 'required|string',
            'appointment_date' => 'required|date|after_or_equal:today',
            'appointment_time' => 'required',
            'reason_for_visit' => 'required|string|max:500',
            'urgent_check' => 'nullable|boolean'
        ]);

        try {
            $appointment = Appointment::create([
                'user_id' => Auth::id(),
                'service_type' => $request->service_type,
                'appointment_date' => $request->appointment_date,
                'appointment_time' => $request->appointment_time,
                'reason_for_visit' => $request->reason_for_visit,
                'urgent' => $request->urgent_check ? 1 : 0,
                'status' => 'Pending'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Appointment booked successfully!',
                'appointment' => $appointment
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to book appointment. Please try again.'
            ], 500);
        }
    }

    /**
     * Submit emergency request
     */
    public function submitEmergency(Request $request)
    {
        $request->validate([
            'emergency_patient_name' => 'required|string|max:255',
            'emergency_contact' => 'required|string|max:20',
            'emergency_location' => 'required|string|max:255',
            'emergency_type' => 'required|string',
            'emergency_symptoms' => 'required|string|max:500'
        ]);

        try {
            $emergencyRequest = EmergencyRequest::create([
                'user_id' => Auth::id(),
                'patient_name' => $request->emergency_patient_name,
                'contact_number' => $request->emergency_contact,
                'current_location' => $request->emergency_location,
                'emergency_type' => $request->emergency_type,
                'symptoms' => $request->emergency_symptoms,
                'status' => 'Pending'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Emergency request submitted successfully!',
                'emergency_request' => $emergencyRequest
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit emergency request. Please try again.'
            ], 500);
        }
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'contact' => 'nullable|string|max:20',
            'email' => 'required|email|max:255|unique:users,email,' . Auth::id(),
        ]);

        $nameParts = preg_split('/\s+/', trim($request->full_name), 2);
        $firstName = $nameParts[0] ?? '';
        $lastName = $nameParts[1] ?? '';

        try {
            $user = Auth::user();
            $user->first_name = $firstName;
            $user->last_name = $lastName;
            $user->department = $request->department;
            $user->contact = $request->contact;
            $user->email = $request->email;
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully.',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile. Please try again.'
            ], 500);
        }
    }

    /**
     * Cancel an appointment
     */
    public function cancelAppointment(Request $request)
    {
        $request->validate([
            'appointment_id' => 'required|integer|exists:appointments,id'
        ]);

        try {
            $appointment = Appointment::where('id', $request->appointment_id)
                ->where('user_id', Auth::id())
                ->where('status', 'Pending')
                ->firstOrFail();

            $appointment->update(['status' => 'Cancelled']);

            return response()->json([
                'success' => true,
                'message' => 'Appointment cancelled successfully!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel appointment. Please try again.'
            ], 500);
        }
    }
}