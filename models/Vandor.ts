import mongoose, { Schema, Document} from "mongoose";

interface VandorDoc extends Document {
  name: string;
  ownerName: string;
  foodTypes: [string];
  pincode: String;
  address: String;
  email: string;
  password: string;
  phone: String;
  salt: string;
  serviceAvaivable: boolean;
  coverImage: [String];
  rating: number;
  foods: any;
}

const VandorSchema = new Schema(
  {
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodType: { type: [String] },
    pincode: { type: String, required: true },
    address: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    salt: { type: String, required: true },
    serviceAvaivable: { type: Boolean },
    coverImage: { type: [String] },
    rating: { type: Number },
    foods: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "food",
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

const Vandor = mongoose.model<VandorDoc>("vandor", VandorSchema);

export { Vandor };
