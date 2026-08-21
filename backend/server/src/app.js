require("dotenv/config");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const app = express();

app.set("trust proxy", 1);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "DevClass Portal API is running" });
});

app.use("/api/analytics", require("./routes/analytics.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/announcements", require("./routes/announcement.routes"));
app.use("/api/notifications", require("./routes/notification.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/activities", require("./routes/activity.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

module.exports = app;
