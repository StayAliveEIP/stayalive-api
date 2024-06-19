import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleApiService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY;
  }

  public async geocode(address: string) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${this.apiKey}`;
    return await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  }

  public async adressSearch(placeId: string) {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${this.apiKey}`;
    return await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        return data;
      });
  }

  public async autocompleteSearch(input: string) {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${this.apiKey}`;
    return await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        return data;
      });
  }

  public async calculateFootDistance(
    originPLaceId: string,
    destinationPlaceId: string,
  ) {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=place_id:${originPLaceId}&destinations=place_id:${destinationPlaceId}&mode=walking&key=${this.apiKey}`;
    return await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  }

  public async calculateFootDistanceLatLong(
    originLat: number,
    originLong: number,
    destinationPlaceId: string,
  ) {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLat},${originLong}&destinations=place_id:${destinationPlaceId}&mode=walking&key=${this.apiKey}`;
    return await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  }

  public async placeIdToLatLongAndAddress(placeId: string) {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${this.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.result) {
      const latLong = data.result.geometry && data.result.geometry.location;
      const address = data.result.formatted_address;

      if (!latLong) {
        throw new Error('Could not get location from place ID');
      }

      if (!address) {
        throw new Error('Could not get address from place ID');
      }

      return {
        latLong,
        address,
      };
    }

    throw new Error('Invalid place ID');
  }
}
