require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());


// IMPORT ROUTES
const notificationRoutes = require("./routes/notificationRoutes");


// USE ROUTES
app.use("/notifications", notificationRoutes);


app.get("/", (req, res) => {
    res.send("Notification Backend Running");
});


app.listen(3000, () => {
    console.log("Server Started");
});