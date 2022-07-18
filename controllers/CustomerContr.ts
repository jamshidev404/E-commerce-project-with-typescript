import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToClass, plainToInstance } from "class-transformer";
import { CreateCustomerInputs } from "../dto/Customer.dto";
import { GeneratePassword, GenerateSalt, GenerateSignature } from "../utility/PasswordUtility";
import { Customer } from "../models/CustomerModel";
import { GenerateOTP, onRequestOTP } from "../utility/NotificationUtility";

export const CustomerSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInputs = plainToInstance(CreateCustomerInputs, req.body);

  const inputError = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (inputError.length > 0) {
    return res.status(400).json(inputError);
  }

  const { email, phone, password } = customerInputs;

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const {otp, expires} = await GenerateOTP();

  const result = await Customer.create({
    lastName: "",
    firstName: "",
    address: "",
    email: email,
    password: userPassword,
    verified: false,
    phone: phone,
    salt: salt,
    otp: otp,
    otp_expires: expires,
    lat: 0,
    lng: 0,
  });

  if(result) {
    // send OTP tu custom
    await onRequestOTP(otp, phone)

    //generate the signature
    const signature = GenerateSignature({
        _id: result._id,
        email: result.email,
        verified: result.verified
    })

    // send the result to client
    return res.status(201).json({ signature: signature, verified: result.verified, email: result.email })
  }

  return res.status(400).json({ message: "Error with signup" })

};

export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const EditCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
