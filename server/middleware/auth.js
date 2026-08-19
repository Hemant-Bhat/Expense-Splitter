import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
};

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
};
