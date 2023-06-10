//importing prisma Client
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');
const bcrypt = require('bcrypt');

//Global constants
const jwt_maxAge = 1000 * 60 * 60 * 24; //1 day

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

        //check if there're hooks in prisma! (User a "pre" hook)

        //saving the data into the database
        const result = await prisma.user.create({
            data: {
                username, email, password: hashedPassword, title, bio, creation_date,
                facebook_id, instagram_id, github_id
            }
        });

        //Create a JWT token for the user & set the cookie
        const token = jwt.sign({username, email}, process.env.JWT_SECRET, {expiresIn: jwt_maxAge});

        //Send the response
        res.status(200).json({
            success: true,
            message: 'signup successful',
            data: result,
            token: token,
        });

    } catch (error) {
        //send Error message
        let message = error.message.split('\n'); //This didn't work for
            //some cases => necessesity to check all possible cases

        // if( error instanceof Prisma.PrismaClientValidationError){
        //     message = error.message.split('\n');
        // }
        //add an "if" for the case of "unique" constraint violation

        res.status(400).json({
            success: false,
            message,
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
        //get the email address
        const { email, password } = req.body;
        
        //checking if the email is given
        if(!email) throw new Error('No email provided');
        
        //search for the user in the database
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        //checking if there's an answer from the database
        if(!user) throw new Error('Incorrect email');

        //user found, now checking the password
        //** Check if there's a way to declare static methods on the user schmea in prisma */
        const auth = await bcrypt.compare(password, user.password);
        
        if(!auth) throw new Error('Incorrect password');

        //user successfully authenticated, now create the jwt token
        const token = jwt.sign({username: user.username, email}, process.env.JWT_SECRET, {expiresIn: jwt_maxAge});

        //send the response
        res.status(200).json({
            success: true,
            message: 'login successful',
            data: user,
            token: token,
        })

    } catch (error) {
        
        //send Error message
        res.status(400).json({
            success: false,
            message: error.message,
            data: {},
        })
    }
}

module.exports.post_logout = (req, res) => {
    //set the cookie to '' and set a short expiry duration
    res.cookie('jwt', '', { maxAge: 1 });

    //redirect to the home page
    res.redirect('/');
}

module.exports.test = async (req, res) => {
    const email = req.body.email;
    const salt = await bcrypt.genSalt();
    const message = await bcrypt.hash("helloWorld", salt);
    res.json(message);
}