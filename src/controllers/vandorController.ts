import { Request, Response, NextFunction } from "express";
import { ItemAssignmentContext } from "twilio/lib/rest/numbers/v2/regulatoryCompliance/bundle/itemAssignment";
import { CreateFoodInputs } from "../dto/Food.dto";
import {
  CreateOfferInputs,
  EditVandorInputs,
  VandorLoginInput,
} from "../dto/vandor.dto";
import { Order } from "../models";
import { Food } from "../models";
import { Offer } from "../models/OfferModel";
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

  const { lat, lng } = req.body;

  if (user) {
    const existingVandor = await vandorFind(user._id);

    if (existingVandor !== null) {
      existingVandor.serviceAvialable = !existingVandor.serviceAvialable;

      if( lat && lng ) {
        existingVandor.lat = lat;
        existingVandor.lng = lng;
      }

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
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

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
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

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

export const GetCurrentOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const orders = await Order.find({ vendorId: user._id }).populate(
      "items.food"
    );
    if (orders != null) {
      return res.status(200).json(orders);
    }
  }

  return res.status(404).json({ message: "Orders not found" });
};

export const GetOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;

  if (orderId) {
    const order = await Order.findById(orderId).populate("items.food");
    if (order != null) {
      return res.status(200).json(order);
    }
  }

  return res.status(404).json({ message: "Order not found" });
};

export const ProcessOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;

  const { status, remarks, time } = req.body; // ACCEPT //REJECT // UNDER-PROCESS // READY

  if (orderId) {
    const order = await Order.findById(orderId).populate("food");

    order.orderStatus = status;
    order.remarks = remarks;
    if (time) {
      order.readyTime = time;
    }

    const orderResult = await order.save();
    if (orderResult != null) {
      return res.status(200).json(orderResult);
    }
  }

  return res.status(400).json({ message: "Unable to process order" });
};

export const GetOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    
    let currentOffers = Array();

    const offers = await Offer.find().populate("vendors");

    if (offers) {

      offers.map((item) => {
        if (item.vendors) {
          item.vendors.map((vendor) => {
            if (vendor._id.toString == user._id) {
              currentOffers.push(item);
            }
          });
        }
        if (item.offerType === "GENERIC") {
          currentOffers.push(item);
        }
      });
    
    }
    return res.status(400).json(currentOffers);

  }
  return res.status(400).json({ message: "Offers not available" });
};

export const AddOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const {
      title,
      description,
      offerType,
      offerAmount,
      pincode,
      promocode,
      promoType,
      startValidity,
      endValidity,
      bank,
      bins,
      minValue,
      isActive,
    } = <CreateOfferInputs>req.body;

    const vendor = await vandorFind(user._id);

    if (vendor) {
      const offer = await Offer.create({
        offerType,
        title,
        description,
        minValue,
        offerAmount,
        startValidity,
        endValidity,
        promocode,
        promoType,
        bank,
        bins,
        pincode,
        isActive,
        vendors: [vendor],
      });

      console.log(offer);

      return res.status(200).json(offer);
    }
  }

  return res.status(400).json({ message: "Unable to add offer" });
};

export const EditOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const user = req.user;
  const offerId = req.params.id;

  if (user) {
    const {
      title,
      description,
      offerType,
      offerAmount,
      pincode,
      promocode,
      promoType,
      startValidity,
      endValidity,
      bank,
      bins,
      minValue,
      isActive,
    } = <CreateOfferInputs>req.body;

    const currentOffer = await Offer.findById(offerId);

    if (currentOffer) {
    
    const vendor = await vandorFind(user._id);

    if (vendor) {

        currentOffer.offerType = offerType,
        currentOffer.title = title,
        currentOffer.description = description,
        currentOffer.minValue = minValue,
        currentOffer.offerAmount = offerAmount,
        currentOffer.startValidity = startValidity,
        currentOffer.endValidity = endValidity,
        currentOffer.promocode = promocode,
        currentOffer.promoType = promoType,
        currentOffer.bank = bank,
        currentOffer.bins = bins,
        currentOffer.pincode = pincode,
        currentOffer.isActive = isActive

        const result = await currentOffer.save()

        return res.json(result)
        
      };
  }
}


  return res.status(400).json({ message: "" });


};
