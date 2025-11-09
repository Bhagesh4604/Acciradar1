// Fix: Removed self-import of 'UserProfile' which conflicted with the local interface declaration.
// Fix: Removed import for 'emergencyContacts' as it is not exported from './components/ContactsScreen' and was unused.
export interface SensorData {
  x: number;
  y: number;
  z: number;
}

export interface Contact {
  id: number;
  name: string;
  relation: string;
  phone: string;
  isPrimary?: boolean;
}

export interface UserProfile {
    name: string;
    phone: string;
    dob: string;
    bloodType: string;
    allergies: string;
    medicalConditions: string;
}

// Fix: Added optional 'uri' property to support linking to maps from grounding chunks.
export interface Hospital {
  name: string;
  lat: number;
  lon: number;
  uri?: string;
}

export enum AppView {
  Main = 'main',
  Map = 'map',
  Contacts = 'contacts',
  Profile = 'profile',
}
