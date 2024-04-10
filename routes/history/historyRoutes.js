const express = require("express");
const router = express.Router();
require("dotenv").config();
const logFolderPath = process.env.LOGS_PATH;
const fs = require("fs");
const path = require("path");

const dateRegex = new RegExp("\\d{1,2}[-]\\d{1,2}[-]\\d{4}");

router.get("/", (req, res) => {
    res.send(
        "Hello! This route will allow you to view the raw history of the ESIX logs."
    );
});

router.get("/:date", (req, res) => {
    const date = req.params.date;
    const isValidDate = dateRegex.test(date);
    if (!isValidDate) {
        res.status(400).send("Please enter a valid date.");
        return;
    }
    fs.readFile(
        path.join(logFolderPath, date + ".txt"),
        "utf8",
        (err, data) => {
            if (err) throw err;
            res.send(data);
        }
    );
});

module.exports = router;
