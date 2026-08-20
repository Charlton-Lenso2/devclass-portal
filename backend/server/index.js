require("dotenv/config");
const app = require("./src/app");
const startDeadlineJob = require("./src/jobs/deadlineJob");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  startDeadlineJob();
});
