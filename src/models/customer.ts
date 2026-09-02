import mongoose from "mongoose";
import { ICustomer } from "../types/index";

const customerSchema = new mongoose.Schema<ICustomer>({
  fullName: { type: String, required: true , trim: true },
  phone: { type: String, required: true },
  email: { type: String, required: false , trim: true },
  role: {
    type: String,
    required: true,
    enum: ["customer"],
    default: "customer",
  },
  savedRestaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" }],
  location: {
    city: { type: String, required: true },
    coordinates: {
      type: { type: String, required: true, enum: ["Point"] },
      coordinates: { type: [Number], required: true }
    }
  },
  savedAddresses: [{
    label: { type: String, required: true },
    city: { type: String, required: true },
    coordinates: {
      type: { type: String, required: true, enum: ["Point"] },
      coordinates: { type: [Number], required: true }
    }
  }]
}, {
  timestamps: true
});

const Customer = mongoose.model<ICustomer>("Customer", customerSchema);

//Create a 2dsphere index for geospatial queries
customerSchema.index({
  "location.coordinates": "2dsphere"
});

export default Customer;