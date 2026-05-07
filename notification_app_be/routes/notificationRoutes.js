const express = require("express");
const router = express.Router();
const {getNotifications, createNotification, getPriorityNotifications} = require("../controllers/notificationController");
router.get("/", getNotifications);
router.post("/", createNotification);
router.get("/priority", getPriorityNotifications);
module.exports = router;
