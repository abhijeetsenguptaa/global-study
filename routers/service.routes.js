const express = require('express');
const { upload, UploadServiceController, GetServiceController, StatusChangeController, DeleteServiceController, EditServicesController } = require('../controllers/service.controller');

const serviceRoutes = express.Router();


serviceRoutes.post('/upload-service', upload.single('image'), UploadServiceController);
serviceRoutes.get('/', GetServiceController);
serviceRoutes.post('/change-status/:id', StatusChangeController);
serviceRoutes.delete('/delete-service/:id', DeleteServiceController);
serviceRoutes.post('/edit-service/:id', upload.single('image'), EditServicesController);


module.exports = serviceRoutes;