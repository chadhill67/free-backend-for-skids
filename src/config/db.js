const mongoose = require("mongoose");
async function connectDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("CONNECT TO DATABASE");
    } catch (err) {
        console.error("DATABASE FAILED");
        process.exit(1);
    }
}

module.exports = connectDatabase;