import mongoose, { Schema, Document, Model } from "mongoose";

interface VandorDoc extends Document {
  name: String;
  ownerName: String;
  foodType: [String];
  pincode: String;
  address: String;
  email: String;
  password: String;
  phone: String;
  salt: String;
  serviceAvaivable: String;
  coverImage: [String];
  rating: number;
  //foods: any;
}

const VandorSchema = new Schema({
  name: { type: String, required: true },
  ownerName: { type: String, required: true },
  foodType: { type: [String] },
  pincode: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  salt: { type: String, required: true },
  serviceAvaivable: { type: Boolean },
  coverImage: { type: [String] },
  rating: { type: Number },
//   foods: [
//     {
//       type: mongoose.SchemaTypes.ObjectId,
//       ref: "food",
//     },
//   ],
},
{
    timestamps: true
}
);

const Vandor = mongoose.model<VandorDoc>('vandor', VandorSchema);

export { Vandor }