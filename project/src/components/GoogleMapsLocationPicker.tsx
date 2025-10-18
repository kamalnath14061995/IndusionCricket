import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useLoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { MapPin, Search, X } from 'lucide-react';
import { config } from '../config/env';

interface GoogleMapsLocationPickerProps {
  value: string;
  onChange: (location: string) => void;
  placeholder?: string;
  className?: string;
}

const libraries: ("places")[] = ["places"];

const GoogleMapsLocationPicker: React.FC<GoogleMapsLocationPickerProps> = ({
  value,
  onChange,
  placeholder = "Search for a location...",
  className = ""
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // Default to India center
  const [showMap, setShowMap] = useState(false);
  const autocompleteRef = useRef<any>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: config.googleMaps.apiKey,
    libraries,
  });

  // Parse existing value to get coordinates
  React.useEffect(() => {
    if (value && value.includes(',')) {
      const parts = value.split(',');
      if (parts.length >= 2) {
        const lat = parseFloat(parts[0].trim());
        const lng = parseFloat(parts[1].trim());
        if (!isNaN(lat) && !isNaN(lng)) {
          setSelectedLocation({ lat, lng, address: value });
          setMapCenter({ lat, lng });
        }
      }
    }
  }, [value]);

  const onMapClick = useCallback((event: any) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      // Reverse geocode to get address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const address = results[0].formatted_address;
          const locationString = `${lat.toFixed(6)},${lng.toFixed(6)}|${address}`;
          setSelectedLocation({ lat, lng, address });
          onChange(locationString);
        } else {
          const locationString = `${lat.toFixed(6)},${lng.toFixed(6)}`;
          setSelectedLocation({ lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
          onChange(locationString);
        }
      });
    }
  }, [onChange]);

  const onPlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || place.name || '';

        const locationString = `${lat.toFixed(6)},${lng.toFixed(6)}|${address}`;
        setSelectedLocation({ lat, lng, address });
        setMapCenter({ lat, lng });
        onChange(locationString);
        setShowMap(true);
      }
    }
  };

  const clearLocation = () => {
    setSelectedLocation(null);
    onChange('');
    setShowMap(false);
  };

  if (loadError) {
    return (
      <div className={`border rounded-md px-3 py-2 bg-red-50 border-red-200 ${className}`}>
        <p className="text-red-600 text-sm">Error loading Google Maps. Please check your API key.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`border rounded-md px-3 py-2 bg-gray-50 ${className}`}>
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-600">Loading Google Maps...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Autocomplete
          onLoad={(autocomplete) => {
            autocompleteRef.current = autocomplete;
          }}
          onPlaceChanged={onPlaceSelect}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={placeholder}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {selectedLocation && (
              <button
                onClick={clearLocation}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </Autocomplete>
      </div>

      {/* Selected Location Display */}
      {selectedLocation && (
        <div className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800 truncate">
              {selectedLocation.address}
            </span>
          </div>
          <button
            onClick={() => setShowMap(!showMap)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
        </div>
      )}

      {/* Map */}
      {showMap && (
        <div className="border rounded-md overflow-hidden">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '300px' }}
            center={mapCenter}
            zoom={15}
            onClick={onMapClick}
            options={{
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
            }}
          >
            {selectedLocation && (
              <Marker
                position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                title={selectedLocation.address}
              />
            )}
          </GoogleMap>
        </div>
      )}

      {/* Instructions */}
      <p className="text-xs text-gray-500">
        Search for a location or click on the map to select a position. The location will be saved as coordinates with address.
      </p>
    </div>
  );
};

export default GoogleMapsLocationPicker;
