/**
 * Haversine formula — calculates the great-circle distance between two GPS coordinates.
 * Runs entirely on-device for privacy and speed.
 *
 * @returns Distance in metres
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in metres
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Format distance in a human-friendly way.
 */
export function formatDistance(metres: number): string {
  if (metres < 100) return `${Math.round(metres)}m away`;
  if (metres < 1000) return `${Math.round(metres / 10) * 10}m away`;
  if (metres < 10000) return `${(metres / 1000).toFixed(1)}km away`;
  return `${Math.round(metres / 1000)}km away`;
}

/**
 * Generate a random offset from a centre coordinate (for mock data).
 * @param range - approximate range in metres
 */
export function randomOffset(
  lat: number,
  lon: number,
  rangeMetres: number = 2000
): { latitude: number; longitude: number } {
  const latOffset = ((Math.random() - 0.5) * rangeMetres * 2) / 111000;
  const lonOffset = ((Math.random() - 0.5) * rangeMetres * 2) / (111000 * Math.cos((lat * Math.PI) / 180));
  return {
    latitude: lat + latOffset,
    longitude: lon + lonOffset,
  };
}
