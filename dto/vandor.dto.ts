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

export interface VandorLoginInput {
  email: string;
  password: string;
}
