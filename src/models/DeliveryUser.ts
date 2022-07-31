import mongoose, { Schema, Document } from "mongoose";

export interface DeliveryDoc extends Document {
  lastName: string;
  firstName: string;
  address: string;
  email: string;
  password: string;
  verified: boolean;
  pincode: string;
  phone: string;
  salt: string;
  lat: number;
  lng: number;
  isAvailable: boolean;
}

const DeliverySchema = new Schema(
  {
    firstname: { type: String },
    lastName: { type: String },
    pincode: { type: String },
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
    isAvailable: { type: Boolean }
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

const DeliveryUser = mongoose.model<DeliveryDoc>("delivery", DeliverySchema);

export { DeliveryUser };
