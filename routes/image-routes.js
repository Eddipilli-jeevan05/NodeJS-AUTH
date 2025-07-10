const express = require('express');
const Router = express.Router();
//Controllers
const { uploadImageController, fetchImagesController, deleteImageController } = require('../controllers/image-controller');


//Importing middlewares
const authMiddleWare = require('../middleware/auth-middleware');
const adminMiddleWare = require('../middleware/admin-middleware');
const uploadMiddleWare = require('../middleware/upload-middleware');
//upload the image

Router.post("/upload",
    authMiddleWare,
    adminMiddleWare,
    uploadMiddleWare.single('image'),
    uploadImageController
);


//Fetch all the images
Router.get("/get", authMiddleWare, fetchImagesController);


//To delete an image
Router.delete("/delete/:id", authMiddleWare, adminMiddleWare, deleteImageController);


module.exports = Router;