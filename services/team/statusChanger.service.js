const TeamModel = require("../../models/team.model");

async function StatusChangeService(id) {
    try {
        // Find the Team by its primary key (id)
        const data = await TeamModel.findByPk(id);

        // Check if the Team exists
        if (!data) {
            return {
                status: false,
                message: 'Team not found!'
            };
        }

        // Toggle the status (true -> false or false -> true)
        data.status = !data.status;

        // Save the updated Team data
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
