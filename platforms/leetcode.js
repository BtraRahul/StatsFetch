import express from "express";

const leetcodeRouter = express.Router();

const fetchHeaders = {
  "Content-Type": "application/json",
  Referer: "https://leetcode.com",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
};

// 🔹 Fetch user profile and stats
export const fetchLeetCodeStats = async (username) => {
  try {
    const endpoint = "https://leetcode.com/graphql";
    const query = `
      query userProfileData($username: String!) {
        matchedUser(username: $username) {
          username
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          profile {
            ranking
            reputation
            starRating
            realName
          }
          badges {
            id
            displayName
            icon
          }
          problemsSolvedBeatsStats {
            difficulty
            percentage
          }
        }
        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
          totalParticipants
          topPercentage
        }
      }
    `;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: fetchHeaders,
      body: JSON.stringify({ query, variables: { username } }),
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();

    if (!data.data.matchedUser) {
      throw new Error(`User '${username}' not found`);
    }

    const stats = {
      username: data.data.matchedUser.username,
      profile: data.data.matchedUser.profile,
      solved: {
        total: 0,
        easy: 0,
        medium: 0,
        hard: 0,
      },
      contests: data.data.userContestRanking || {
        attended: 0,
        rating: 0,
        ranking: "N/A",
      },
    };

    const submissions = data.data.matchedUser.submitStats.acSubmissionNum;
    submissions.forEach((sub) => {
      if (sub.difficulty === "All") stats.solved.total = sub.count;
      if (sub.difficulty === "Easy") stats.solved.easy = sub.count;
      if (sub.difficulty === "Medium") stats.solved.medium = sub.count;
      if (sub.difficulty === "Hard") stats.solved.hard = sub.count;
    });

    return stats;
  } catch (error) {
    console.error("Error fetching LeetCode stats:", error.message);
    throw error;
  }
};

// 🔹 Fetch user's past contests
export const fetchUserContests = async (username) => {
  try {
    const endpoint = "https://leetcode.com/graphql";
    const query = `
      query userContestRankingInfo($username: String!) {
        userContestRankingHistory(username: $username) {
          attended
          contest {
            title
            startTime
          }
          rating
          ranking
          trendDirection
        }
      }
    `;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: fetchHeaders,
      body: JSON.stringify({ query, variables: { username } }),
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    const attendedContests = data.data.userContestRankingHistory.filter(
      (contest) => contest.attended
    );

    console.log(
      `fetched ` + attendedContests.length + ` contests for user: ${username}`
    );

    return attendedContests;
  } catch (error) {
    console.error("Error fetching user's LeetCode contests:", error.message);
    throw error;
  }
};

// 🔸 Route: POST /
leetcodeRouter.post("/", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res
        .status(400)
        .json({ success: false, error: "Username required" });
    }

    console.log(`Fetching LeetCode stats for user: ${username}`);
    const stats = await fetchLeetCodeStats(username);

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🔸 Route: POST /user-contests
leetcodeRouter.post("/user-contests", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res
        .status(400)
        .json({ success: false, error: "Username required" });
    }

    console.log(`Fetching contest history for: ${username}`);
    const contests = await fetchUserContests(username);

    res.json({ success: true, data: contests });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default leetcodeRouter;
