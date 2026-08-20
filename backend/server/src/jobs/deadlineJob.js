const cron = require("node-cron");
const { processDeadlines } = require("../services/deadline.service");

function startDeadlineJob() {
  cron.schedule("*/15 * * * *", async () => {
    try {
      await processDeadlines();
    } catch (err) {
      console.error("[deadline job] failed:", err);
    }
  });

  console.log("Deadline job scheduled (every 15 minutes)");
}

module.exports = startDeadlineJob;
