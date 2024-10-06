const ServiceModel = require("../../models/service.model");

async function FetchServiceService(id, status) {
    try {
        let ServiceData;

        if (id) {
            ServiceData = await ServiceModel.findOne({ where: { id: id } });
            if (!ServiceData) {
                return {
                    status: false,
                    message: `Service with ID ${id} not found`
                };
            }
        } else if (status) {
            ServiceData = await ServiceModel.findAll({ where: { status: status } });
        }  else {
            ServiceData = await ServiceModel.findAll();
        }

        return {
            status: true,
            count: ServiceData.length,
            data: ServiceData
        };
    } catch (error) {
        console.error("Error retrieving Service:", error);
        return {
            status: false,
            message: "Failed to retrieve Service. Please try again later."
        };
    }
}

module.exports = FetchServiceService;
