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
exports.getVandorById = exports.getVandors = exports.createVandor = exports.vandorFind = void 0;
const models_1 = require("../models");
const PasswordUtility_1 = require("../utility/PasswordUtility");
const vandorFind = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield models_1.Vandor.findOne({ email: email });
    }
    else {
        return yield models_1.Vandor.findById(id);
    }
});
exports.vandorFind = vandorFind;
const createVandor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, ownerName, foodType, pincode, address, email, password, phone, } = req.body;
    // const existingVandor = Vandor.findOne({ email: email });
    // if (existingVandor !== null) {
    //   return res
    //     .status(400)
    //     .json({ message: "A vandor is exist with this email ID" });
    // }
    // Generate salt
    const salt = yield (0, PasswordUtility_1.GenerateSalt)();
    const usePassword = yield (0, PasswordUtility_1.GeneratePassword)(password, salt);
    const createVandor = yield models_1.Vandor.create({
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
        foods: []
    });
    return res.json(createVandor);
});
exports.createVandor = createVandor;
const getVandors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vandors = yield models_1.Vandor.find();
    if (vandors !== null) {
        return res.status(200).json({ vandors });
    }
    return res.status(404).json({ message: "Not found" });
});
exports.getVandors = getVandors;
const getVandorById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vandorId = req.params.id;
    const vandor = yield (0, exports.vandorFind)(vandorId);
    if (vandor !== null) {
        return res.status(200).json({ vandor });
    }
    return res.status(404).json({ message: "Not found" });
});
exports.getVandorById = getVandorById;
//# sourceMappingURL=admin.Controller.js.map