const ServiceModel = require("../../models/service.model");

async function PostServiceServices(title, image, description) {
    try {
        // Check if the Service with the given title already exists
        const isService = await ServiceModel.findOne({ where: { title: title } });

        if (isService) {
            return {
                status: false,
                message: "An Service with this title already exists."
            };
        }

        // Create the new Service entry
        const ServiceCreate = await ServiceModel.create({
            title, image, description
        });

        // Return success response with the created data
        return {
            status: true,
            message: "Service has been added successfully.",
            data: ServiceCreate
        };

    } catch (error) {
        console.error("Error in PostServiceServices:", error);
        // Return failure response with a more detailed error message
        return {
            status: false,
            message: "An error occurred while adding the Service.",
            error: error.message // You might want to mask this in production
        };
    }
}

module.exports = PostServiceServices;
