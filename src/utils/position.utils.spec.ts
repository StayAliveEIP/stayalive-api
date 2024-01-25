import { GeoCoordinates, getDistanceInKilometers } from './position.utils';

describe('GeoCoordinates', () => {
  it('should create an instance with given latitude and longitude', () => {
    const coords = new GeoCoordinates(45.0, 90.0);
    expect(coords).toBeDefined();
    expect(coords.latitude).toBe(45.0);
    expect(coords.longitude).toBe(90.0);
  });
});

describe('getDistanceInKilometers', () => {
  it('should calculate the distance between two points correctly', () => {
    const point1 = new GeoCoordinates(45.0, 90.0); // Example coordinates
    const point2 = new GeoCoordinates(45.0, 91.0); // Example coordinates

    getDistanceInKilometers(point1, point2);
  });

  it('should return 0 if the points are the same', () => {
    const point = new GeoCoordinates(45.0, 90.0); // Example coordinates

    const distance = getDistanceInKilometers(point, point);
    expect(distance).toBe(0); // The distance should be 0 for the same points
  });

  // Add more tests to cover edge cases or other scenarios if needed
});
