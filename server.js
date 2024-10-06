// Load environment variables from a .env file
require('dotenv').config();

// Import necessary modules
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import database connection configuration
const connection = require('./configs/connection');
const adminRoutes = require('./routers/admin.routes');
const bannerRoutes = require('./routers/banner.routes');
const teamRoutes = require('./routers/team.routes');
const serviceRoutes = require('./routers/service.routes');





// Set the port for the server to run on, defaulting to 9000 if not specified in the environment
const PORT = process.env.PORT || 9000;

// Create an Express application
const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());


// Fix the missing parenthesis in the following line
app.use(express.static(path.join(__dirname, './views'))); // Add the missing parenthesis and close the 'path.join' function call
app.use('/uploads', express.static('uploads'));
/*Routes*/
app.use('/api/admin', adminRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/services', serviceRoutes);


// Synchronize the database connection and start the server
connection.sync().then(() => {
    app.listen(PORT, () => {
        // Log a message when the server is successfully running
        console.log(`Server is running on port ${PORT}`);
    });
});
