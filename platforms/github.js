import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { username } = req.body;
  const token = process.env.GITHUB_TOKEN;

  if (!username) return res.status(400).json({ error: "Missing GitHub username" });

  const query = `  
    query {
      user(login: "${username}") {
        repositories(first: 100, ownerAffiliations: OWNER) {
          totalCount
          nodes {
            stargazerCount
            forkCount
          }
        }
        contributionsCollection {
          contributionCalendar {
            totalContributions
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });

    const { data } = await response.json();
    const user = data.user;

    const stars = user.repositories.nodes.reduce((acc, repo) => acc + repo.stargazerCount, 0);
    const forks = user.repositories.nodes.reduce((acc, repo) => acc + repo.forkCount, 0);

    return res.json({
      contributions: user.contributionsCollection.contributionCalendar.totalContributions,
      repositories: user.repositories.totalCount,
      stars,
      forks
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch GitHub GraphQL stats", err });
  }
});

export default router;
