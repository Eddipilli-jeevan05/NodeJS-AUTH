const { registerUser, loginUser, changePassword } = require('../controllers/auth-controller');
const authMiddleWare = require('../middleware/auth-middleware');
const express = require('express');
const Router = express.Router();

// All routes which are related to the authentication & authorization
Router.post("/register", registerUser);
Router.post("/login", loginUser);
Router.put("/changePassword", authMiddleWare, changePassword);

module.exports = Router;