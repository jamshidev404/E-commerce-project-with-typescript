import { Request, Response, NextFunction } from "express";
import { EditVandorInputs, VandorLoginInput } from "../dto/vandor.dto";
import {
  GenerateSignature,
  ValidatePassword,
} from "../utility/PasswordUtility";
import { vandorFind } from "./admin.Controller";

export const VandorLogin = async (req: Request, res: Response) => {
  const { email, password } = <VandorLoginInput>req.body;

  const existingVandor = await vandorFind("", email);

  if (existingVandor !== null) {
    const validation = await ValidatePassword(
      password,
      existingVandor.password,
      existingVandor.salt
    );

    if (validation) {
      const signature = GenerateSignature({
        _id: existingVandor.id,
        email: existingVandor.email,
        name: existingVandor.name,
        password: existingVandor.password,
        foodTypes: existingVandor.foodTypes,
      });

      return res.json(signature);
    }
  }

  return res.json({ message: "Password not valid" });
};

export const GetVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingVandor = await vandorFind(user._id);

    return res.json(existingVandor);
  }

  return res.json({ message: "Vandor information not found" });
};

export const UpdateVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, address, phone, foodTypes } = <EditVandorInputs>req.body;

  const user = req.user;

  if (user) {
    const existingVandor = await vandorFind(user._id);

    if (existingVandor !== null) {
      existingVandor.name = name;
      existingVandor.address = address;
      existingVandor.phone = phone;
      existingVandor.foodTypes = foodTypes;

      const saveresult = await existingVandor.save();
      return res.json(saveresult);
    }

    return res.json(existingVandor);
  }

  return res.json({ message: "Vandor information not found" });
};

export const UpdateVandorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingVandor = await vandorFind(user._id);

    if (existingVandor !== null) {
      existingVandor.serviceAvaivable = !existingVandor.serviceAvaivable;
      const saveresult = await existingVandor.save();
      return res.json(saveresult);
    }

    return res.json(existingVandor);
  }

  return res.json({ message: "Vandor information not found" });
};
