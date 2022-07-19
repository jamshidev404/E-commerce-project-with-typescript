"use strict";
// Email
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
exports.onRequestOTP = exports.GenerateOTP = void 0;
//  Notification
// OTP
const GenerateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    let expires = new Date();
    expires.setTime(new Date().getTime() + 30 * 60 * 1000);
    return { otp, expires };
};
exports.GenerateOTP = GenerateOTP;
const onRequestOTP = (otp, toPhoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const accountSid = 'AC14aebe0d4edbc2b34a38e0c5f5a6898e';
    const authToken = 'dc4b324408885c280cb3dca35941e2fb';
    const client = require('twilio')(accountSid, authToken);
    const response = yield client.messages.create({
        body: `Your OTP is ${otp}`,
        from: '+19896834242',
        to: `+998${toPhoneNumber}`
    });
    return response;
});
exports.onRequestOTP = onRequestOTP;
// Payment notification or emails
//# sourceMappingURL=NotificationUtility.js.map