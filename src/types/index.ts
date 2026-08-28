import { Document , Types} from "mongoose";

type restaurantTags = 'fast-food' | 'restaurant' | 'traditional' | 'healthy' | 'pizzeria' | 'desserts' | 'barbcue' | 'sandwiches';
export interface IRestaurant extends Document {
  name: string;
  logo: {
    url: string;
    publicId: string;
  };
  phone: string;
  email: string;
  isOpen: boolean;
  isActive: boolean;
  tags: restaurantTags[];
  workingHours: {
    open: string; // e.g., "09:00"
    close: string; // e.g., "21:00"
  };
  rating: number;
  ratingCount: number;
  location: {
    address: string;
    coordinates: {
      type: "Point";
      coordinates: [number, number]; // [lng, lat]
    };
  };
  role: 'restaurant';
  createdAt: Date;
  updatedAt: Date;

};

export interface IProduct extends Document {
  restaurantId: Types.ObjectId;  // Reference to the restaurant
  name: string;
  category: 'sandwich' |'burger' | 'pizza' | 'taco' | 'dishes' | 'dessert' | 'drinks' | 'other';
  price: number;
  preparationTime: number; //in minutes
  image: {
    url: string;
    publicId: string;
  };
  description: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
};