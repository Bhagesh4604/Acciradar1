
import React from 'react';

export const WarningIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L1 21h22L12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
  </svg>
);

export const VisibilityOnIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 10.5c-2.48 0-4.5-2.02-4.5-4.5s2.02-4.5 4.5-4.5 4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5zm0-7C10.62 8 9.5 9.12 9.5 10.5S10.62 13 12 13s2.5-1.12 2.5-2.5S13.38 8 12 8z" />
  </svg>
);

export const AccelerometerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 3H3v18h18V3zM9 17H7v-4H5v-2h2V7h2v4h2v2H9v4zm4 0h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-2h2v2z"/>
  </svg>
);

export const GyroscopeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z" />
    <path d="M2 12c0 5.52 4.48 10 10 10s10-4.48 10-10-4.48-10-10-10S2 6.48 2 12zm2 0c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8-8-3.59-8-8z" />
  </svg>
);

export const EmergencyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 15.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM10.5 5h3v6h-3V5z" />
    <path d="M19.88 5.67a1.5 1.5 0 00-2.12 0l-5.65 5.65-1.41-1.41a1.5 1.5 0 00-2.12 2.12l2.47 2.47 5.65-5.65c.59-.58 1.54-.58 2.12 0s.59 1.54 0 2.12L12 18.29l-3.54-3.54a1.5 1.5 0 00-2.12-2.12l-1.41 1.41 5.65 5.65a1.5 1.5 0 002.12 0l7.78-7.78a1.5 1.5 0 000-2.12z" />
  </svg>
);

export const ContactsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm3 2h6v2H9V8zm0 4h6v2H9v-2zm0 4h4v2H9v-2z"/>
  </svg>
);

export const MapIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.5 3l-6.5 18-6.5-18L20.5 3zM12 10.9c-1.16 0-2.1.94-2.1 2.1s.94 2.1 2.1 2.1 2.1-.94 2.1-2.1-.94-2.1-2.1-2.1z" />
  </svg>
);

export const ProfileIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

export const BackIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
    </svg>
);
