
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const BASE_URL = 'https://maps.googleapis.com/maps/api';

// Validate required environment variables
if (!API_KEY) {
  throw new Error('GOOGLE_MAPS_API_KEY environment variable is required');
}

interface GeocodeResponse {
  results: Array<{
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }>;
  status: string;
}

interface PlacesResponse {
  results: Array<{
    name: string;
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    place_id: string;
    rating?: number;
    types: string[];
  }>;
  status: string;
}

interface DistanceMatrixResponse {
  rows: Array<{
    elements: Array<{
      distance: {
        text: string;
        value: number;
      };
      duration: {
        text: string;
        value: number;
      };
      status: string;
    }>;
  }>;
  status: string;
}

export class GoogleMapsClient {
  private static instance: GoogleMapsClient;
  private apiKey: string;

  private constructor() {
    this.apiKey = API_KEY!;
  }

  public static getInstance(): GoogleMapsClient {
    if (!GoogleMapsClient.instance) {
      GoogleMapsClient.instance = new GoogleMapsClient();
    }
    return GoogleMapsClient.instance;
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, string>): Promise<T> {
    const queryParams = new URLSearchParams({
      ...params,
      key: this.apiKey,
    });

    const response = await fetch(`${BASE_URL}/${endpoint}?${queryParams}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`Google Maps API error: ${response.status} ${errorData?.error_message || response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Maps API error: ${data.status} ${data.error_message || ''}`);
    }

    return data as T;
  }

  public async geocode(address: string): Promise<GeocodeResponse> {
    return this.makeRequest<GeocodeResponse>('geocode/json', {
      address,
    });
  }

  public async searchPlaces(query: string, location?: { lat: number; lng: number }, radius?: number): Promise<PlacesResponse> {
    const params: Record<string, string> = {
      query,
      type: 'restaurant',
    };

    if (location) {
      params.location = `${location.lat},${location.lng}`;
    }

    if (radius) {
      params.radius = radius.toString();
    }

    return this.makeRequest<PlacesResponse>('place/textsearch/json', params);
  }

  public async getDistanceMatrix(
    origins: string[],
    destinations: string[],
    mode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'driving'
  ): Promise<DistanceMatrixResponse> {
    return this.makeRequest<DistanceMatrixResponse>('distancematrix/json', {
      origins: origins.join('|'),
      destinations: destinations.join('|'),
      mode,
    });
  }

  public async getPlaceDetails(placeId: string): Promise<unknown> {
    return this.makeRequest('place/details/json', {
      place_id: placeId,
      fields: 'name,formatted_address,geometry,rating,opening_hours,website,formatted_phone_number,price_level,types',
    });
  }
}
