import { Request, Response, NextFunction, json } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToClass, plainToInstance } from "class-transformer";
import {
  CartItem,
  CreateCustomerInputs,
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
import { Customer } from "../models/CustomerModel";
import { GenerateOTP, onRequestOTP } from "../utility/NotificationUtility";
import { DeliveryUser, Food } from "../models";
import { Vendor } from "../models";
import { Order } from "../models/OrderModel";
import { NationalPayload } from "twilio/lib/rest/api/v2010/account/availablePhoneNumber/national";
import { Offer } from "../models/OfferModel";
import { Transaction } from "../models/Transaction";

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
    order: [],
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

  const loginErrors = await validate(loginInputs, {
    validationError: { target: false },
  });

  if (loginErrors.length > 0) {
    return res.status(400).json(loginErrors);
  }
  const { email, password } = loginInputs;
  const customer = await Customer.findOne({ email: email });

  if (customer) {
    const validation = await ValidatePassword(
      password,
      customer.password,
      customer.salt
    );

    if (validation) {
      // generate the signature

      const signature = await GenerateSignature({
        _id: customer._id,
        email: customer.email,
        verified: customer.verified,
      });

      // send result to client

      return res.status(201).json({
        signature: signature,
        email: customer.email,
        verified: customer.verified,
      });
    }
  }

  return res.status(404).json({ message: "Error login" });
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
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      const { otp, expires } = GenerateOTP();

      profile.otp = otp;
      profile.otp_expires = expires;

      await profile.save();
      await onRequestOTP(otp, profile.phone);

      return res
        .status(200)
        .json({ message: "OTP sent your registired phone number" });
    }
  }

  return res.status(400).json({ message: "Error with request OTP" });
};

export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      return res.status(200).json(profile);
    }

    return res.status(400).json({ message: "Error with Fetch Profile" });
  }
};

export const EditCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  const profileInputs = plainToClass(EditCustomerProfileInputs, req.body);

  const profileErrors = await validate(profileInputs, {
    validationError: { target: false },
  });

  if (profileErrors.length > 0) {
    return res.status(400).json(profileErrors);
  }

  const { firstName, lastName, address } = profileInputs;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;

      const result = await profile.save();
      res.status(200).json(result);
    }
  }

  return res.status(400).json({ message: "Error with request OTP" });
};

// ============== Cart Section ============== //

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id).populate("cart.food");
    let cartItems = Array();
    const { _id, unit } = <CartItem>req.body;
    const food = await Food.findById(_id);

    if (food) {
      if (profile !== null) {
        //check for cart items
        cartItems = profile.cart;

        if (cartItems.length > 0) {
          // check and update unit
          let existFoodItem = cartItems.filter(
            (item) => item.food._id.toString() === _id
          );

          if (existFoodItem.length > 0) {
            const index = cartItems.indexOf(existFoodItem[0]);

            if (unit > 0) {
              cartItems[index] = { food, unit };
            } else {
              cartItems.splice(index, 1);
            }
          } else {
            cartItems.push({ food, unit });
          }
        } else {
          //add new item to cart
          cartItems.push({ food, unit });
        }

        if (cartItems) {
          profile.cart = cartItems as any;
          const cartResult = await profile.save();
          return res.status(200).json(cartResult.cart);
        }
      }
    }
  }

  return res.status(400).json({ message: "Unable to create cart!" });
};

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id).populate("cart.food");
    if (profile) {
      return res.status(200).json(profile.cart);
    }
  }

  return res.status(400).json({ message: "Cart is empty!" });
};

export const deleteCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id).populate("cart.food");
    if (profile != null) {
      profile.cart = [] as any;
      const resultCart = await profile.save();
      return res.status(200).json(resultCart);
    }
  }

  return res.status(400).json({ message: "Cart is empty!" });
};


//=============== Delivery Notification =================//

const assignOrderForDelivery = async (orderId: string, vendorId: string) => {

//find vendor
const vendor = await Vendor.findById(vendorId)

if (vendor) {

  const areaCode = vendor.pincode;
  const vendorLat = vendor.lat;
  const vendorLng = vendor.lng;

  //find the available Delivery person
  const deliveryPerson = await DeliveryUser.find({ pincode: areaCode, verified: true, isAvailable: true })

  if (deliveryPerson) {

    //check the nearest delivery person and assign the order
    console.log(`Delivery Person ${deliveryPerson[0]}`)
    
    const currentOrder = await Order.findById(orderId)

    if (currentOrder) {

      // update deliveryId
      currentOrder.deliveryId = deliveryPerson[0]._id;
      const response = await currentOrder.save()
      
      console.log(response)

      // Notify to Vendor for received New Order using Firebase Push Notification
    }
  }
}

// update DeliveryID



}


//=============== Order Section =============//

const validateTransaction = async (txnId: string) => {
  const currentTransaction = await Transaction.findById(txnId);

  if (currentTransaction) {
    if (currentTransaction.status.toLowerCase() !== "failed") {
      return { status: true, currentTransaction };
    }
  }

  return { status: false, currentTransaction };
};

export const CreateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //grap current  login customer
  const customer = req.user;

  const { txnId, amount, items } = <OrderInputs>req.body;

  if (customer) {
    //validate transaction
    const { status, currentTransaction } = await validateTransaction(txnId);

    if (!status) {
      return res.status(400).json({ message: "Error with create order!" });
    }

    //create an order Id
    const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;

    const profile = await Customer.findById(customer._id);

    // grap order items for request [ { id: XXX, unit: XXX } ]

    let cartItems = Array();

    let netAmount = 0.0;

    let vendorId;

    // Calculate order amount

    const foods = await Food.find()
      .where("_id")
      .in(items.map((item) => item._id))
      .exec();

    foods.map((food) => {
      items.map(({ _id, unit }) => {
        if (food._id == _id) {
          vendorId = food.vendorId;
          netAmount += food.price + unit;
          cartItems.push({ food, unit });
        }
      });
    });

    //create order with item description

    if (cartItems) {
      //create order
      const currentOrder = await Order.create({
        orderID: orderId,
        vendorId: vendorId,
        items: cartItems,
        totalAmount: netAmount,
        paidAmount: amount,
        orderDate: new Date(),
        orderStatus: "Waiting",
        remarks: "",
        deliveryId: "",
        readyTime: 45,
      });

      profile.cart = [] as any;
      profile.orders.push(currentOrder);

      currentTransaction.vendorId = vendorId;
      currentTransaction.orderId = orderId;
      currentTransaction.status = "CORFIRMED";

      await currentTransaction.save();

      assignOrderForDelivery(currentOrder._id, vendorId)

      const profileSaveResponse = await profile.save();

      return res.status(200).json(profileSaveResponse);
    } else {
      return res.status(400).json({ message: "Unable to create order" });
    }
  }

  // finally update orders to user account
  return res.status(400).json({ message: "Error with create order" });
};

export const GetOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id).populate("orders");

    if (profile) {
      return res.status(200).json(profile);
    }
  }

  return res.status(404).json({ message: "Not found orders" });
};

export const GetOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;

  if (orderId) {
    const order = await Order.findById(orderId).populate("items.food");

    if (order) {
      return res.status(200).json(order);
    }
  }
  return res.status(404).json({ message: "Not found order" });
};

export const VerifyOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const offerId = req.params.id;
  const customer = req.user;

  if (customer) {
    const appliedOffer = await Offer.findById(offerId);

    if (appliedOffer) {
      if (appliedOffer.promoType === "USER") {
        // only can apply once per user
      } else {
        if (appliedOffer.isActive) {
          return res
            .status(200)
            .json({ message: "Offer is valid", offer: appliedOffer });
        }
      }
    }
  }

  return res.status(400).json({ message: "Offer is not valid" });
};

export const CreatePayment = async (req: Request, res: Response) => {
  const customer = req.user;

  const { amount, offerId, paymentMode } = req.body;

  let payableAmount = Number(amount);

  if (offerId) {
    const appliedOffer = await Offer.findById(offerId);

    if (appliedOffer) {
      if (appliedOffer.isActive) {
        payableAmount = payableAmount - appliedOffer.offerAmount;
      }
    }
  }

  //Create record on Transaction

  const transaction = await Transaction.create({
    customer: customer._id,
    vendorId: "",
    orderId: "",
    orderValue: payableAmount,
    offerUsed: offerId || "NA",
    status: "OPEN", //FAILED //SUCCESS
    paymentMode: paymentMode,
    paymentResponse: "Payment is cash on Delivery",
  });

  //return transaction ID
  return res.status(200).json(transaction);
};
