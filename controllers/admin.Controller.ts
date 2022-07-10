import { Request, Response, NextFunction } from "express";
import { CreateVandorInput } from "../dto/vandor.dto";
import { Vandor } from '../models';

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

  const createVandor = await Vandor.create({
    name: name,
    ownerName: ownerName,
    foodType: foodType,
    pincode: pincode,
    address: address,
    email: email,
    password: password,
    phone: phone,
    salt: "",
    serviceAvaivable: false,
    coverImage: [],
    rating: 0,
  });

  return res.json();
};

export const getVandors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const getVandorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
