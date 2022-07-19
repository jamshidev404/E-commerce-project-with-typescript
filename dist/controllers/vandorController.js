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
exports.GetFoods = exports.AddFood = exports.UpdateVandorCoverImage = exports.UpdateVandorService = exports.UpdateVandorProfile = exports.GetVandorProfile = exports.VandorLogin = void 0;
const models_1 = require("../models");
const PasswordUtility_1 = require("../utility/PasswordUtility");
const admin_Controller_1 = require("./admin.Controller");
const VandorLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingVandor = yield (0, admin_Controller_1.vandorFind)("", email);
    if (existingVandor !== null) {
        const validation = yield (0, PasswordUtility_1.ValidatePassword)(password, existingVandor.password, existingVandor.salt);
        if (validation) {
            const signature = (0, PasswordUtility_1.GenerateSignature)({
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
});
exports.VandorLogin = VandorLogin;
const GetVandorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVandor = yield (0, admin_Controller_1.vandorFind)(user._id);
        return res.json(existingVandor);
    }
    return res.json({ message: "Vandor information not found" });
});
exports.GetVandorProfile = GetVandorProfile;
const UpdateVandorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, phone, foodTypes } = req.body;
    const user = req.user;
    if (user) {
        const existingVandor = yield (0, admin_Controller_1.vandorFind)(user._id);
        if (existingVandor !== null) {
            existingVandor.name = name;
            existingVandor.address = address;
            existingVandor.phone = phone;
            existingVandor.foodTypes = foodTypes;
            const saveresult = yield existingVandor.save();
            return res.json(saveresult);
        }
        return res.json(existingVandor);
    }
    return res.json({ message: "Vandor information not found" });
});
exports.UpdateVandorProfile = UpdateVandorProfile;
const UpdateVandorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVandor = yield (0, admin_Controller_1.vandorFind)(user._id);
        if (existingVandor !== null) {
            existingVandor.serviceAvialable = !existingVandor.serviceAvialable;
            const saveresult = yield existingVandor.save();
            return res.json(saveresult);
        }
        return res.json(existingVandor);
    }
    return res.json({ message: "Vandor information not found" });
});
exports.UpdateVandorService = UpdateVandorService;
const UpdateVandorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const vandor = yield (0, admin_Controller_1.vandorFind)(user._id);
        if (vandor !== null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            vandor.foods.push(...images);
            const result = yield vandor.save();
            return res.json(result);
        }
    }
});
exports.UpdateVandorCoverImage = UpdateVandorCoverImage;
const AddFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const { name, description, category, foodType, readyTime, price } = req.body;
        const vandor = yield (0, admin_Controller_1.vandorFind)(user._id);
        if (vandor !== null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            const createdFood = yield models_1.Food.create({
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
            const result = yield vandor.save();
            return res.json(result);
        }
    }
    return res.json({ message: "Something went wrong with add food" });
});
exports.AddFood = AddFood;
const GetFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foods = yield models_1.Food.find({ vandorId: user._id });
        if (foods !== null) {
            return res.json(foods);
        }
    }
    return res.json({ message: "Foods information not found" });
});
exports.GetFoods = GetFoods;
//# sourceMappingURL=vandorController.js.map