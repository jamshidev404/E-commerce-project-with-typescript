import { Request, Response, NextFunction } from "express";
import { VandorLoginInput } from "../dto/vandor.dto";
import { ValidatePassword } from "../utility/PasswordUtility";
import { vandorFind } from "./admin.Controller";


export const VandorLogin = async (req: Request, res: Response) => {
    const {email, password} = <VandorLoginInput>req.body;

    const existingVandor = await vandorFind('', email);

    if (existingVandor !== null) {
        const validation = await ValidatePassword(password, existingVandor.password, existingVandor.salt)

        if (validation) {
            return res.json(existingVandor)
        }
    }

    return res.json({ message: "Password not valid" })
      
}

