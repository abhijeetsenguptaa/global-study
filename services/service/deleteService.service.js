const ServiceModel = require('../../models/service.model');
const fs = require('fs').promises;

async function DeleteServiceService(id) {
    try {
        // Find the Speaker by ID
        const ServiceToDelete = await ServiceModel.findOne({ where: { id: id } });

        // If the language doesn't exist, return an error
        if (!ServiceToDelete) {
            return {
                status: false,
                message: 'Service not found!'
            };
        }

        // If the language exists, delete it
        await ServiceToDelete.destroy();

        return {
            status: true,
            message: 'Service deleted successfully'
        };
    } catch (error) {
        console.log(error.message);
        return {
            status: false,
            message: error.message
        };
    }
}

module.exports = DeleteServiceService;
