const { DataTypes } = require('sequelize');
const connection = require('../configs/connection');

const ServiceModel = connection.define('services', {
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
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = ServiceModel;
