<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
    public function index()
    {
        $feedbacks = Feedback::with(['customer', 'creator'])->orderBy('created_at', 'desc')->get();
        return response()->json($feedbacks);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'nullable|date',
            'contract' => 'nullable|string',
            'location' => 'nullable|string',
            'access' => 'nullable|string',
            'tariff' => 'nullable|string',
            'options' => 'nullable|string',
            'hardware' => 'nullable|string',
            'free_gift' => 'nullable|string',
            'imei' => 'nullable|string',
            'customer_id' => 'required|exists:customers,id',
            'customer_number' => 'nullable|string',
            'phone_number' => 'nullable|string',
            'note' => 'nullable|string',
        ]);

        $validated['created_by'] = Auth::id() ?? 1; // أو حسب نظامك

        $feedback = Feedback::create($validated);

        return response()->json($feedback, 201);
    }
}