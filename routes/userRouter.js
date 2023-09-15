const express = require('express');
const { validationSignUp, validationUpdate, validationPassword } = require('../utils/validator');
const { signUp, verifyOTP, userLogin, resetPassword, resendVerificationEmail, forgotPassword, changePassword, signOut, updateUser, deleteAccount } = require('../controllers/userController');
const resendOTPLimiter = require('../utils/resendLimit');
const { authenticate } = require('../utils/authentication');
const router = express.Router();


router.route('/sign-up').post(validationSignUp, signUp);
router.route('/sign-in').post(userLogin);
router.route('/sign-out').post(signOut);
router.route('/user/verify/:token').post(verifyOTP);
router.route('/user/resend-verification-otp').post(resendOTPLimiter, resendVerificationEmail);
router.route('/user/forgot-password').post(validationUpdate, forgotPassword);
router.route('/user/reset-password/:token').post(validationUpdate, resetPassword);
router.route('/user/change-password').post(authenticate, validationPassword, changePassword);
router.route('/user/update').post(authenticate, validationUpdate, updateUser);
router.route('/user/delete-self').delete(authenticate, deleteAccount);

module.exports = router;