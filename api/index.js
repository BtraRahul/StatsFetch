import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

import leetcodeRouter from "../platforms/leetcode.js";
import githubRouter from "../platforms/github.js";
import codechefRouter from "../platforms/codechef.js";
import codeforcesRouter from "../platforms/codeforces.js";

app.use(express.json());
// API endpoint to get LeetCode stats
app.use("/api/leetcode-stats", leetcodeRouter);

// API endpoint to get GitHub stats
app.use("/api/github-stats", githubRouter);

// API endpoint to get CodeChef Stats
app.use("/api/codechef-stats", codechefRouter)

// Codeforces API route
app.use("/api/codeforces-stats", codeforcesRouter);

// Root endpoint with usage instructions
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Dev Stats API</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f9f9f9;
            padding: 2rem;
            color: #333;
          }
          h1 {
            color: #2c3e50;
          }
          .endpoint {
            margin-bottom: 2rem;
          }
          code {
            background: #eee;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-size: 1rem;
            display: block;
            margin: 0.5rem 0;
          }
          pre {
            background: #f0f0f0;
            padding: 1rem;
            border-radius: 6px;
            overflow-x: auto;
          }
        </style>
      </head>
      <body>
        <h1>📊 Dev Stats API</h1>

        <div class="endpoint">
          <h2>LeetCode</h2>
          <p><strong>POST</strong> <code>/api/leetcode-stats</code></p>
          <p>Request body:</p>
          <pre>{
  "username": "rahulbatra"
}</pre>
        </div>

        <div class="endpoint">
  <h2>GitHub</h2>
  <p><strong>POST</strong> <code>/api/github-stats</code></p>
  <p>Request body:</p>
  <pre>{
  "username": "rahulbatra"
}</pre>

  <p>Backend uses a GitHub Personal Access Token stored in <code>.env</code> as <code>GITHUB_TOKEN</code>.</p>

  <details>
    <summary><strong>🔐 How to get your GitHub Personal Access Token (GITHUB_TOKEN)</strong></summary>
    <ol>
      <li>Visit <a href="https://github.com/settings/tokens" target="_blank">GitHub → Developer settings → Personal access tokens</a>.</li>
      <li>Click <strong>"Generate new token" → "Fine-grained token"</strong>.</li>
      <li>Name the token (e.g., <code>StatsApp</code>), set an expiration, and grant the following scopes:
        <ul>
          <li><code>read:user</code> – to read public profile info</li>
          <li><code>repo</code> (optional) – only if you want to fetch private repo info</li>
        </ul>
      </li>
      <li>Click <strong>"Generate token"</strong> and <strong>copy it</strong>.</li>
      <li>Save it in your project's <code>.env</code> file like this:
        <pre>GITHUB_TOKEN=ghp_yourGeneratedTokenHere</pre>
      </li>
    </ol>
    <p>✅ Do <strong>not</strong> expose this token on the frontend or in version control.</p>
  </details>

  <p>Use tools like <strong>Postman</strong> or <strong>cURL</strong> to test:</p>
  <pre>
curl -X POST http://https://fetching-profile-stats.vercel.app/api/github-stats \\
     -H "Content-Type: application/json" \\
     -d '{
       "username": "rahulbatra"
     }'
  </pre>
</div>


        <div class="endpoint">
          <h2>Codeforces</h2>
          <p><strong>POST</strong> <code>/api/codeforces-stats</code></p>
          <p>Request body:</p>
          <pre>{
  "username": "rahulbatra"
}</pre>
        </div>

        <div class="endpoint">
          <h2>CodeChef</h2>
          <p><strong>POST</strong> <code>/api/codechef-stats</code></p>
          <p>Request body:</p>
          <pre>{
  "username": "rahulbatra"
}</pre>
        </div>

        <p>Use a tool like <strong>Postman</strong> or <strong>cURL</strong> to test these endpoints.</p>
      </body>
    </html>
  `);
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
