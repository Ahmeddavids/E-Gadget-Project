const express = require('express');
const { validationSignUp, validationUpdate, validationPassword } = require('../utils/validator');
const { signUp, verifyOTP, userLogin, resetPassword, resendVerificationEmail, forgotPassword, changePassword, signOut, updateUser, deleteAccount } = require('../controllers/userController');
const resendOTPLimiter = require('../utils/resendLimit');
const { authenticate } = require('../utils/authentication');
const { addToCart, removeFromCart, getCart, deleteItemFroCart } = require('../controllers/cartController');
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


// User cart routers
router.route('/add-to-cart/').post(authenticate, addToCart);
router.route('/remove-from-cart/').post(authenticate, removeFromCart);
router.route('/get-cart/').get(authenticate, getCart);
router.route('/delete-from-cart/').delete(authenticate, deleteItemFroCart);

module.exports = router;
