require("dotenv").config();

const express = require("express");

const cors = require("cors");

const app = express();


// ENABLE CORS
app.use(cors());

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