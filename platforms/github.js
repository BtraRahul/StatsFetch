// export default router;
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { username } = req.body;
  const token = process.env.GITHUB_TOKEN;

  if (!username) {
    return res.status(400).json({ error: "Missing GitHub username" });
  }

  const query = `
    query($userName: String!) { 
      user(login: $userName){
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
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    userName: username,
  };

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    const { data } = await response.json();
    const user = data.user;

    const stars = user.repositories.nodes.reduce(
      (acc, repo) => acc + repo.stargazerCount,
      0
    );
    const forks = user.repositories.nodes.reduce(
      (acc, repo) => acc + repo.forkCount,
      0
    );
    
    //get totalContribtionsCount
    const totalContributionResponse = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}`
    );
    const { total } = await totalContributionResponse.json();
    
    const totalContributions = Object.values(total).reduce(
      (acc, year) => acc + year,
      0
    );

    return res.json({
      totalContributions: totalContributions,
      contributions:
        user.contributionsCollection.contributionCalendar.totalContributions,
      contributionCalendar:
        user.contributionsCollection.contributionCalendar.weeks,
      repositories: user.repositories.totalCount,
      stars,
      forks,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to fetch GitHub GraphQL stats", err });
  }
});

export default router;
