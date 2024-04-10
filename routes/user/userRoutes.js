const express = require("express");
const router = express.Router();
const fs = require("fs");
const readline = require("readline");
const path = require("path");

const dateRegex = new RegExp("\\d{1,2}[-]\\d{1,2}[-]\\d{4}");

//Gets all the JSON data for a given user.
router.get("/user/:username", (req, res) => {
    // iterate over all logs and get the user
    let usernameCommandInfo = [];
    fs.readdir(
        path.join(__dirname, "../../", "processedLogs"),
        (err, files) => {
            for (file of files) {
                const data = fs.readFileSync(
                    path.join(__dirname, "../../", "processedLogs", file),
                    "utf8"
                );
                const jsonData = JSON.parse(data).users;
                if (jsonData[req.params.username]) {
                    console.log(jsonData[req.params.username]);
                    usernameCommandInfo.push(jsonData[req.params.username]);
                }
            }
            if (usernameCommandInfo.length > 0) {
                res.status(200).json(usernameCommandInfo);
            } else {
                res.status(404).send("Nothing found for that one.");
            }
        }
    );
});

// Gets the JSON data for a user at a date.
router.get("/user/:username/:date", async (req, res) => {
    const isValidDate = dateRegex.test(req.params.date);
    if (!isValidDate) {
        res.status(400).send("Please enter a valid date.");
        return;
    }

    if (
        !fs.existsSync(
            path.join(
                __dirname,
                "../../",
                "processedLogs",
                req.params.date + ".json"
            )
        )
    ) {
        res.status(404).send("Log file not found for that date.");
        return;
    }

    const data = fs.readFileSync(
        path.join(
            __dirname,
            "../../",
            "processedLogs",
            req.params.date + ".json"
        ),
        "utf8"
    );
    const jsonData = JSON.parse(data).users;
    if (jsonData[req.params.username]) {
        res.send(jsonData[req.params.username]);
    } else {
        res.status(404).send("Nothing found for that user.");
    }
});

//Gets a list of all users, as well as their total command usage
router.get("/list", (req, res) => {
    const data = fs.readFileSync(
        path.join(__dirname, "../../", "processedLogs", "globalData.json"),
        "utf-8"
    );
    res.json(JSON.parse(data));
});

module.exports = router;
