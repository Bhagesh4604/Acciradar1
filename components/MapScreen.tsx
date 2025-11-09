import React, { useState, useEffect, useRef } from 'react';
import { AppView } from '../types';
import { BackIcon } from './icons';
import L from 'leaflet';

// Define custom icons for markers
const hospitalIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const policeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


interface MapScreenProps {
  setView: (view: AppView) => void;
}

const MapScreen: React.FC<MapScreenProps> = ({ setView }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const serviceMarkers = useRef<L.LayerGroup>(new L.LayerGroup());
  const userMarker = useRef<L.Marker | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      mapInstance.current = L.map(mapContainer.current).setView([51.505, -0.09], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current);
      serviceMarkers.current.addTo(mapInstance.current);
      // Attempt to get user's location on initial load
      handleGetLocation();
    }
  }, []);
  
  const clearServiceMarkers = () => {
    serviceMarkers.current.clearLayers();
  };

  const findAndDisplayServices = async (lat: number, lon: number, type: 'hospital' | 'police') => {
    const BBOX_SIZE = 0.1; // Approx 10km bounding box
    const viewbox = `${lon - BBOX_SIZE},${lat + BBOX_SIZE},${lon + BBOX_SIZE},${lat - BBOX_SIZE}`;
    const url = `https://nominatim.openstreetmap.org/search?q=${type}&format=json&viewbox=${viewbox}&bounded=1&limit=10`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(`Found ${data.length} ${type}(s) near ${lat},${lon}`);

        if (data.length === 0) {
            console.warn(`No ${type}s found nearby.`);
            return;
        }

        const icon = type === 'hospital' ? hospitalIcon : policeIcon;
        
        data.forEach((place: any) => {
            const marker = L.marker([place.lat, place.lon], { icon: icon });
            
            const originLat = userMarker.current ? userMarker.current.getLatLng().lat : lat;
            const originLon = userMarker.current ? userMarker.current.getLatLng().lng : lon;

            const placeName = place.display_name.split(',')[0];
            const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLon}&destination=${place.lat},${place.lon}`;
            
            // Use a robust HTML string to create the popup content
            const popupHtml = `
              <div style="font-family: Inter, sans-serif; text-align: left;">
                <p style="font-weight: bold; margin: 0 0 5px 0; font-size: 1rem;">${placeName}</p>
                <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; font-weight: 600; text-decoration: underline;">
                  Get Directions
                </a>
              </div>
            `;

            marker.bindPopup(popupHtml);
            serviceMarkers.current.addLayer(marker);
        });
    } catch (e) {
        console.error(`Failed to fetch ${type}s:`, e);
        setError(`Could not fetch nearby ${type}s.`);
    }
  };


  const setLocation = (lat: number, lon: number) => {
    if (!mapInstance.current) return;
    const newLocation = new L.LatLng(lat, lon);
    mapInstance.current.setView(newLocation, 14);
    
    if (userMarker.current) {
      userMarker.current.setLatLng(newLocation);
    } else {
      userMarker.current = L.marker(newLocation, { icon: userIcon }).addTo(mapInstance.current);
      userMarker.current.bindPopup("Your Location");
    }

    clearServiceMarkers();
    findAndDisplayServices(lat, lon, 'hospital');
    findAndDisplayServices(lat, lon, 'police');
  };

  const handleGetLocation = () => {
    setError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.error(err);
setError("Could not get your location. Please enable location services.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setError(null);

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.length > 0) {
            setLocation(parseFloat(data[0].lat), parseFloat(data[0].lon));
        } else {
            setError("Location not found.");
        }
    } catch (e) {
        console.error("Search failed:", e);
        setError("Failed to perform search.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <header className="flex items-center p-4 bg-white shadow-md shrink-0 z-10">
        <button onClick={() => setView(AppView.Main)} className="p-2 rounded-full hover:bg-gray-200">
          <BackIcon className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 ml-4">Accident Map</h1>
      </header>
      
      <div id="map" ref={mapContainer} className="flex-grow"></div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm z-[1000] shadow-t-lg">
        {error && <p className="text-red-500 text-center text-sm mb-2">{error}</p>}
        <form onSubmit={handleSearch} className="flex gap-2 mb-2">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a location..."
                className="flex-grow p-2 border rounded-md"
            />
            <button type="submit" className="bg-blue-500 text-white font-semibold p-2 px-4 rounded-md">Search</button>
        </form>
        <button onClick={handleGetLocation} className="w-full bg-green-500 text-white font-bold py-3 rounded-lg">
            Get My Current Location
        </button>
      </div>
    </div>
  );
};

export default MapScreen;
