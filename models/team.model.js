const { DataTypes } = require('sequelize');
const connection = require('../configs/connection');

const TeamModel = connection.define('teams', {
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,  // Making sure this field is not null
        defaultValue: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = TeamModel;
