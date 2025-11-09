import React, { useState, useEffect, useRef } from 'react';
import { Contact, UserProfile } from '../types';
import { reportAccident } from '../services/twilioService'; // Updated import
import { WarningIcon } from './icons';

interface AccidentModalProps {
  resetAccident: () => void;
  userProfile: UserProfile;
  emergencyContacts: Contact[];
}

const COUNTDOWN_SECONDS = 15;

const AccidentModal: React.FC<AccidentModalProps> = ({ resetAccident, userProfile, emergencyContacts }) => {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setCountdown((prev) => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const sendAlerts = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSending(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const payload = {
            userProfile,
            location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            },
            emergencyContacts
        };
        
        console.log("Sending accident report to backend:", payload);

        try {
          const response = await reportAccident(payload);
          if (response.success) {
            setSendStatus('sent');
          } else {
            setSendStatus('error');
          }
        } catch (error) {
          console.error("Failed to send alerts via backend:", error);
          setSendStatus('error');
        } finally {
          setIsSending(false);
        }
      },
      async (error) => {
        console.error("Could not get location for emergency alert. Reporting without location.", error);
        const payload = { userProfile, location: null, emergencyContacts };
        try {
            const response = await reportAccident(payload);
            if(response.success){
                setSendStatus('sent');
            } else {
                setSendStatus('error');
            }
        } catch (e) {
             setSendStatus('error');
        } finally {
            setIsSending(false);
        }
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    if (countdown === 0 && sendStatus === 'idle' && !isSending) {
      sendAlerts();
    }
  }, [countdown, sendStatus, isSending]);

  const handleImOk = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    resetAccident();
  };
  
  const progress = (countdown / COUNTDOWN_SECONDS) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-sm w-full text-center transform transition-all animate-fade-in-up">
        <WarningIcon className="w-20 h-20 text-red-500 mx-auto animate-pulse" />

        <h2 className="text-3xl font-extrabold text-gray-900 mt-4">Accident Detected!</h2>

        {sendStatus === 'idle' && (
          <>
            <p className="text-gray-600 mt-2">Emergency services will be contacted in:</p>
            <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto my-6">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle className="text-gray-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50"/>
                <circle
                  className="text-red-500 transition-all duration-1000 ease-linear"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 45}
                  strokeDashoffset={(2 * Math.PI * 45) * (1 - progress / 100)}
                  strokeLinecap="round" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-4xl md:text-5xl font-bold text-red-600">
                {countdown}
              </span>
            </div>
            <div className="flex flex-col gap-3">
                <button
                  onClick={handleImOk}
                  className="w-full bg-green-500 text-white font-bold py-3 rounded-lg shadow-md hover:bg-green-600 text-lg"
                >
                  I'm Safe
                </button>
                 <button
                  onClick={sendAlerts}
                  className="w-full bg-red-500 text-white font-bold py-3 rounded-lg shadow-md hover:bg-red-600 text-lg"
                >
                  Call Now
                </button>
            </div>
          </>
        )}

        {isSending && <p className="mt-6 text-blue-600 font-semibold">Sending alerts...</p>}
        
        {sendStatus === 'sent' && (
          <div className="mt-6">
            <p className="font-bold text-xl text-green-600">Alerts Sent!</p>
            <p className="text-gray-600 mt-2">Your emergency contacts have been notified.</p>
            <button onClick={resetAccident} className="mt-6 bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg">
              Close
            </button>
          </div>
        )}

        {sendStatus === 'error' && (
          <div className="mt-6">
            <p className="font-bold text-xl text-red-600">Failed to Send Alerts</p>
            <p className="text-gray-600 mt-2">Could not connect to the server. Please check your connection.</p>
             <button onClick={resetAccident} className="mt-6 bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccidentModal;
