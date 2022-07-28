import mongoose, { Schema, Document } from "mongoose";
import { OrderDoc } from "./OrderModel";

export interface CustomerDoc extends Document {
  lastName: string;
  firstName: string;
  address: string;
  email: string;
  password: string;
  verified: boolean;
  phone: string;
  salt: string;
  otp: number;
  otp_expires: Date;
  lat: number;
  lng: number;
  cart: [any];
  orders: [OrderDoc];
}

const CustomerSchema = new Schema(
  {
    firstname: { type: String },
    lastName: { type: String },
    address: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    salt: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number },
    verified: { type: Number, required: true },
    otp: { type: Number, required: true },
    otp_expires: { type: Number, required: true },
    cart: [
      {
        food: {
          type: Schema.Types.ObjectId,
          ref: "food",
          required: true,
        },
        unit: { type: Number, required: true },
      },
    ],
    order: [
      {
        type: Schema.Types.ObjectId,
        ref: "order",
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Customer = mongoose.model<CustomerDoc>("customer", CustomerSchema);

export { Customer };
