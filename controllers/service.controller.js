require('dotenv').config();

const multer = require('multer');
const PostServiceServices = require('../services/service/uploadService.service');
const FetchServiceService = require('../services/service/fetchService.service');
const ServiceModel = require('../models/service.model');
const DeleteServiceService = require('../services/service/deleteService.service');
const StatusChangeService = require('../services/service/statusChanger.service');

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/service');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        },
    }),
});




async function UploadServiceController(req, res) {
    try {
        const { title, description } = req.body;

        let image = '';

        if (req.file) {
            image = 'uploads/service/' + req.file.filename;
        }

        const createService = await PostServiceServices(title, image, description);

        return res.status(createService.status ? 200 : 404).json({
            status: createService.status,
            message: createService.message
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
        });
    }
}

async function GetServiceController(req, res) {
    try {
        const { id, status } = req.query;

        const ServiceData = await FetchServiceService(id, status);

        return res.status(ServiceData.status ? 200 : 404).json({
            status: ServiceData.status,
            count: ServiceData.status ? ServiceData.count : 0,
            data: ServiceData.status ? ServiceData.data : [],
            message: ServiceData.status ? "List of Services" : ServiceData.message
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

async function DeleteServiceController(req, res) {
    try {
        const id = req.params.id;
        // const categoryItem = await ServiceModel.findOne({ where: { id: id } });

        // // Extract the key from the image URL
        // const imageUrlParts = categoryItem.image.split('/');
        // const imageKey = imageUrlParts[imageUrlParts.length - 1];

        // // Delete the image from S3 storage
        // await s3.deleteObject({ Bucket: BUCKET_NAME, Key: 'Services/' + imageKey }).promise();

        // Delete the category from the database
        const deleteSpeaker = await DeleteServiceService(id);

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

async function EditServicesController(req, res) {
    try {
        const id = req.params.id;
        const speaker = await ServiceModel.findByPk(id);

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
            //     await s3.deleteObject({ Bucket: BUCKET_NAME, Key: 'Services/' + imageKey }).promise();
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
            message: 'Service has been updated successfully!',
            speaker
        });

    } catch (error) {
        console.error('Error in EditServiceController:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
        });
    }
}

module.exports = { upload, UploadServiceController, GetServiceController, StatusChangeController, DeleteServiceController, EditServicesController };