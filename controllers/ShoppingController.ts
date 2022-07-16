import { Request, Response, NextFunction } from "express";
import { Vandor } from "../models";
import { FoodDoc } from '../models'

export const GetFoodAvialability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;
  const result = await Vandor.find({ pincode: pincode, serviceAvialable: false })
    .sort( "rating" )
    .populate("foods");
  if (result.length > 0) {
    return res.status(200).json(result);
  }

  return res.status(400).json({ message: "Data not found" });
};

export const GetTopRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

    const pincode = req.params.pincode;
    const result = await Vandor.find({ pincode: pincode, serviceAvialable: false })
      .sort( "rating" )
      .limit(10);
    if (result.length > 0) {
      return res.status(200).json(result);
    }
  
    return res.status(400).json({ message: "Data not found" });

};

export const GetFoodIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

    const pincode = req.params.pincode;
    const result = await Vandor.find({ pincode: pincode, serviceAvialable: false })
      .populate( "foods" )

    if (result.length > 0) {

        let foodResult: any = [];

        result.map(vandor => {
            const foods = vandor.foods as [FoodDoc]

            foodResult.push(...foods.filter(food => food.readyTime <= 30))
        })

      return res.status(200).json(foodResult);
    }
  
    return res.status(400).json({ message: "Data not found" });

};

export const SearchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const RestaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
