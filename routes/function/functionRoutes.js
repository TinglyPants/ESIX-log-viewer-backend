const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const dateRegex = new RegExp("\\d{1,2}[-]\\d{1,2}[-]\\d{4}");

//Gets total usage for a given command, showing who used it the most too. e.g: {tingly: 2593, nick: 667}
router.get("/function/:name", (req, res) => {
    // iterate over all logs and get the user
    let functionInfo = [];
    fs.readdir(
        path.join(__dirname, "../../", "processedLogs"),
        (err, files) => {
            for (file of files) {
                // Dont access the globalData
                if (file === "globalData.json") {
                    continue;
                }
                const data = fs.readFileSync(
                    path.join(__dirname, "../../", "processedLogs", file),
                    "utf8"
                );
                const jsonData = JSON.parse(data);

                // If that command wasn't used that day, skip to the next iteration
                if (jsonData.commands[req.params.name] === undefined) {
                    continue;
                }

                functionInfo.push(jsonData.commands[req.params.name]);
            }

            if (functionInfo.length > 0) {
                res.status(200).json(functionInfo);
            } else {
                res.status(404).send("Nothing found for that one.");
            }
        }
    );
});

//Gets command data for a given date.
router.get("/function/:name/:date", (req, res) => {
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

    const jsonData = JSON.parse(data).commands;
    if (jsonData[req.params.name]) {
        res.send(jsonData[req.params.name]);
    } else {
        res.status(404).send("Nothing found for that function.");
    }
});

// Gets a list of all commands and their total usage.
router.get("/list", (req, res) => {
    const data = fs.readFileSync(
        path.join(__dirname, "../../", "processedLogs", "globalData.json"),
        "utf-8"
    );
    res.json(JSON.parse(data).commands);
});

module.exports = router;
