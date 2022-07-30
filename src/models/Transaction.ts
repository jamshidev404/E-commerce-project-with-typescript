import { isString } from "class-validator";
import mongoose, { Schema, Document } from "mongoose";

export interface TransactionDoc extends Document {
  orderId: string;
  vendorId: string;
  orderValue: number;
  custom: string;
  offerUsed: string;
  status: string;
  paymentMode: string;
  paymentResponse: string;
}

const TransactionSchema = new Schema(
  {
    orderId: String,
    vendorId: String,
    orderValue: Number,
    custom: String,
    offerUsed: String,
    status: String,
    paymentMode: String,
    paymentResponse: String,
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

const Transaction = mongoose.model<TransactionDoc>(
  "transaction",
  TransactionSchema
);

export { Transaction };
