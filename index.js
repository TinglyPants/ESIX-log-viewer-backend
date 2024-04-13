const express = require("express");
const app = express();
const historyRoutes = require("./routes/history/historyRoutes");
const userRoutes = require("./routes/user/userRoutes");
const functionRoutes = require("./routes/function/functionRoutes");
const processLogs = require("./processLogs");
const cors = require("cors");

app.use(cors());
app.use("/history", historyRoutes);
app.use("/users", userRoutes);
app.use("/functions", functionRoutes);

const logRouteAndIP = (req, res, next) => {
    console.log(`User with IP: ${req.ip} Accessed: ${req.url}`);
    next();
};

app.use(logRouteAndIP);

app.get("/processAll", (req, res) => {
    processLogs();
    res.send("Done.");
});

app.listen(4000, () => {
    console.log("Server is listening on port 4000!");
});
