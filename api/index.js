import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

import leetcodeRouter from "../platforms/leetcode.js";

app.use(express.json());
// API endpoint to get LeetCode stats
app.use("/api/leetcode-stats", leetcodeRouter);

// Root endpoint with usage instructions
app.get("/", (req, res) => {
  res.send(`
    <h1>LeetCode Stats API</h1>
    <p>Use the following endpoint to get LeetCode stats:</p>
    <code>/api/leetcode-stats?username=USERNAME</code>
    <p>Example: <a href="/api/leetcode-stats?username=abcd">/api/leetcode-stats?username=abcd</a></p>
  `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the API at http://localhost:${PORT}/api/leetcode-stats`);
  console.log(
    `Default example: http://localhost:${PORT}/api/leetcode-stats?username=abcd`
  );
});
