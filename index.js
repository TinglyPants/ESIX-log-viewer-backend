const express = require("express");
const app = express();
const historyRoutes = require("./routes/history/historyRoutes");
const processLogs = require("./processLogs");

app.use("/history", historyRoutes);

app.get("/processAll", (req, res) => {
    processLogs();
    res.send("Done.");
});

app.listen(4000, () => {
    console.log("Server is listening on port 4000!");
});
