export class GeoCoordinates {
  constructor(
    public latitude: number,
    public longitude: number,
  ) {}
}

// Function to calculate distance between two points in kilometers
export const getDistanceInKilometers = (
  point1: GeoCoordinates,
  point2: GeoCoordinates,
): number => {
  const earthRadiusInKilometers = 6371; // Earth's radius in kilometers
  const { latitude: lat1, longitude: lon1 } = point1;
  const { latitude: lat2, longitude: lon2 } = point2;

  // Convert latitude and longitude from degrees to radians
  const lat1Rad = toRadians(lat1);
  const lon1Rad = toRadians(lon1);
  const lat2Rad = toRadians(lat2);
  const lon2Rad = toRadians(lon2);

  // Haversine formula
  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadiusInKilometers * c;
  return Math.abs(distance);
};

const toRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};
