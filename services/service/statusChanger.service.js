const ServiceModel = require("../../models/service.model");

async function StatusChangeService(id) {
    try {
        // Find the Service by its primary key (id)
        const data = await ServiceModel.findByPk(id);

        // Check if the Service exists
        if (!data) {
            return {
                status: false,
                message: 'Service not found!'
            };
        }

        // Toggle the status (true -> false or false -> true)
        data.status = !data.status;

        // Save the updated Service data
        await data.save();

        return {
            status: true,
            message: 'Status changed successfully!'
        };
    } catch (error) {
        // Return error response in case of exception
        return {
            status: false,
            message: `Error changing status: ${error.message}`
        };
    }
}

module.exports = StatusChangeService;
