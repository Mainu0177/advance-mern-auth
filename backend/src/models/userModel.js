const { Schema, model } = require("mongoose");
const bcrypt = require('bcryptjs')


const userSchema = new Schema({
    name:{
        type: String,
        required: [true, "User name is required"],
        trim: true,
        minlength: [3, "The length of user name can be minimum 3 characters"],
        maxlength: [31, "The length of user name can be maximum 31 characters"],
    },
    email: {
        type: String, 
        required: [true, "User Email is required"],
        unique: true,
        trip: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)
            },
            message: "please enter a valid email"
        }
    },
    password: {
        type: String,
        required: [true, "User password is required"],
        minlength: [8, "The length of user password can be minimum 8 characters"],
        // set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10))
    },
    confirmPassword: {
        type: String,
        required: [true, 'User confirm password required'],
        minlength: [8, "The length of user password can be minimum 8 characters"],
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: 'Password are not same',
        }
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
        default: null,
    }, 
    otpExpires: {
        type: Date,
        default: null,
    },
    resetPasswordOTP: {
        type: String,
        default: null,
    },
    resetPasswordOTPExpires: {
        type: Date,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

}, {timestamps: true});

userSchema.pre('save', async function (next) {
    if(!this.isModified('password'))
        return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.confirmPassword = undefined;
    
    next();
})

const User = model("Users", userSchema);
module.exports = User