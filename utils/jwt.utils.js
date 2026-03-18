const jwt = require('jsonwebtoken');

module.exports.generateJWT = async (payload, expire = "1h") => {
    const jwtToken = await jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: expire})
    return jwtToken;
}

module.exports.validateJWT = async (value) => {
    try {
        const validateToken = await jwt.verify(value, process.env.SECRET_KEY);
        return validateToken;
    } catch (error) {
        throw new Error(error.message)
    }
}