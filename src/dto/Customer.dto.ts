import { IsEmail, IsEmpty, Length } from "class-validator";

export class CreateCustomerInputs {
  @IsEmail()
  email: string;

  @Length(7, 13)
  phone: string;

  @Length(6, 12)
  password: string;
}

export class UserLoginInputs {
  @IsEmail()
  email: string;

  @Length(6, 12)
  password: string;
}

export class EditCustomerProfileInputs {
  @Length(3, 25)
  firstName: string;

  @Length(3, 25)
  lastName: string;

  @Length(3, 30)
  address: string;
}

export class CartItem {
  _id: string;

  unit: number;
}

export class OrderInputs {
  txnId: string;
  amount: string;
  items: [CartItem];
}



export interface CustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
}

export class CreateDeliveryUserInputs {
  @IsEmail()
  email: string;

  @Length(7, 13)
  phone: string;

  @Length(6, 12)
  password: string;

  @Length(3, 20)
  firstName: string;

  @Length(3, 20)
  lastName: string;

  @Length(3, 30)
  address: string;

  @Length(4, 14)
  pincode: string;
}