const TeamModel = require("../../models/team.model");

async function PostTeamServices(title, image, role) {
    try {
        // Check if the Team with the given title already exists
        const isTeam = await TeamModel.findOne({ where: { title: title } });

        if (isTeam) {
            return {
                status: false,
                message: "An Team with this title already exists."
            };
        }

        // Create the new Team entry
        const TeamCreate = await TeamModel.create({
            title, image, role
        });

        // Return success response with the created data
        return {
            status: true,
            message: "Team has been added successfully.",
            data: TeamCreate
        };

    } catch (error) {
        console.error("Error in PostTeamServices:", error);
        // Return failure response with a more detailed error message
        return {
            status: false,
            message: "An error occurred while adding the Team.",
            error: error.message // You might want to mask this in production
        };
    }
}

module.exports = PostTeamServices;
