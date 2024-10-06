const express = require('express');
const { upload, UploadTeamController, GetTeamController, StatusChangeController, DeleteTeamController, EditTeamsController } = require('../controllers/team.controller');

const teamRoutes = express.Router();


teamRoutes.post('/upload-team', upload.single('image'), UploadTeamController);
teamRoutes.get('/', GetTeamController);
teamRoutes.post('/change-status/:id', StatusChangeController);
teamRoutes.delete('/delete-team/:id', DeleteTeamController);
teamRoutes.post('/edit-team/:id', upload.single('image'), EditTeamsController);


module.exports = teamRoutes;