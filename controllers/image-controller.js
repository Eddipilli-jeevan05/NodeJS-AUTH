const { uploadToCloudinary } = require('../helpers/cloudinaryHelper');
const fs = require('fs');
const Image = require('../models/Image');
const cloudinary = require('../config/cloudinary');

const uploadImageController = async (req, res) => {
    try {
        //check if file is exists or not 
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'File is required. Please upload an image'
            })
        }

        //Upload to cloudinary
        const { url, publicId } = await uploadToCloudinary(req.file.path);
        //Store the image url and publicId in mongoDB
        const newlyUploadedImage = await Image.create({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        });

        //Delete the file from local storage
        fs.unlinkSync(req.file.path);
        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            image: newlyUploadedImage
        })

    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again'
        });
    }
}

const fetchImagesController = async (req, res) => {
    try {
        const page = parseInt(req.params.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages / limit);

        const sortObj = {};
        sortObj[sortBy] = sortOrder;
        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);
        
        if (images) {
            res.status(200).json({
                success: true,
                currentPage: page,
                totalPages: totalPages,
                totalImages: totalImages,
                data: images
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: true,
            message: "Something went wrong! Please try again"
        })
    }
}

const deleteImageController = async (req, res) => {
    try {
        const getCurrentIdOfImageToBeDeleted = req.params.id;
        const userId = req.userInfo.userId;

        const image = await Image.findById(getCurrentIdOfImageToBeDeleted);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Image is not found"
            });
        }
        //check if image is uploaded by the current user who is tring to delete this image
        if (image.uploadedBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not accessible to delete this image'
            });
        }


        //Delete this image first from your cloudinary storage
        await cloudinary.uploader.destroy(image.publicId);

        await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted);
        res.status(200).json({
            success: true,
            message: 'Image deleted successfully'
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Something wrong! Please try again'
        });
    }
}

module.exports = {
    uploadImageController,
    fetchImagesController,
    deleteImageController
}