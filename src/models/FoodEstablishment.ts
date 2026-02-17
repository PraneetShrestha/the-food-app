export interface FoodEstablishment {
  _id?: string;
  name: string;
  type: 'restaurant' | 'cafe' | 'diner' | 'bistro' | 'food-truck' | 'pub' | 'other';
  cuisine: string[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  operatingHours: {
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    open: string; // Format: "HH:mm"
    close: string; // Format: "HH:mm"
    isClosed: boolean;
  }[];
  features: {
    delivery: boolean;
    takeout: boolean;
    dineIn: boolean;
    reservations: boolean;
    parking: boolean;
    wheelchairAccessible: boolean;
    outdoorSeating: boolean;
    wifi: boolean;
  };
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  ratings: {
    average: number;
    count: number;
  };
  menu?: {
    categories: {
      name: string;
      items: {
        name: string;
        description: string;
        price: number;
        dietaryInfo?: {
          vegetarian?: boolean;
          vegan?: boolean;
          glutenFree?: boolean;
          containsNuts?: boolean;
        };
      }[];
    }[];
  };
  photos?: string[]; // URLs to photos
  createdAt: Date;
  updatedAt: Date;
} 