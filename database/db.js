const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Database Connection Successful`);
    } catch (error) {
        console.error(`Error in Database Connection: ${error.message}`);
        throw error; // Rethrow the error for the caller to handle
    }
};

module.exports = connectDB;

