import { createClient } from '@google/maps';

export const geocodeLocation = (locationString) => {
  return new Promise((resolve, reject) => {
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: locationString }, (results, status) => {
      if (status === "OK") {
        const location = results[0].geometry.location;
        resolve({ lat: location.lat(), lng: location.lng() });
      } else {
        reject("Geocode was not successful for the following reason: " + status);
      }
    });
  });
};