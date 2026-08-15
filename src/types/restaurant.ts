import { Document } from "mongoose";

export interface IRestaurant extends Document {
  name: string;
  logoUrl: string;
  phone: string;
  isOpen: boolean;
  rating: number;
  ratingCount: number;
  location: {
    address: string;
    coordinates: {
      type: "Point";
      coordinates: [number, number]; // [lng, lat]
    };
  };
}