const jwt  = require('jsonwebtoken');


const generateWebTokenAndSetCookie = (userID,res) => {
    const token = jwt.sign({userID},process.env.JWT_SECRET_KEY,{
        expiresIn:'1d',
    });
    res.cookie("token",token,{
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly : true,
        sameSite :"strict",
        secure: process.env.NODE_ENV !== 'development' ? true : false
    });
    return token;
}
module.exports = generateWebTokenAndSetCookie;