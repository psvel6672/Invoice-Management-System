const jwtHelper = require('../utils/jwt.utils');
const { ErrorResp } = require('../utils/common.utils');

const path = require('path');

module.exports.AuthMiddleware = (options = {}) => {
    return async (req, res, next) => {
        try {
            const token = req.cookies?.token;

            // 🟢 Case 1: No token
            if (!token) {
                if (options.public) {
                    return next(); // allow access (e.g. login page)
                }
                return res.redirect('/login');
            }

            // 🟢 Verify token
            const verifyToken = await jwtHelper.validateJWT(token);
            const currentTime = Math.floor(Date.now() / 1000);

            if (verifyToken.exp < currentTime) {
                throw new Error("Token expired");
            }

            req.user = verifyToken;

            // 🟢 Case 2: If already logged in & trying to access login page
            if (options.public) {
                return res.redirect('/'); // redirect to dashboard
            }

            // 🟢 Case 3: Role-based check (admin)
            if (options.role && verifyToken.role !== options.role) {
                return res.redirect('/login');
            }

            next();

        } catch (err) {
            console.log(err.message);

            if (options.public) {
                return next(); // allow login page even if token invalid
            }

            return res.redirect('/login');
        }
    };
};
