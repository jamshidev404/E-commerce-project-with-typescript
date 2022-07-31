import { Request, Response, NextFunction } from "express";
import { CreateVandorInput } from "../dto/vandor.dto";
import { Vendor, DeliveryUser } from "../models";
import { Transaction } from "../models/Transaction";
import { GenerateSalt, GeneratePassword } from "../utility/PasswordUtility";

export const vandorFind = async(id: string | undefined, email? : string) => {
  if (email) {
    return await Vendor.findOne({ email: email })
  }else {
    return await Vendor.findById(id)
  }
}

export const createVandor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    ownerName,
    foodType,
    pincode,
    address,
    email,
    password,
    phone,
  } = <CreateVandorInput>req.body;

  // const existingVandor = Vandor.findOne({ email: email });

  // if (existingVandor !== null) {
  //   return res
  //     .status(400)
  //     .json({ message: "A vandor is exist with this email ID" });
  // }

  // Generate salt
  const salt = await GenerateSalt();
  const usePassword = await GeneratePassword(password, salt);

  const createVandor = await Vendor.create({
    name: name,
    ownerName: ownerName,
    foodType: foodType,
    pincode: pincode,
    address: address,
    email: email,
    password: usePassword,
    phone: phone,
    salt: salt,
    serviceAvaivable: false,
    coverImage: [],
    rating: 0,
    foods: [],
    lat: 0,
    lng: 0
  });

  return res.json(createVandor);
};

export const getVandors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vandors = await Vendor.find();

  if (vandors !== null) {
    return res.status(200).json({ vandors });
  }

  return res.status(404).json({ message: "Not found" });
};

export const getVandorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

const vandorId = req.params.id;

const vandor = await vandorFind(vandorId)

if (vandor !== null) {
  return res.status(200).json({ vandor })
}

return res.status(404).json({ message: "Not found" })

};

export const GetTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {


const transactions = await Transaction.find()

if (transactions) {
  return res.status(200).json( transactions )
}

return res.status(404).json({ message: "Transactions not available!" })

};

export const GetTransactionId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

const id = req.params.id;

const transaction = await Transaction.findById(id)

if (transaction) {
  return res.status(200).json( transaction )
}

return res.status(404).json({ message: "Transaction not available!" })

};

export const VerifyDeliveryUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const { _id, status } = req.body;

  if(_id) {

    const profile = await DeliveryUser.findById(_id)
    
    if (profile) {

      profile.verified = status;
      const result = await profile.save()

      return res.status(200).json(result)
    }
  }

  return res.status(400).json({ message: "Unable to verify Delivery user!" })

}

export const GetDeliveryUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  
  const deliveryUsers = await DeliveryUser.find()

    
    if (deliveryUsers) {

      return res.status(200).json(deliveryUsers)
    }

  return res.status(400).json({ message: "Unable to get Delivery users!" })

}