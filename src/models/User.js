const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    accountId: { type: String, required: true, unique: true },
    displayName: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    pasword: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema);