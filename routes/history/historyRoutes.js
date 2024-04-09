const express = require("express");
const router = express.Router();

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

    res.send("Nice!");
});

module.exports = router;
