import React, { useState } from 'react';
import { AppView, Contact, UserProfile } from './types';
import MainScreen from './components/MainScreen';
import MapScreen from './components/MapScreen';
import ContactsScreen from './components/ContactsScreen';
import ProfileScreen from './components/ProfileScreen';

const initialContacts: Contact[] = [
  { id: 1, name: 'Local Emergency', relation: 'Services', phone: '+1911', isPrimary: true }, // Note: 911 is not a valid SMS number, use a real one for testing
  { id: 2, name: 'Jane Doe', relation: 'Spouse', phone: '+15550101' },
  { id: 3, name: 'John Smith', relation: 'Father', phone: '+15550102' },
];

const initialProfile: UserProfile = {
  name: 'Alex Rider',
  phone: '+15550199',
  dob: '1995-04-21',
  bloodType: 'O+',
  allergies: 'Peanuts',
  medicalConditions: 'Asthma',
};


const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.Main);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialProfile);
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);

  const renderView = () => {
    switch (view) {
      case AppView.Map:
        return <MapScreen setView={setView} />;
      case AppView.Contacts:
        return <ContactsScreen setView={setView} contacts={contacts} setContacts={setContacts} />;
      case AppView.Profile:
        return <ProfileScreen setView={setView} userProfile={userProfile} setUserProfile={setUserProfile} />;
      case AppView.Main:
      default:
        return <MainScreen setView={setView} userProfile={userProfile} contacts={contacts} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-800 flex justify-center items-center">
      <div className="container mx-auto h-full max-w-sm bg-white shadow-2xl overflow-hidden">
        {renderView()}
      </div>
    </div>
  );
};

export default App;