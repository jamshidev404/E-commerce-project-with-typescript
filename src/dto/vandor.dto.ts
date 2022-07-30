export interface CreateVandorInput {
  name: String;
  ownerName: String;
  foodType: [String];
  pincode: String;
  address: String;
  email: String;
  password: string;
  phone: String;
}

export interface EditVandorInputs {
  name: string;
  address: string;
  phone: string;
  foodTypes: [string]
}

export interface VandorLoginInput {
  email: string;
  password: string;
}

export interface VandorPayload {
  _id: string;
  email: string;
  name: string;
  password: string;
  foodTypes: [string];
}

export interface CreateOfferInputs {
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