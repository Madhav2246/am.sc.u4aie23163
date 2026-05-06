import { useEffect, useState } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  Box,
  Paper,
  Avatar,
  Divider,
  Stack,
  Badge
} from "@mui/material";

import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import EventIcon from "@mui/icons-material/Event";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";


function App() {

  const [notifications, setNotifications] = useState([]);

  const [priorityNotifications, setPriorityNotifications] = useState([]);


  // FETCH ALL NOTIFICATIONS
  const fetchNotifications = async () => {

    const response = await fetch(
      "http://localhost:3000/notifications"
    );

    const data = await response.json();

    setNotifications(data);
  };


  // FETCH PRIORITY NOTIFICATIONS
  const fetchPriorityNotifications = async () => {

    const response = await fetch(
      "http://localhost:3000/notifications/priority"
    );

    const data = await response.json();

    setPriorityNotifications(data);
  };


  useEffect(() => {

    fetchNotifications();

    fetchPriorityNotifications();

  }, []);


  // ICONS
  const getIcon = (type) => {

    if (type === "Placement") {
      return <WorkIcon />;
    }

    if (type === "Exam") {
      return <SchoolIcon />;
    }

    return <EventIcon />;
  };


  // CHIP COLORS
  const getColor = (priority) => {

    if (priority >= 90) {
      return "error";
    }

    if (priority >= 70) {
      return "warning";
    }

    return "success";
  };


  return (

    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #eef2ff, #f8fafc)"
      }}
    >


      {/* NAVBAR */}
      <AppBar
        position="sticky"
        elevation={3}
        sx={{
          background: "linear-gradient(to right, #1e293b, #2563eb)"
        }}
      >

        <Toolbar>

          <NotificationsActiveIcon sx={{ mr: 2 }} />

          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ flexGrow: 1 }}
          >
            Campus Notification Dashboard
          </Typography>


          <Badge
            badgeContent={notifications.length}
            color="error"
          >
            <NotificationsActiveIcon />
          </Badge>

        </Toolbar>

      </AppBar>


      <Container maxWidth="xl" sx={{ py: 5 }}>


        {/* TOP CARDS */}
        <Grid container spacing={3}>

          <Grid item xs={12} md={4}>

            <Paper
              elevation={4}
              sx={{
                p: 3,
                borderRadius: 4,
                background: "linear-gradient(to right, #2563eb, #3b82f6)",
                color: "white"
              }}
            >

              <Typography variant="h6">
                Total Notifications
              </Typography>

              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{ mt: 2 }}
              >
                {notifications.length}
              </Typography>

            </Paper>

          </Grid>


          <Grid item xs={12} md={4}>

            <Paper
              elevation={4}
              sx={{
                p: 3,
                borderRadius: 4,
                background: "linear-gradient(to right, #dc2626, #ef4444)",
                color: "white"
              }}
            >

              <Typography variant="h6">
                High Priority
              </Typography>

              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{ mt: 2 }}
              >
                {
                  priorityNotifications.filter(
                    (item) => item.priority >= 70
                  ).length
                }
              </Typography>

            </Paper>

          </Grid>


          <Grid item xs={12} md={4}>

            <Paper
              elevation={4}
              sx={{
                p: 3,
                borderRadius: 4,
                background: "linear-gradient(to right, #059669, #10b981)",
                color: "white"
              }}
            >

              <Typography variant="h6">
                System Status
              </Typography>

              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ mt: 2 }}
              >
                Active
              </Typography>

            </Paper>

          </Grid>

        </Grid>


        {/* ALL NOTIFICATIONS */}
        <Box sx={{ mt: 7 }}>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ mb: 3 }}
          >

            <TrendingUpIcon color="primary" />

            <Typography
              variant="h4"
              fontWeight="bold"
            >
              All Notifications
            </Typography>

          </Stack>


          <Grid container spacing={3}>

            {
              notifications.map((notification) => (

                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={4}
                  key={notification.id}
                >

                  <Card
                    elevation={6}
                    sx={{
                      borderRadius: 5,
                      transition: "0.3s",
                      height: "100%",
                      '&:hover': {
                        transform: "translateY(-6px)",
                        boxShadow: 12
                      }
                    }}
                  >

                    <CardContent>


                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 2 }}
                      >

                        <Avatar
                          sx={{
                            bgcolor: "primary.main"
                          }}
                        >
                          {getIcon(notification.type)}
                        </Avatar>


                        <Chip
                          label={notification.type}
                          color={getColor(notification.priority)}
                        />

                      </Stack>


                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        gutterBottom
                      >
                        {notification.message}
                      </Typography>


                      <Divider sx={{ my: 2 }} />


                      <Typography>
                        Priority Score:
                        <strong>
                          {" "}
                          {notification.priority}
                        </strong>
                      </Typography>


                      <Typography sx={{ mt: 1 }}>
                        Status:
                        <strong>
                          {" "}
                          {notification.read
                            ? "Read"
                            : "Unread"}
                        </strong>
                      </Typography>

                    </CardContent>

                  </Card>

                </Grid>
              ))
            }

          </Grid>

        </Box>


        {/* PRIORITY INBOX */}
        <Box sx={{ mt: 8, pb: 5 }}>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ mb: 3 }}
          >

            <NotificationsActiveIcon color="error" />

            <Typography
              variant="h4"
              fontWeight="bold"
            >
              Priority Inbox
            </Typography>

          </Stack>


          <Grid container spacing={3}>

            {
              priorityNotifications
                .filter((notification) =>
                  notification.priority >= 70
                )
                .map((notification) => (

                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    key={notification.id}
                  >

                    <Card
                      elevation={8}
                      sx={{
                        borderRadius: 5,
                        background:
                          "linear-gradient(to right, #fff1f2, #fee2e2)",
                        border: "2px solid #ef4444",
                        transition: "0.3s",
                        '&:hover': {
                          transform: "scale(1.02)",
                          boxShadow: 12
                        }
                      }}
                    >

                      <CardContent>

                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >

                          <Avatar
                            sx={{
                              bgcolor: "error.main"
                            }}
                          >
                            {getIcon(notification.type)}
                          </Avatar>


                          <Chip
                            label="HIGH PRIORITY"
                            color="error"
                          />

                        </Stack>


                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ mt: 3 }}
                        >
                          {notification.message}
                        </Typography>


                        <Typography sx={{ mt: 2 }}>
                          Type:
                          <strong>
                            {" "}
                            {notification.type}
                          </strong>
                        </Typography>


                        <Typography sx={{ mt: 1 }}>
                          Priority:
                          <strong>
                            {" "}
                            {notification.priority}
                          </strong>
                        </Typography>

                      </CardContent>

                    </Card>

                  </Grid>
                ))
            }

          </Grid>

        </Box>

      </Container>

    </Box>
  );
}

export default App;
