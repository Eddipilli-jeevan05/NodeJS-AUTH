const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//register controller
async function registerUser(req, res) {
    try {
        //Extract user information from request body
        const { username, email, password, role } = req.body;
        //Check if user is already exists in database
        const checkExistingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (checkExistingUser) {
            return res.status(400).json({
                success: false,
                message: 'User is already exists'
            });
        }
        // Hash the user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create a new user and save in your database
        const newlyCreatedUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        });
        if (newlyCreatedUser) {
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
            })
        } else {
            res.status(400).json({
                success: false,
                message: 'Unable to register user! please try again'
            });
        }

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured! please try again'
        })
    }
}


//login controller

async function loginUser(req, res) {
    try {
        const { username, password } = req.body;
        //Find if the current user is exists in database or not 
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: `User doesn't exist`
            });
        }
        //If the password is correct or not

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        // create user token
        const accessToken = jwt.sign({
            userId: user._id,
            username: user.username,
            role: user.role
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '60m'
        });

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            accessToken
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured! please try again'
        });
    }
}


//Change password

const changePassword = async (req, res) => {
    try {
        const userId = req.userInfo.userId;
        //Extract old password and new password
        const { oldPassword, newPassword } = req.body;

        //Find the current userdata in database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            })
        }

        //Check If the old password is mismatches with DB password
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid old password'
            })
        }


        //Hash the new password
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);

        //update the user password
        user.password = newHashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changes successfully'
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: true,
            message: 'Some error occured! Please try again'
        });

    }
}





module.exports = {
    registerUser,
    loginUser,
    changePassword
}


