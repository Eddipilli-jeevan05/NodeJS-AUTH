const express = require('express');
const Router = express.Router();
const authMiddleWare = require('../middleware/auth-middleware');

Router.get("/welcome", authMiddleWare, (req, res) => {
    const { username, userId, role } = req.userInfo;
    res.json({
        message: "Welcome to the Home page",
        userInfo: {
            _id: userId,
            username,
            role
        }
    })
})

module.exports = Router;