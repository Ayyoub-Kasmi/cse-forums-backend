const jwt = require("jsonwebtoken");

module.exports.verifyUser = (req, res, next) => {
    
    //check for the authorization header
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if(!authHeader?.startsWith('Bearer ')) return res.status(401).json({
        success: false,
        message: "Unauthorized: token not provided",
        data: {}
    })
    
    //The token is there, check if it's valid
    const accessToken = authHeader.split(' ')[1]; //the header is of form: "Bearer token"

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
        if(err){
            //invalid token
            return res.status(403).json({
                success: false,
                message: "Invalid token",
                data: {}
            })
        }
        
        res.locals.user = decodedToken;
        next();
    })
    
}

module.exports.verifyRole = (role) => {
    return (req, res, next) => {
        if(res.locals.user.role !== role) return res.sendStatus(401);
        next();
    }
}