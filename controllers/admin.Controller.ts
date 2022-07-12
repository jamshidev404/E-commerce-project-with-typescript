import { Request, Response, NextFunction } from "express";
import { CreateVandorInput } from "../dto/vandor.dto";
import { Vandor } from "../models";
import { GenerateSalt, GeneratePassword } from "../utility/PasswordUtility";

export const vandorFind = async(id: string | undefined, email? : string) => {
  if (email) {
    return await Vandor.findOne({ email: email })
  }else {
    return await Vandor.findById(id)
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

  const createVandor = await Vandor.create({
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
  });

  return res.json(createVandor);
};

export const getVandors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vandors = await Vandor.find();

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
