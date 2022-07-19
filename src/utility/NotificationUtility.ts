// Email

//  Notification

// OTP

export const GenerateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  let expires = new Date();
  expires.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expires };
};

export const onRequestOTP = async (otp: number, toPhoneNumber: string ) => {

    const accountSid = 'AC14aebe0d4edbc2b34a38e0c5f5a6898e';
    const authToken = 'dc4b324408885c280cb3dca35941e2fb';
    const client = require('twilio')(accountSid, authToken);

    const response = await client.messages.create({
        body: `Your OTP is ${otp}`,
        from: '+19896834242',
        to: `+998${toPhoneNumber}`
    })

    return response

};

// Payment notification or emails
