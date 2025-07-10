require('dotenv').config();
const mongoose = require('mongoose');

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Database is connected successfully');
    } catch (e) {
        console.error('Database connection failed');
        process.exit(1);
    }
}

module.exports = connectToDB;