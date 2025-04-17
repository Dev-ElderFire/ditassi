
/**
 * Utility functions for geolocation handling
 */

import { GeoLocation } from "@/types";

/**
 * Get current user location using browser's Geolocation API
 */
export async function getCurrentLocation(): Promise<GeoLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        reject(new Error(`Failed to get location: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * Format a geolocation to display
 */
export function formatLocation(location: GeoLocation): string {
  if (location.address) {
    return location.address;
  }
  
  return `Lat: ${location.latitude.toFixed(6)}, Long: ${location.longitude.toFixed(6)}`;
}

/**
 * Calculate distance between two points in kilometers
 * Uses the Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

/**
 * Convert degrees to radians
 */
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Check if location is within a specified radius
 */
export function isWithinRadius(
  location1: GeoLocation,
  location2: GeoLocation,
  radiusKm: number
): boolean {
  const distance = calculateDistance(
    location1.latitude,
    location1.longitude,
    location2.latitude,
    location2.longitude
  );
  
  return distance <= radiusKm;
}

/**
 * Mock function to get address from coordinates
 * In a real app, this would call a geocoding service like Google Maps
 */
export async function getAddressFromCoordinates(
  latitude: number,
  longitude: number
): Promise<string> {
  // This is a mock function
  // In a real implementation, you would call a geocoding API
  return `Location at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}
