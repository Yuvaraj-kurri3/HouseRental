import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

export const authMiddleware = (req, res, next) => {
const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token || req.body.token; // Assuming token is sent as "Bearer" or in cookies

if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
}

try {
    const decoded = jwt.verify(token, "jwttokensecretkey"); // process.env.JWT_SECRET
    req.user = decoded;
    next();
} catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
}

};

