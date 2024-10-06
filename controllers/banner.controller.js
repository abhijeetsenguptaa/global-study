require('dotenv').config();

const multer = require('multer');
const PostBannerServices = require('../services/banner/uploadBanner.service');
const FetchBannerService = require('../services/banner/fetchBanner.service');
const BannerModel = require('../models/banner.model');
const DeleteBannerService = require('../services/banner/deleteBanner.service');
const StatusChangeService = require('../services/banner/statusChanger.service');

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/banners');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        },
    }),
});




async function UploadBannerController(req, res) {
    try {
        const { title, type, url } = req.body;

        let image = '';

        if (req.file) {
            image = 'uploads/banners/' + req.file.filename;
        }

        const createBanner = await PostBannerServices(title, image, type, url);

        return res.status(createBanner.status ? 200 : 404).json({
            status: createBanner.status,
            message: createBanner.message
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
        });
    }
}

async function GetBannerController(req, res) {
    try {
        const { id, status } = req.query;

        const BannerData = await FetchBannerService(id, status);

        return res.status(BannerData.status ? 200 : 404).json({
            status: BannerData.status,
            count: BannerData.status ? BannerData.count : 0,
            data: BannerData.status ? BannerData.data : [],
            message: BannerData.status ? "List of Banners" : BannerData.message
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
        });
    }
}


async function StatusChangeController(req, res) {
    try {
        const id = req.params.id;
        const dataRequired = await StatusChangeService(id);

        return res.status(dataRequired ? 200 : 404).json({
            status: dataRequired.status,
            message: dataRequired.message
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
        });
    }
}

async function DeleteBannerController(req, res) {
    try {
        const id = req.params.id;
        // const categoryItem = await BannerModel.findOne({ where: { id: id } });

        // // Extract the key from the image URL
        // const imageUrlParts = categoryItem.image.split('/');
        // const imageKey = imageUrlParts[imageUrlParts.length - 1];

        // // Delete the image from S3 storage
        // await s3.deleteObject({ Bucket: BUCKET_NAME, Key: 'banners/' + imageKey }).promise();

        // Delete the category from the database
        const deleteSpeaker = await DeleteBannerService(id);

        return res.status(deleteSpeaker.status ? 200 : 404).json({
            status: deleteSpeaker.status,
            message: deleteSpeaker.message
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
        });
    }
}

async function EditBannersController(req, res) {
    try {
        const id = req.params.id;
        const speaker = await BannerModel.findByPk(id);

        if (!speaker) {
            return res.status(404).json({
                status: false,
                message: 'Speaker not found',
            });
        }

        const { title, status, url } = req.body;
        let image = speaker.image; // Existing image URL

        // If a new image is uploaded, handle the update
        if (req.file && req.file.location) {
            // Assuming the new image URL is in req.file.location (for multer-s3)

            // if (image) {
            //     // Extract the key from the current image URL
            //     const imageUrlParts = speaker.image.split('/');
            //     const imageKey = imageUrlParts[imageUrlParts.length - 1];

            //     // Delete the old image from S3 storage
            //     await s3.deleteObject({ Bucket: BUCKET_NAME, Key: 'banners/' + imageKey }).promise();
            // }

            // Update image to the new uploaded file's location
            image = req.file.location;
        }

        // Update speaker details
        if (url) speaker.url = url;
        if (title) speaker.title = title;
        if (status) speaker.status = status;
        speaker.image = image; // Save the new image URL (if updated)

        // Save the updated speaker details to the database
        await speaker.save();

        // Return success response
        return res.status(200).json({
            status: true,
            message: 'Banner has been updated successfully!',
            speaker
        });

    } catch (error) {
        console.error('Error in EditBannerController:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
        });
    }
}

module.exports = { upload, UploadBannerController, GetBannerController, StatusChangeController, DeleteBannerController, EditBannersController };