import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToClass, plainToInstance } from "class-transformer";
import { CreateCustomerInputs, UserLoginInputs } from "../dto/Customer.dto";
import {
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} from "../utility/PasswordUtility";
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

  const { otp, expires } = await GenerateOTP();

  const existsCustomer = await Customer.findOne({ email: email });

  if (existsCustomer !== null) {
    return res
      .status(409)
      .json({ message: "An user exist with te privided email ID" });
  }

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

  if (result) {
    // send OTP tu custom
    await onRequestOTP(otp, phone);

    //generate the signature
    const signature = GenerateSignature({
      _id: result._id,
      email: result.email,
      verified: result.verified,
    });

    // send the result to client
    return res.status(201).json({
      signature: signature,
      verified: result.verified,
      email: result.email,
    });
  }

  return res.status(400).json({ message: "Error with signup" });
};

export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

    const loginInputs = plainToClass(UserLoginInputs, req.body);

    const loginErrors = await validate(loginInputs, { validationError: { target: false }} )

    if (loginErrors.length > 0 ) {
        return res.status(400).json(loginErrors)
    }
    const { email, password} = loginInputs;
    const customer = await Customer.findOne({ email: email })

    if (customer) {

        const validation = await ValidatePassword(password, customer.password, customer.salt);

        if(validation) {

            // generate the signature

            const signature = await GenerateSignature({
                _id: customer._id,
                email: customer.email,
                verified: customer.verified
            })

            // send result to client
            
            return res.status(201).json({
                signature: signature,
                email: customer.email,
                verified: customer.verified
            })
        }
    }

    return res.status(404).json({ message: "Error login" })

};

export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    
  const { otp } = req.body;
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expires >= new Date()) {
        profile.verified = true;

        const updateCustomerResponse = await profile.save();

        // Generate the signature
        const signature = await GenerateSignature({
          _id: updateCustomerResponse._id,
          email: updateCustomerResponse.email,
          verified: updateCustomerResponse.verified,
        });

        return res.status(201).json({
          signature: signature,
          email: updateCustomerResponse.email,
          verified: updateCustomerResponse.verified,
        });
      }
    }
  }
  return res.status(400).json({ message: "Error with OTP validation" });

};

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
