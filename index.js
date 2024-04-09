const express = require("express");
const app = express();
const historyRoutes = require("./routes/history/historyRoutes");

app.use("/history", historyRoutes);

app.listen(4000, () => {
    console.log("Server is listening on port 4000!");
});
