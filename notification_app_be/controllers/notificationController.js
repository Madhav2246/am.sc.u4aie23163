const notifications = require("../data/notifications");

const Log = require("../../logging_middleware/logger");


// GET ALL NOTIFICATIONS
const getNotifications = async (req, res) => {

    await Log(
        "backend",
        "info",
        "controller",
        "Fetched all notifications"
    );

    res.json(notifications);
};



// CREATE NEW NOTIFICATION
const createNotification = async (req, res) => {

    const newNotification = {
        id: notifications.length + 1,
        type: req.body.type,
        message: req.body.message,
        priority: req.body.priority,
        read: false
    };

    notifications.push(newNotification);

    await Log(
        "backend",
        "info",
        "controller",
        "Created new notification"
    );

    res.json({
        success: true,
        notification: newNotification
    });
};



// GET PRIORITY NOTIFICATIONS
const getPriorityNotifications = async (req, res) => {

    const sortedNotifications = notifications.sort(
        (a, b) => b.priority - a.priority
    );

    await Log(
        "backend",
        "info",
        "controller",
        "Fetched priority notifications"
    );

    res.json(sortedNotifications);
};


module.exports = {
    getNotifications,
    createNotification,
    getPriorityNotifications
};