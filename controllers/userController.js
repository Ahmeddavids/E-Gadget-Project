require('dotenv').config();
const userModel = require('../models/userModel');
const otpGenerator = require('otp-generator')
const OTP = require('../models/otpModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { mailTemplate, forgotMailTemplate } = require('../utils/mailTemplates');
const { sendEmail } = require('../utils/sendMail');
const RevokedToken = require('../models/revokedTokenModel')

// User sign up
const signUp = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, email, password } = req.body;

        const emailExists = await userModel.findOne({ email });

        if (emailExists) {
            return res.status(400).json({
                message: `User with Email already exists.`,
            });
        }

        const phoneNumberExists = await userModel.findOne({ phoneNumber });

        if (phoneNumberExists) {
            return res.status(400).json({
                message: `User with Phonenumber already exists.`,
            });
        }

        // Generate OTP
        const otp = otpGenerator.generate(5, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });
        console.log(otp);

        // salt and hash the password using bcrypt
        const salt = bcrypt.genSaltSync(12);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Create a user
        const user = await userModel.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            password: hashedPassword,
        });

        // Create an OTP instance associated with the user
        const otpInstance = await OTP.create({
            otp,
            user: user._id,
        });

        user.lastOtpId = otpInstance._id;
        await user.save();

        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" })
        console.log(token)

        // Construct the OTP email
        const subject = "One-time Verification code";
        const html = await mailTemplate(otp, user.firstName);

        const mail = {
            email: user.email,
            subject,
            html,
        };

        // Send OTP email
        await sendEmail(mail);

        res.status(201).json({
            message: `Check your email: ${user.email} for the One-time Verification code.`,
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                isVerified: user.isVerified,
                token
            },
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Verify OTP
const verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        const { token } = req.params;

        if (!otp) {
            return res.status(400).json({
                message: "Please enter OTP"
            });
        }
        if (!token) {
            return res.status(404).json({
                message: "Token not found"
            });
        }

        // Verify the token and extract the user's email
        const { email } = jwt.verify(token, process.env.JWT_SECRET);

        // Retrieve user from the database based on the email
        const user = await userModel.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check if the user has already been verified
        if (user.isVerified) {
            return res.status(400).json({
                message: "User already verified"
            });
        }

        // Retrieve the stored OTP document based on the user otp input
        const storedOtp = await OTP.findOne({ otp: otp });

        if (!storedOtp) {
            return res.status(404).json({
                message: 'OTP not found or expired'
            });
        }

        // Compare the user-entered OTP with the stored OTP
        if (storedOtp._id.toString() === user.lastOtpId.toString()) {
            user.isVerified = true;
            await user.save();

            return res.status(200).json({
                message: "User verified successfully",
                data: user.isVerified,
            });
        } else {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};



// resend verification
const resendVerificationEmail = async (req, res) => {
    try {
        // get user email from request body
        const { email } = req.body;
        if (!email) {
            return res.status(404).json({
                message: "Please enter email address"
            });
        }

        // find user
        const user = await userModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check if user has already been verified
        if (user.isVerified) {
            return res.status(400).json({
                message: "User already verified"
            });
        }

        // Generate OTP
        const otp = otpGenerator.generate(5, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });
        console.log(otp);

        // Create an OTP instance associated with the user
        const otpInstance = await OTP.create({
            otp,
            user: user._id,
        });

        user.lastOtpId = otpInstance._id;
        await user.save();

        // create a token
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "30 mins" });

        const subject = "One-time Verification code";
        const link = `${req.protocol}://${req.get('host')}/user/verify/${token}`;
        const html = await mailTemplate(otp, user.firstName);
        const mail = {
            email: email,
            subject,
            html,
        };
        sendEmail(mail);

        res.status(200).json({
            message: `Verification email sent successfully to your email: ${user.email}`
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


// Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(404).json({
                message: "Please enter email address"
            });
        }

        // Check if the email exists in the userModel
        const user = await userModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Generate a reset token
        const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "30m" });
        console.log(resetToken)

        const subject = "Password Reset";
        const link = `${req.protocol}://${req.get('host')}/user/reset-password/${resetToken}`;
        const html = await forgotMailTemplate(link, user.firstName);
        const mail = {
            email: email,
            subject,
            html,
        };
        sendEmail(mail);

        res.status(200).json({
            message: "Password reset email sent successfully"
        });
    } catch (error) {
        console.error("Something went wrong", error.message);
        res.status(500).json({
            message: error.message
        });
    }
};


// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        if (!newPassword) {
            return res.status(404).json({
                message: "Please enter a new password"
            });
        }

        // Verify the user's token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Get the user's ID from the token
        const userId = decodedToken.userId;

        // Find the user by ID
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Salt and hash the new password
        const saltedRound = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, saltedRound);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            message: "Password reset successful"
        });
    } catch (error) {
        console.error("Something went wrong", error.message);
        res.status(500).json({
            message: error.message
        });
    }
};


// User login
const userLogin = async (req, res) => {
    try {
        const { password, email, phoneNumber } = req.body;

        // Check if either email or phoneNumber is provided
        if (!email && !phoneNumber) {
            return res.status(400).json({
                message: "Please provide either an email or a phone number"
            });
        }

        let user;

        if (email) {
            // Find user by their registered email
            user = await userModel.findOne({ email: email.toLowerCase() });
        } else if (phoneNumber) {
            // Find user by their registered phone number
            user = await userModel.findOne({ phoneNumber: phoneNumber });
        }

        // Check if the user exists
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Compare user's password with the saved password.
        const checkPassword = bcrypt.compareSync(password, user.password)
        // Check for password error
        if (!checkPassword) {
            return res.status(400).json({
                message: 'Invalid password'
            })
        }

        // Check if the user if verified
        if (!user.isVerified) {
            return res.status(400).json({
                message: `Email Not Verified, Please verify your email to log in.`
            })
        }

        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            isAdmin: user.isAdmin,
            isSuperAdmin: user.isSuperAdmin
        },
            process.env.JWT_SECRET, { expiresIn: "1 day" })

        user.save()

        res.status(200).json({
            message: 'Login successful',
            firstName: user.firstName,
            email: user.email,
            token
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// Change Password
const changePassword = async (req, res) => {
    try {
        const { userId } = req.user;
        const { newPassword, existingPassword } = req.body;
        if (!newPassword || !existingPassword) {
            return res.status(404).json({
                message: "Please enter all fields"
            });
        }

        // Find the user by ID
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Confirm the previous password
        const isPasswordMatch = await bcrypt.compare(existingPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Existing password is incorrect."
            });
        }

        // Salt and hash the new password
        const saltedRound = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(newPassword, saltedRound);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            message: "Password changed successful"
        });
    } catch (error) {
        console.error("Something went wrong", error.message);
        res.status(500).json({
            message: error.message
        });
    }
};


// User sign out
const signOut = async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return res.status(401).json({
                message: 'Missing token'
            });
        }

        const token = authorizationHeader.split(' ')[1];

        // Create a new revoked token entry and save it to the database
        const revokedToken = new RevokedToken({
            token: token
        });

        await revokedToken.save();

        res.status(200).json({
            message: 'User logged out successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// USER CRUD


// Update User
const updateUser = async (req, res) => {
    try {
        const { userId } = req.user;
        const { firstName, lastName, email, phoneNumber } = req.body;

        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(200).json({
                message: `User with id: ${userId} not found`,
            })
        }

        // Construct the data object based on the fields present in the request body
        const data = {};

        if (firstName) {
            data.firstName = firstName
        }

        if (lastName) {
            data.lastName = lastName
        }

        if (phoneNumber) {
            data.phoneNumber = phoneNumber
            const phoneExists = await userModel.findOne({ phoneNumber: phoneNumber })
            if (phoneExists && phoneExists._id.toString() !== userId) {
                return res.status(400).json({
                    message: `Phone Number already exists`
                })
            }
        }

        if (email) {
            data.email = email.toLowerCase();
            const emailExists = await userModel.findOne({ email: email.toLowerCase() })

            if (emailExists && emailExists._id.toString() !== userId) {
                return res.status(400).json({
                    message: `Email already exists.`
                })
            }
        }

        const update = await userModel.findByIdAndUpdate(userId, data, { new: true })

        res.status(200).json({
            message: 'User updated successfully',
            data: update
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: error.message
        })
    }
}



// Delete user
const deleteAccount = async (req, res) => {
    try {
        const { userId } = req.user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(200).json({
                message: `User with id: ${userId} not found`,
            })
        }
        const deletedUser = await userModel.findByIdAndDelete(userId)
        res.status(200).json({
            message: 'User deleted successfully',
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = {
    signUp,
    verifyOTP,
    userLogin,
    signOut,
    resendVerificationEmail,
    forgotPassword,
    changePassword,
    resetPassword,
    updateUser,
    deleteAccount
}