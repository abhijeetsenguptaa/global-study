const TeamModel = require('../../models/team.model');
const fs = require('fs').promises;

async function DeleteTeamService(id) {
    try {
        // Find the Speaker by ID
        const TeamToDelete = await TeamModel.findOne({ where: { id: id } });

        // If the language doesn't exist, return an error
        if (!TeamToDelete) {
            return {
                status: false,
                message: 'Team not found!'
            };
        }

        // If the language exists, delete it
        await TeamToDelete.destroy();

        return {
            status: true,
            message: 'Team deleted successfully'
        };
    } catch (error) {
        console.log(error.message);
        return {
            status: false,
            message: error.message
        };
    }
}

module.exports = DeleteTeamService;
