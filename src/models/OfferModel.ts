import mongoose, { Schema, Document } from "mongoose";

export interface OfferDoc extends Document {

  offerType: string; // VENDOR // GENERATE
  vendors: [any]; // [' wed234klmsd ']
  title: string; // INR 200 off on week days
  description: string; 
  minValue: number; // minimum order amount should 300
  offerAmount: number;  // 200
  startValidity: Date;
  endValidity: Date;
  promocode: string;  // promo2020
  promoType: string; // USER ALL BANK CARD
  bank: any;
  bins: any;
  pincode: string;
  isActive: boolean;
}

const OfferSchema = new Schema(
  {
    offerType: { type: String, required: true },
    vendor: [
        {
            type: Schema.Types.ObjectId, ref: "vendor"
        }
    ],
    title: { type: String, required: true },
    description: String,
    minValue:{ type: Number, required: true },
    offerAmount: { type: Number, required: true },
    startValidity: Date,
    endValidity: Date,
    promocode: { type: String, required: true },
    promoType: { type: String, required: true },
    bank: [
        {
            type: String
        }
    ],
    bins: [{
        type: Number
    }],
    pincode: { type: String, required: true },
    isActive: Boolean
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

const Offer = mongoose.model<OfferDoc>("offer", OfferSchema);

export { Offer };
