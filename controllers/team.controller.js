require('dotenv').config();

const multer = require('multer');
const PostTeamServices = require('../services/team/uploadTeam.service');
const FetchTeamService = require('../services/team/fetchTeam.service');
const TeamModel = require('../models/team.model');
const DeleteTeamService = require('../services/team/deleteTeam.service');
const StatusChangeService = require('../services/team/statusChanger.service');

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/team');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        },
    }),
});




async function UploadTeamController(req, res) {
    try {
        const { title, role } = req.body;

        let image = '';

        if (req.file) {
            image = 'uploads/team/' + req.file.filename;
        }

        const createTeam = await PostTeamServices(title, image, role);

        return res.status(createTeam.status ? 200 : 404).json({
            status: createTeam.status,
            message: createTeam.message
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
        });
    }
}

async function GetTeamController(req, res) {
    try {
        const { id, status } = req.query;

        const TeamData = await FetchTeamService(id, status);

        return res.status(TeamData.status ? 200 : 404).json({
            status: TeamData.status,
            count: TeamData.status ? TeamData.count : 0,
            data: TeamData.status ? TeamData.data : [],
            message: TeamData.status ? "List of Teams" : TeamData.message
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

async function DeleteTeamController(req, res) {
    try {
        const id = req.params.id;
        // const categoryItem = await TeamModel.findOne({ where: { id: id } });

        // // Extract the key from the image URL
        // const imageUrlParts = categoryItem.image.split('/');
        // const imageKey = imageUrlParts[imageUrlParts.length - 1];

        // // Delete the image from S3 storage
        // await s3.deleteObject({ Bucket: BUCKET_NAME, Key: 'Teams/' + imageKey }).promise();

        // Delete the category from the database
        const deleteSpeaker = await DeleteTeamService(id);

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

async function EditTeamsController(req, res) {
    try {
        const id = req.params.id;
        const speaker = await TeamModel.findByPk(id);

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
            //     await s3.deleteObject({ Bucket: BUCKET_NAME, Key: 'Teams/' + imageKey }).promise();
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
            message: 'Team has been updated successfully!',
            speaker
        });

    } catch (error) {
        console.error('Error in EditTeamController:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
        });
    }
}

module.exports = { upload, UploadTeamController, GetTeamController, StatusChangeController, DeleteTeamController, EditTeamsController };