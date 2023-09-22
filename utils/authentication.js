const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const revokedToken = require('../models/revokedTokenModel');


// To authenticate if a user is signed in

const authenticate = async (req, res, next) => {
    try {
        const hasAuthorization = req.headers.authorization;

        if (!hasAuthorization) {
            return res.status(401).json({
                message: 'Action requires sign-in. Please log in to continue.'
            });
        }

        const token = hasAuthorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: 'Action requires sign-in. Please log in to continue.'
            });
        }

        const isTokenRevoked = await revokedToken.exists({ token });

        if (isTokenRevoked) {
            return res.status(401).json({
                message: "Oops! Access denied. Your session has expired. Please sign in again."
            });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decodedToken.userId);

        if (!user) {
            return res.status(404).json({
                message: 'Authentication Failed: User not found'
            });
        }

        req.user = decodedToken;

        next();

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message: "Oops! Access denied. Your session has expired. Please sign in again."
            });
        }
        res.status(500).json({
            message: error.message
        });
    }
};

const isAdmin = async (req, res, next) => {
    try {
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(401).json({ message: "not an admin" });
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  
  module.exports = {
    authenticate,
    isAdmin,
  };