const TeamModel = require("../../models/team.model");

async function FetchTeamService(id, status, role) {
    try {
        let TeamData;

        if (id) {
            TeamData = await TeamModel.findOne({ where: { id: id } });
            if (!TeamData) {
                return {
                    status: false,
                    message: `Team with ID ${id} not found`
                };
            }
        } else if (status) {
            TeamData = await TeamModel.findAll({ where: { status: status } });
        } else if (role) {
            TeamData = await TeamModel.findAll({ where: { role: role } });
        } else {
            TeamData = await TeamModel.findAll();
        }

        return {
            status: true,
            count: TeamData.length,
            data: TeamData
        };
    } catch (error) {
        console.error("Error retrieving Team:", error);
        return {
            status: false,
            message: "Failed to retrieve Team. Please try again later."
        };
    }
}

module.exports = FetchTeamService;
