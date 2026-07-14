const express = require("express");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 3551;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.status(200).send({ status: "OK", code: 200 });
});

app.use(require("./src/routes/auth.js"));
app.use(require("./src/routes/account.js"));
app.use(require("./src/routes/version.js"));
app.use(require("./src/routes/lightswitch.js"));
app.use(require("./src/routes/mcp.js"));
app.use(require("./src/routes/storefront.js"));
app.use(require("./src/routes/cloudstorage.js"));
app.use(require("./src/routes/contentpages.js"));
app.use(require("./src/routes/datarouter.js"));
app.use(require("./src/routes/keychain.js"));

app.use((err, req, res, next) => {
    console.error(`Error occurred: ${err.message}`);
    res.status(500).send({
        status: "error",
        message: "Something went wrong!",
    });
});

app.use((req, res, next) => {
    res.on("finish", () => {
        if (res.statusCode >= 400) {
            console.error(`Issue with request: ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
});

app.listen(PORT, () => {
    console.log(`Express Server Started on port ${PORT}`);
});
