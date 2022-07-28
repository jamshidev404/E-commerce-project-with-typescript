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

export class OrderInputs {
  _id: string;

  unit: number;
}

export interface CustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
}
