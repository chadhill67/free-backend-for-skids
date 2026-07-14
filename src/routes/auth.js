const express = require("express");
const app = express();
const crypto = require("crypto");
const User = require("../models/User.js");
const Profile = require("../models/Profile.js");
const athena = require("../responses/profiles/athena.json");
const commonCore = require("../responses/profiles/common_core.json");

async function ensureAccount(displayName) {
    let user = await User.findOne({ displayName });
    if (!user) {
        const accountId = crypto.randomBytes(16).toString("hex");
        user = await User.create({
            accountId,
            displayName,
            email: `${displayName}@fortnite.dev`,
            password: "changeme"
        });

        const athenaCopy = JSON.parse(JSON.stringify(athena));
        const coreCopy = JSON.parse(JSON.stringify(commonCore));
        athenaCopy.accountId = accountId;
        coreCopy.accountId = accountId;

        await Profile.create({
            accountId,
            profiles: { athena: athenaCopy, common_core: coreCopy }
        });
    }
    return user;
}

app.post("/account/api/oauth/token", async (req, res) => {
    const displayName = (req.body && req.body.username) ? req.body.username.split("@")[0] : "player";
    const user = await ensureAccount(displayName);

    res.status(200).send({
        access_token: `eg1~${user.accountId}`,
        expires_in: 28800,
        expires_at: "9999-12-02T01:12:01.100Z",
        token_type: "bearer",
        refresh_token: `eg1~${user.accountId}`,
        refresh_expires: 86400,
        refresh_expires_at: "9999-12-02T01:12:01.100Z",
        account_id: user.accountId,
        client_id: "fortnite",
        internal_client: true,
        client_service: "fortnite",
        displayName: user.displayName,
        app: "fortnite",
        in_app_id: user.accountId,
        device_id: user.accountId
    });
});

app.post("/account/api/oauth/verify", (req, res) => {
    res.status(200).send({ token: "eg1~fortnite", session_id: "fortnite", token_type: "bearer" });
});

app.delete("/account/api/oauth/sessions/kill", (req, res) => {
    res.status(200).send({ status: "OK", code: 200 });
});

app.delete("/account/api/oauth/sessions/kill/:token", (req, res) => {
    res.status(200).send({ status: "OK", code: 200 });
});

module.exports = app;