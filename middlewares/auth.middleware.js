const jwtHelper = require('../utils/jwt.utils');
const { ErrorResp } = require('../utils/common.utils');

module.exports.AuthMiddleware = async (req, res, next) => {

    try{

        const getHeaders = req.headers.authorization;

        if(!getHeaders){
            throw new Error("Unauthorized access.")
        }

        const getToken = getHeaders.split(" ")[1];

        if(!getToken){
            throw new Error("Unauthorized access.")
        }

        const verifyToken = await jwtHelper.validateJWT(getToken);
        console.log(verifyToken)
        const getCurrentTime = Math.floor(Date.now() / 1000);

        if(verifyToken.exp < getCurrentTime){
            throw new Error("Token expired.")
        }

        next();

    }catch(err){
        const ErrorResponse = ErrorResp();
        ErrorResponse.message = err.message;
        return res.status(404).json(ErrorResponse);
    }

}