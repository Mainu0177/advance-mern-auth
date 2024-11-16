
const createError = require('http-errors');
const jwt = require("jsonwebtoken");


const { createJSONWebToken } = require('../helper/jsonWebToken');
const { jwtActivationKey, clientUrl, jwtAccessKey } = require('../config/secret');
const { emailWithNodeMailer } = require('../helper/email');
const { successResponse } = require('../helper/responseController');
const User = require('../models/userModel');
const createOTP = require('../helper/generateOTP');


const createSendToken = (user, statusCode, res, message) =>{
    const token = createJSONWebToken(user._id, '20m');

    const cookieOption = {
        expires:new Date (Date.now() + jwtAccessKey * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV ===  'production', // only secure in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'Lax',
    };
    res.cookie('token', token, cookieOption);

    user.password = undefined;
    user.confirmPassword = undefined;
    user.otp = undefined;

    return successResponse(res, {
        statusCode: 200,
        message: 'success',
        token,
        data: {
            user
        }

    })
};

const handleProcessRegister = async (req, res, next) =>{
    try {
        const { name, email, password, confirmPassword } = req.body;

        const userExists = await User.exists({email: email});
        if(userExists){
            throw createError(409, 'User with this email already exists. Please sign in first')
        }

        // create otp 
        const otp = createOTP();

        const otpExpires = Date.now() + 24 * 60 * 60 * 1000;


        // create jwt
        // const tokenPayloadData = {
        //     name,
        //     email,
        //     password,
        //     confirmPassword,
        // };
        // const token = createJSONWebToken(tokenPayloadData, jwtActivationKey, '20m');
    
        // create user
        const newUser = await User.create({
            name,
            email,
            password,
            confirmPassword,
            otp,
            otpExpires,
        })


        // prepare email
        const emailData = {
            email: newUser.email,
            subject: 'OTP for email verification',
            html: `
            <h1> Your OTP is : ${otp} </h1>
            `,
        }
        // send email with nodemailer
        try {
            await emailWithNodeMailer(emailData);

            createSendToken(newUser) 
        } catch (error) {
            next(createError(500, 'Failed to send verification email'));
            return;
        }
        // return successResponse(res, {
        //     statusCode: 200,
        //     message: `Please go to your ${email} for completing your registration process`,
        //     payload: {
        //         newUser
        //     }
        // })

    } catch (error) {
        next(error)
    }
}

// verify user
// const handleActivateUserAccount = async (req, res, next) =>{
//     try {
//         const token = req.body.token;
//         if(!token) throw createError(404, "token not found");

//         try {
//             const decoded = jwt.verify(token, jwtActivationKey);
//             if(!decoded) throw createError(401, "Unable to verify user");

//             const userExists = await User.exists({email: decoded.email});
//             if(userExists) {
//                 throw createError(409, 'User with this email already exists. Please sign in')
//             }

            // create otp 
            // const otp = createOTP();

            // const otpExpires = Date.now() * 24 * 60 * 60 * 1000;

//             // user create
//             // await User.create({decoded, otp, otpExpires});
//             await User.create(decoded)

//             return successResponse(res,{
//                 statusCode: 201,
//                 message: "User was registered successfully",
//             });
//         } catch (error) {
//             if(error.name = 'TokenExpiredError'){
//                 throw createError(401, 'Token has expired');
//             }else if(error.name = 'jsonWebTokenError'){
//                 throw createError(401, 'Invalid Token')
//             }else{
//                 throw error;
//             }
//         }
//     } catch (error) {
//         next(error)
//     }
// }


module.exports = {
    handleProcessRegister,
    // handleActivateUserAccount,
}