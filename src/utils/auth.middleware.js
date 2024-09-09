import jwt from 'jsonwebtoken';
import { User } from '../model/user.model.js';
import { ApiError } from '../utils/ApiError.js';

const authenticate = async (req, res, next) => {
    console.log("req.cookies:",req.cookies);

    // Extract token from cookies or Authorization header
    const authHeader = req.header("Authorization");
    const token = req.cookies?.accessToken || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null);

    // If token is missing, return error
    if (!token) {
        return next(new ApiError(401, 'No token provided'));
    }

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        // If user not found, return error
        if (!user) {
            return next(new ApiError(401, 'User not found'));
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        // If token is invalid, return error
        return next(new ApiError(401, 'Invalid token'));
    }
};

export { authenticate };
