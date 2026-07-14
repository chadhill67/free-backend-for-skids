const express = require("express");
const app = express();
const catalog = require("../responses/catalog.json");

app.get("/fortnite/api/storefront/v2/catalog", (req, res) => {
    res.status(200).send(catalog);
});

app.get("/catalog/api/shared/bulk/offers", (req, res) => {
    res.status(200).send({});
});

module.exports = app;