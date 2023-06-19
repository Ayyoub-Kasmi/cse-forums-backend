//importing prisma Client
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');
const userRoles = require('../prisma/userRoles');
const authProviders = require('../prisma/authProviders');
const { OAuth2Client : googleOAuth} = require('google-auth-library');
const bcrypt = require('bcrypt');
const jwtConfig = require('../config/jwtConfig')

//SignUp controlllers
module.exports.get_signup = async (req, res) => {
    res.send("This is the sign page");
}

module.exports.post_signup = async (req, res) => {
    try {
        //get data from the request body
        const {username, email, password, title, bio,
        facebook_id, instagram_id, github_id} = req.body;

        //set the creation date
        const creation_date = new Date();

        //encrypt the password before creating the account using bcrypt        
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        //generate the tokens for the new user
        const accessToken = jwt.sign(
            {
                username,
                role: userRoles.USER
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: jwtConfig.accessTokenAge}
        )

        const refreshToken = jwt.sign(
            {
                username,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: jwtConfig.refreshTokenAge}
        )

        //saving the data into the database
        const user = await prisma.user.create({
            data: {
                username, email, password: hashedPassword, refreshToken, title, bio, creation_date,
                facebook_id, instagram_id, github_id
            }
        });

        res.cookie('cse_forums_refresh_token', {refreshToken}, {
            maxAge: jwtConfig.refreshTokenAgeMilliSeconds,
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            path: '/auth'
        });

        //Send the response
        res.status(201).json({
            success: true,
            message: 'signup successful',
            data: user,
            token: accessToken,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error: " + error.message,
            data: {},
        })
    }
}

//Login controllers
module.exports.get_login = async (req, res) => {
    res.send("This is the login page");
}

module.exports.post_login = async (req, res) => {
    try {
        //get the provider query param
        const { provider } = req.query;
        
        if(provider === authProviders.GOOGLE){
            //Google Auth ==> validate login token
            
            const client = new googleOAuth(process.env.GOOGLE_AUTH_CLIENT_ID);
            const { token } =  req.body;

            async function verify() {
                
                const ticket = await client.verifyIdToken({
                    idToken: token,
                    audience: process.env.GOOGLE_AUTH_CLIENT_ID, 
                });

                const payload = ticket.getPayload();
                return payload;
                const userid = payload['sub'];
                // If request specified a G Suite domain:
                // const domain = payload['hd'];
            }
            
            try {
                const payload = await verify();
                console.log(payload);
                return res.status(200).json({
                    success: true,
                    message: "Google OAuth successfull"
                })
                
            } catch (error) {
                return res.status(403).json({
                    success: false,
                    message: "Invalid login credentials for Google OAuth",
                    data: {}
                })
            }
        }else{
            //local provider (current server)

            //get user credentials
            const { email, password } = req.body;
            
            //checking if the email is provided
            if(!email) return res.status(404).json({
                success: false,
                message: 'No email provided',
                data: {},
            })
            
            //checking if the password is provided
            if(!password) return res.status(404).json({
                success: false,
                message: 'No password provided',
                data: {},
            })
        }

        
        //search for the user in the database
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        //checking if there's an answer from the database
        if(!user) return res.status(404).json({
            success: false,
            message: 'User does not exist',
            data: {},
        })

        //user found, now checking the password
        //** Check if there's a way to declare static methods on the user schmea in prisma */
        const auth = await bcrypt.compare(password, user.password);
        
        if(!auth) return res.status(403).json({
            success: false,
            message: 'Incorrect password',
            data: {},
        })

        //user successfully authenticated, now generate the tokens
         const accessToken = jwt.sign(
            {
                username: user.username,
                role: user.role
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: jwtConfig.accessTokenAge}
        )

        const refreshToken = jwt.sign(
            {
                username: user.username,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: jwtConfig.refreshTokenAge}
        )
        
        res.cookie('cse_forums_refresh_token', refreshToken, {
            maxAge: jwtConfig.refreshTokenAgeMilliSeconds,
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            path: '/auth'
        });

        //updating the user record in the database
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                refreshToken: refreshToken,
            }
        });

        //send the response
        res.status(200).json({
            success: true,
            message: 'login successful',
            data: user,
            token: accessToken,
        })

    } catch (error) {
        
        //send Error message
        res.status(500).json({
            success: false,
            message: error.message,
            data: {},
        })
    }
}

module.exports.refresh_token = async (req, res) => {
    try {
        
        //get the refresh token from the cookies
        const refreshToken = req.cookies?.cse_forums_refresh_token;

        if(!refreshToken) return res.status(401).json({ //Unauthorized
            success: false,
            message: 'Refresh token not found',
            data: {},
        });

        //saving the data into the database
        const user = await prisma.user.findFirst({
            where: {
                refreshToken,
            },
        });

        console.log('refresh token: ', refreshToken);
        console.log('user: ', user);

        if(!user) return res.status(403).json({ //Forbidden
            success: false,
            message: 'Invalid refresh token',
            data: {},
        });

        console.log('refresh token matches user token')

        //validate the refresh token
        let decodedToken;
        try {
            decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            if(user.username !== decodedToken.username) return res.status(403).json({
                success: false,
                message: 'Invalid refresh token',
                data: {},
            })
        } catch (error) {
            return res.status(403).json({
                success: false,
                message: 'Invalid refresh token',
                data: {},
            })
        }

        //everything is fine, create a new access token
        const newAccessToken = jwt.sign(
            {
                username: decodedToken.username,
                role: user.role,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: jwtConfig.accessTokenAge}
        )

        //create a new refresh token with extended life span
        const newRefreshToken = jwt.sign(
            {
                username: decodedToken.username,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: jwtConfig.refreshTokenAge}
        )

        console.log('new refresh token: ', refreshToken)

        //updating the user record in the database
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                refreshToken: newRefreshToken,
            }
        });

        //attach the new refresh token to the cookies
        res.cookie('cse_forums_refresh_token', newRefreshToken, {
            maxAge: jwtConfig.refreshTokenAgeMilliSeconds,
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            path: '/auth'
        });

        console.log((new Date).getTime()+' ================================')

        //send the response
        res.status(201).json({
            success: true,
            message: 'Access token has been created successfully',
            data: {
                username: user.username,
                role: user.role
            },
            token: newAccessToken
        })

    } catch (error) {

        console.log(error)
        //server error
        res.status(500).json({
            success: false,
            message: "Error: " + error.message,
            data: {},
        })
    }
}

module.exports.post_logout = async (req, res) => {
    try {
        //get the refresh token from the cookies
        const refreshToken = req.cookies?.cse_forums_refresh_token;
    
        if(!refreshToken) return res.sendStatus(204) //success but no content to be sent
    
        //look for the user owning the token in the database
        const user = await prisma.user.findFirst({
            where: {
                refreshToken,
            }
        });
    
        if(!user){
            //user not found, just clear the cookie
            res.clearCookie('cse_forums_refresh_token', {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                path: '/auth'
            })
            return res.sendStatus(204);
        }
    
        //user found, delete the refresh token from the database
        await prisma.user.updateMany({
            where: {
                refreshToken,
            },
            data: {
                refreshToken: ""
            }
        })
    
        //clear the cookie and send the response
        res.clearCookie('cse_forums_refresh_token', {
            maxAge: jwtConfig.refreshTokenAgeMilliSeconds,
            sameSite: 'None',
            httpOnly: true,
            secure: true,
            path: '/auth'
        })
        
        return res.sendStatus(204);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error: " + error.message,
            data: {},
        })
    }
}

module.exports.test = async (req, res) => {
    const users = await prisma.user.findMany();
    users.forEach(user =>{
        console.log(user.username, '  ', user.refreshToken);
    })
    res.json({});
}