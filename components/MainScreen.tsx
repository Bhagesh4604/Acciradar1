import React, { useState } from 'react';
import useSensors from '../hooks/useSensors';
import { AppView, SensorData, UserProfile, Contact } from '../types';
import { AccelerometerIcon, GyroscopeIcon, WarningIcon, ContactsIcon, MapIcon, ProfileIcon } from './icons';
import AccidentModal from './AccidentModal';

interface MainScreenProps {
  setView: (view: AppView) => void;
  userProfile: UserProfile;
  contacts: Contact[];
}

const SensorCard: React.FC<{ title: string; data: SensorData; icon: React.ReactNode }> = ({ title, data, icon }) => (
  <div className="bg-white p-4 rounded-xl shadow-lg w-full">
    <div className="flex items-center mb-2">
      <div className="p-2 bg-gray-100 rounded-full mr-3">{icon}</div>
      {/* Fix: Added truncate and min-w-0 to prevent the title from overflowing its container on small screens. */}
      <h3 className="font-bold text-gray-800 text-lg truncate min-w-0">{title}</h3>
    </div>
    <div className="text-left pl-2 space-y-1">
      <p className="text-sm text-gray-600">X: {data.x.toFixed(2)}</p>
      <p className="text-sm text-gray-600">Y: {data.y.toFixed(2)}</p>
      <p className="text-sm text-gray-600">Z: {data.z.toFixed(2)}</p>
    </div>
  </div>
);

const NavButton: React.FC<{ label: string; icon: React.ReactNode; onClick: () => void; color: string }> = ({ label, icon, onClick, color }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center p-3 text-center text-white rounded-xl shadow-md hover:opacity-90 transition-opacity ${color}`}>
    <div className="w-8 h-8 mb-1">{icon}</div>
    <span className="text-xs font-bold">{label}</span>
  </button>
);


const MainScreen: React.FC<MainScreenProps> = ({ setView, userProfile, contacts }) => {
  const { 
    accelerometerData, 
    gyroscopeData, 
    isMonitoring, 
    accidentDetected, 
    permissionState, 
    requestPermissions, 
    resetAccident,
    toggleMonitoring,
    sensorError
  } = useSensors();
  const [manualReport, setManualReport] = useState(false);

  const handleManualReport = () => {
    setManualReport(true);
  };
  
  const resetAllReports = () => {
      resetAccident();
      setManualReport(false);
  }

  if (permissionState === 'prompt' || permissionState === 'denied') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-gray-50">
        <WarningIcon className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Permissions Required</h2>
        <p className="text-gray-600 mb-6">
          This app needs access to your device's motion sensors to detect potential accidents. 
          {permissionState === 'denied' && " Please enable motion sensor permissions in your browser settings."}
        </p>
        <button 
          onClick={requestPermissions}
          className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Grant Permissions
        </button>
      </div>
    );
  }

  const showModal = accidentDetected || manualReport;

  return (
    <div className="flex flex-col h-full bg-gray-50 p-5">
      {showModal && <AccidentModal resetAccident={resetAllReports} userProfile={userProfile} emergencyContacts={contacts}/>}
      
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
            <WarningIcon className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-800">AcciRadar</h1>
        </div>
        <button onClick={toggleMonitoring} className={`flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold text-sm shadow ${isMonitoring ? 'bg-green-500' : 'bg-red-500'}`}>
            <div className="w-3 h-3 bg-white rounded-full"></div>
            {isMonitoring ? 'ON' : 'OFF'}
        </button>
      </header>
      
      {sensorError && (
          <div className="p-3 mb-4 rounded-lg bg-yellow-100 border border-yellow-400 text-center">
            <p className="text-sm font-semibold text-yellow-800">{sensorError}</p>
          </div>
      )}

      <main className="flex-grow flex flex-col items-center justify-around">
        <div className="grid grid-cols-2 gap-5 w-full">
          <SensorCard title="Accelerometer" data={accelerometerData} icon={<AccelerometerIcon className="w-6 h-6 text-blue-500" />} />
          <SensorCard title="Gyroscope" data={gyroscopeData} icon={<GyroscopeIcon className="w-6 h-6 text-purple-500" />} />
        </div>
        
        <button 
          onClick={handleManualReport}
          className="flex items-center justify-center gap-3 bg-red-500 text-white font-bold py-5 px-8 rounded-2xl shadow-lg transition-transform transform hover:scale-105"
        >
          <span className="text-2xl">*</span>
          <span className="text-lg">REPORT ACCIDENT</span>
        </button>

        <div className="grid grid-cols-3 gap-5 w-full">
            <NavButton label="Contacts" icon={<ContactsIcon className="w-full h-full" />} onClick={() => setView(AppView.Contacts)} color="bg-teal-500"/>
            <NavButton label="Map" icon={<MapIcon className="w-full h-full" />} onClick={() => setView(AppView.Map)} color="bg-yellow-500"/>
            <NavButton label="Profile" icon={<ProfileIcon className="w-full h-full" />} onClick={() => setView(AppView.Profile)} color="bg-purple-600"/>
        </div>
      </main>
    </div>
  );
};

export default MainScreen;