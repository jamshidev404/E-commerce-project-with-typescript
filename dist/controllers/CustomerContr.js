"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditCustomerProfile = exports.GetCustomerProfile = exports.RequestOtp = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSignUp = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const Customer_dto_1 = require("../dto/Customer.dto");
const PasswordUtility_1 = require("../utility/PasswordUtility");
const CustomerModel_1 = require("../models/CustomerModel");
const NotificationUtility_1 = require("../utility/NotificationUtility");
const CustomerSignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInputs = (0, class_transformer_1.plainToInstance)(Customer_dto_1.CreateCustomerInputs, req.body);
    const inputError = yield (0, class_validator_1.validate)(customerInputs, {
        validationError: { target: true },
    });
    if (inputError.length > 0) {
        return res.status(400).json(inputError);
    }
    const { email, phone, password } = customerInputs;
    const salt = yield (0, PasswordUtility_1.GenerateSalt)();
    const userPassword = yield (0, PasswordUtility_1.GeneratePassword)(password, salt);
    const { otp, expires } = yield (0, NotificationUtility_1.GenerateOTP)();
    const existsCustomer = yield CustomerModel_1.Customer.findOne({ email: email });
    if (existsCustomer !== null) {
        return res
            .status(409)
            .json({ message: "An user exist with te privided email ID" });
    }
    const result = yield CustomerModel_1.Customer.create({
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
        yield (0, NotificationUtility_1.onRequestOTP)(otp, phone);
        //generate the signature
        const signature = (0, PasswordUtility_1.GenerateSignature)({
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
});
exports.CustomerSignUp = CustomerSignUp;
const CustomerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.UserLoginInputs, req.body);
    const loginErrors = yield (0, class_validator_1.validate)(loginInputs, {
        validationError: { target: false },
    });
    if (loginErrors.length > 0) {
        return res.status(400).json(loginErrors);
    }
    const { email, password } = loginInputs;
    const customer = yield CustomerModel_1.Customer.findOne({ email: email });
    if (customer) {
        const validation = yield (0, PasswordUtility_1.ValidatePassword)(password, customer.password, customer.salt);
        if (validation) {
            // generate the signature
            const signature = yield (0, PasswordUtility_1.GenerateSignature)({
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
});
exports.CustomerLogin = CustomerLogin;
const CustomerVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const customer = req.user;
    if (customer) {
        const profile = yield CustomerModel_1.Customer.findById(customer._id);
        if (profile) {
            if (profile.otp === parseInt(otp) && profile.otp_expires >= new Date()) {
                profile.verified = true;
                const updateCustomerResponse = yield profile.save();
                // Generate the signature
                const signature = yield (0, PasswordUtility_1.GenerateSignature)({
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
});
exports.CustomerVerify = CustomerVerify;
const RequestOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield CustomerModel_1.Customer.findById(customer._id);
        if (profile) {
            const { otp, expires } = (0, NotificationUtility_1.GenerateOTP)();
            profile.otp = otp;
            profile.otp_expires = expires;
            yield profile.save();
            yield (0, NotificationUtility_1.onRequestOTP)(otp, profile.phone);
            return res
                .status(200)
                .json({ message: "OTP sent your registired phone number" });
        }
    }
    return res.status(400).json({ message: "Error with request OTP" });
});
exports.RequestOtp = RequestOtp;
const GetCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield CustomerModel_1.Customer.findById(customer._id);
        if (profile) {
            return res.status(200).json(profile);
        }
        return res.status(400).json({ message: "Error with Fetch Profile" });
    }
});
exports.GetCustomerProfile = GetCustomerProfile;
const EditCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const profileInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.EditCustomerProfileInputs, req.body);
    const profileErrors = yield (0, class_validator_1.validate)(profileInputs, {
        validationError: { target: false },
    });
    if (profileErrors.length > 0) {
        return res.status(400).json(profileErrors);
    }
    const { firstName, lastName, address } = profileInputs;
    if (customer) {
        const profile = yield CustomerModel_1.Customer.findById(customer._id);
        if (profile) {
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = yield profile.save();
            res.status(200).json(result);
        }
    }
    return res.status(400).json({ message: "Error with request OTP" });
});
exports.EditCustomerProfile = EditCustomerProfile;
//# sourceMappingURL=CustomerContr.js.map