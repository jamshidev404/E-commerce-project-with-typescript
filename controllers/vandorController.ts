import { Request, Response, NextFunction } from "express";
import { CreateFoodInputs } from "../dto/Food.dto";
import { EditVandorInputs, VandorLoginInput } from "../dto/vandor.dto";
import { Food } from "../models";
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
      existingVandor.serviceAvialable = !existingVandor.serviceAvialable;
      const saveresult = await existingVandor.save();
      return res.json(saveresult);
    }

    return res.json(existingVandor);
  }

  return res.json({ message: "Vandor information not found" });
};

export const UpdateVandorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const user = req.user;

  if (user) {

    const vandor = await vandorFind(user._id);

    if (vandor !== null) {

      const files = req.files as [ Express.Multer.File ];

      const images = files.map((file: Express.Multer.File) => file.filename  )

      vandor.foods.push(...images);
      const result = await vandor.save();

      return res.json(result);
    }

  }
  
};


export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const { name, description, category, foodType, readyTime, price } = <
      CreateFoodInputs
    >req.body;

    const vandor = await vandorFind(user._id);

    if (vandor !== null) {

      const files = req.files as [ Express.Multer.File ];

      const images = files.map((file: Express.Multer.File) => file.filename  )

      const createdFood = await Food.create({
        vandorId: vandor._id,
        name: name,
        description: description,
        category: category,
        foodType: foodType,
        readyTime: readyTime,
        price: price,
        rating: 0,
        imgaes: images,
      });

      vandor.foods.push(createdFood);
      const result = await vandor.save();

      return res.json(result);
    }
  }

  return res.json({ message: "Something went wrong with add food" });
};

export const GetFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const foods = await Food.find({ vandorId: user._id });

    if (foods !== null) {
      return res.json(foods);
    }
  }

  return res.json({ message: "Foods information not found" });
};
