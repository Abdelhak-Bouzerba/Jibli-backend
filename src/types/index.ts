import { Document, Types } from "mongoose";

type restaurantTags =
  | "fast-food"
  | "restaurant"
  | "traditional"
  | "healthy"
  | "pizzeria"
  | "desserts"
  | "barbcue"
  | "sandwiches";
export interface IRestaurant extends Document {
  name: string;
  description: string;
  logo: {
    url: string;
    publicId: string;
  };
  coverPhoto: {
    url: string;
    publicId: string;
  };
  phone: string;
  email: string;
  isOpen: boolean;
  isActive: boolean;
  tags: restaurantTags[];
  workingDays: {
    sunday: { open: string; close: string };
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
  };
  rating: number;
  ratingCount: number;
  location: {
    city: string;
    coordinates: {
      type: "Point";
      coordinates: [number, number]; // [lng, lat]
    };
  };
  role: "restaurant";
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct extends Document {
  restaurantId: Types.ObjectId; // Reference to the restaurant
  name: string;
  category:
    | "sandwich"
    | "burger"
    | "pizza"
    | "taco"
    | "dishes"
    | "dessert"
    | "drinks"
    | "other";
  variants: [{ size: string; price: number }];
  preparationTime: number; //in minutes
  image: {
    url: string;
    publicId: string;
  };
  description: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICustomer extends Document {
  phone: string;
  fullName: string;
  email?: string;
  role: "customer";
  savedRestaurants?: Types.ObjectId[]; // Array of restaurant IDs
  location: {
    city: string;
    coordinates: {
      type: "Point";
      coordinates: [number, number]; // [lng, lat]
    };
  };
  savedAddresses?: {
    label: string;
    city: string;
    coordinates: {
      type: "Point";
      coordinates: [number, number]; // [lng, lat]
    };
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICart extends Document {
  customerId: Types.ObjectId; // Reference to the customer
  items: {
    productId: Types.ObjectId | string; // Reference to the product
    variant: {
      size: string;
      price: number;
    };
    quantity: number;
  }[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
