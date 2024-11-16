const jwt = require('jsonwebtoken');

const isAuthenticated = async (req, res, next) =>{
    try {
        const accessToken = req.cookies.accessToken;
        if(!accessToken) {
            throw createError(401, 'Access token not found. Please login')
        }
        // token verify
        const decoded = jwt.verify(accessToken, jwtAccessKey);
        if(!decoded){
            throw createError(401, 'Invalid access token. Please login again');
        }
        req.user = decoded.user;
        next();
    } catch (error) {
        return next(error);
    }
}