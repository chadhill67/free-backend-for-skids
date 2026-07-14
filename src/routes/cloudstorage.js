const express = require("express");
const app = express();

app.get("/fortnite/api/cloudstorage/system", (req, res) => {
    res.status(200).send({ status: "OK", code: 200 });
});

app.get("/fortnite/api/cloudstorage/user/:accountId", (req, res) => {
    res.status(200).send({ status: "OK", code: 200 });
});

app.put("/fortnite/api/cloudstorage/user/:accountId/:fileName", (req, res) => {
    res.status(200).send({ status: "OK", code: 200 });
});

module.exports = app;
