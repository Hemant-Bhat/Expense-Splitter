import { Router } from "express";
import bcrypt from 'bcryptjs';
import jwt  from "jsonwebtoken";

import User from "../models/user.model.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../validators/user.validator.js";

const router = Router();

const ERROR = {
    INVALID_CREDENTIAL: {
        error: "Incorrect email or password",
        code: "ERR_INVALID_CREDENTIAL"
    },
    USER_NOT_FOUND: {
        error: "User not found",
        code: "ERR_NOT_FOUND_RECORD"
    },
    DUPLICATE_EMAIL: { 
        error: "Email already exist",
        code: "ERR_DUPLICATE_RECORD"
    }
}

router.post('/login', validate(loginSchema), async (req, res) => {
    try {
        const { password, email } = req.body;
    
        const existingUser = await User.findOne({ email });
        if(!existingUser) {
            return res.json(ERROR.INVALID_CREDENTIAL);
        }

        const isValid = await bcrypt.compare(password, existingUser.password);

        if(!isValid) {
            return res.json({ ...ERROR.INVALID_CREDENTIAL, actualError: 'Incorrect password'});
        }
        const token = jwt.sign({ userId: existingUser._id, user: existingUser.email,  }, process.env.JWT_SECRET_KEY, { 
            expiresIn: '1h'
        })

        res.cookie('token', token, { 
            expires: new Date(Date.now() + 60 * 60 * 1000),
            httpOnly: true

        }).status(200).json({ success: true });

    } catch (error) {
        res.json({ error: true, message: error.message })
    }
});

router.post('/signup', validate(registerSchema) ,async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        const existingUser = await User.findOne({ email });

        if(existingUser){
            return res.status(409).json(ERROR.DUPLICATE_EMAIL);
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashPassword });
        await user.save();

        return res.status(201).json({ success: true, message: "User Created Successfully" });
    } catch (error) {
        if(error.code == 11000){ // mongo db code for duplicate
           return res.status(409).json(ERROR.DUPLICATE_EMAIL);
        }

        throw error;
    }
});

export default router;