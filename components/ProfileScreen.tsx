import React, { useState, useEffect } from 'react';
import { AppView, UserProfile } from '../types';
import { BackIcon, ProfileIcon } from './icons';

interface ProfileScreenProps {
  setView: (view: AppView) => void;
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
}

const ProfileField: React.FC<{ label: string; value: string; isEditing?: boolean; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; name: string; type?: string }> = ({ label, value, isEditing, onChange, name, type = 'text' }) => (
  <div className="py-3 border-b">
    <label className="text-sm font-semibold text-gray-500">{label}</label>
    {isEditing ? (
      <input type={type} name={name} value={value} onChange={onChange} className="w-full p-2 mt-1 border rounded-md" />
    ) : (
      <p className="text-gray-800 text-lg">{value || 'Not set'}</p>
    )}
  </div>
);

const ProfileScreen: React.FC<ProfileScreenProps> = ({ setView, userProfile, setUserProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(userProfile);

  useEffect(() => {
    setFormData(userProfile);
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setUserProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="flex items-center justify-between p-4 bg-white shadow-md shrink-0">
        <div className="flex items-center">
            <button onClick={() => setView(AppView.Main)} className="p-2 rounded-full hover:bg-gray-200">
              <BackIcon className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-800 ml-4">My Profile</h1>
        </div>
        {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg">Edit</button>
        ) : (
            <button onClick={handleSave} className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg">Save</button>
        )}
      </header>

      <main className="flex-grow p-6 overflow-y-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mb-4">
            <ProfileIcon className="w-16 h-16 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{formData.name}</h2>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md space-y-2">
            <ProfileField label="Full Name" name="name" value={formData.name} isEditing={isEditing} onChange={handleChange} />
            <ProfileField label="Phone Number" name="phone" value={formData.phone} isEditing={isEditing} onChange={handleChange} />
            <ProfileField label="Date of Birth" name="dob" value={formData.dob} isEditing={isEditing} onChange={handleChange} type="date"/>
            <ProfileField label="Blood Type" name="bloodType" value={formData.bloodType} isEditing={isEditing} onChange={handleChange} />
            <ProfileField label="Allergies" name="allergies" value={formData.allergies} isEditing={isEditing} onChange={handleChange} />
            <ProfileField label="Medical Conditions" name="medicalConditions" value={formData.medicalConditions} isEditing={isEditing} onChange={handleChange} />
        </div>
      </main>
    </div>
  );
};

export default ProfileScreen;