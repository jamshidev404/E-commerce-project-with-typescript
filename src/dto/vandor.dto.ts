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
