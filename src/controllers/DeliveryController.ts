import { Request, Response, NextFunction, json } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToClass, plainToInstance } from "class-transformer";
import {
  CartItem,
  CreateDeliveryUserInputs,
  EditCustomerProfileInputs,
  OrderInputs,
  UserLoginInputs,
} from "../dto/Customer.dto";
import {
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} from "../utility/PasswordUtility";
import { DeliveryUser } from "../models/DeliveryUser";

export const DeliveryUserSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUserInputs = plainToInstance(CreateDeliveryUserInputs, req.body);

  const inputError = await validate(deliveryUserInputs, {
    validationError: { target: true },
  });

  if (inputError.length > 0) {
    return res.status(400).json(inputError);
  }

  const { email, phone, password, firstName, lastName, address, pincode } = deliveryUserInputs;

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const existingDeliveryUser = await DeliveryUser.findOne({ email: email });

  if (existingDeliveryUser !== null) {
    return res
      .status(409)
      .json({ message: "A delivery user exist with te privided email ID" });
  }

  const result = await DeliveryUser.create({
    lastName: lastName,
    firstName: firstName,
    address: address,
    pincode: pincode,
    email: email,
    password: userPassword,
    verified: false,
    phone: phone,
    salt: salt,
    lat: 0,
    lng: 0,
    isAvailable: false
  });

  if (result) {

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

export const DeliveryUserLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginInputs = plainToClass(UserLoginInputs, req.body);

  const loginErrors = await validate(loginInputs, {
    validationError: { target: false },
  });

  if (loginErrors.length > 0) {
    return res.status(400).json(loginErrors);
  }
  const { email, password } = loginInputs;
  const deliveryUser = await DeliveryUser.findOne({ email: email });

  if (deliveryUser) {
    const validation = await ValidatePassword(
      password,
      deliveryUser.password,
      deliveryUser.salt
    );

    if (validation) {
      // generate the signature

      const signature = await GenerateSignature({
        _id: deliveryUser._id,
        email: deliveryUser.email,
        verified: deliveryUser.verified,
      });

      // send result to client

      return res.status(201).json({
        signature: signature,
        email: deliveryUser.email,
        verified: deliveryUser.verified,
      });
    }
  }

  return res.status(404).json({ message: "Error login" });
};

export const GetDeliveryUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUser = req.user;

  if (deliveryUser) {
    const profile = await DeliveryUser.findById(deliveryUser._id);

    if (profile) {
      return res.status(200).json(profile);
    }

    return res.status(400).json({ message: "Error with Fetch Profile" });
  }

};

export const EditDeliveryUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUser = req.user;

  const profileInputs = plainToClass(EditCustomerProfileInputs, req.body);

  const profileErrors = await validate(profileInputs, {
    validationError: { target: false },
  });

  if (profileErrors.length > 0) {
    return res.status(400).json(profileErrors);
  }

  const { firstName, lastName, address } = profileInputs;

  if (deliveryUser) {
    const profile = await DeliveryUser.findById(deliveryUser._id);

    if (profile) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;

      const result = await profile.save();
      res.status(200).json(result);
    }
  }

  return res.status(400).json({ message: "Error with Fetch Profile" });
};

export const UpdateDeliveryUserStatus = async (req: Request, res: Response) => {

    const deliveryUser = req.user;

    if(deliveryUser) {

        const { lat, lng } = req.body; 

        const profile = await DeliveryUser.findById(deliveryUser._id);

        if (profile) {

            if(lat && lng) {
                profile.lat;
                profile.lng;
            }

            profile.isAvailable = !profile.isAvailable;

            const result = await profile.save()

            return res.status(200).json(result)
        }
    }

    return res.status(400).json({ message: "Error with update status!" });

}