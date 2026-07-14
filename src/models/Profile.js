const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
    accountId: { type: String, required: true, unique: true },
    profiles: { type: Object, required: true }
});

module.exports = mongoose.model("Profile", ProfileSchema);