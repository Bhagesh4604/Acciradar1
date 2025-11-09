// This service now communicates with YOUR secure backend, not directly with Twilio.

const BACKEND_URL = 'http://localhost:3001/api/report-accident';

interface AccidentPayload {
  userProfile: any;
  location: { latitude: number; longitude: number } | null;
  emergencyContacts: any[];
}

/**
 * Sends the complete accident data payload to the backend server.
 * The backend server will then securely use the Twilio API to send SMS messages.
 * @param payload - The accident data object.
 * @returns A promise that resolves to an object indicating success or failure.
 */
export const reportAccident = async (payload: AccidentPayload): Promise<{ success: boolean; message: string }> => {
  console.log('--- SENDING ACCIDENT REPORT TO BACKEND ---');
  console.log('URL:', BACKEND_URL);
  console.log('Payload:', payload);

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Backend responded with an error:', result);
      return { success: false, message: result.message || 'An error occurred on the server.' };
    }
    
    console.log('Backend response:', result);
    return { success: true, message: result.message };

  } catch (error) {
    console.error('Failed to connect to the backend server.', error);
    // This error typically happens if the backend server is not running.
    return { success: false, message: 'Could not connect to the server.' };
  }
};
