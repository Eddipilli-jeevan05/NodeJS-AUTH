const express = require('express');
const Router = express.Router();
const authMiddleWare = require('../middleware/auth-middleware');
const isAdminUser = require('../middleware/admin-middleware')


Router.get("/welcome", authMiddleWare, isAdminUser, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the Admin's page"
    });
});

module.exports = Router;