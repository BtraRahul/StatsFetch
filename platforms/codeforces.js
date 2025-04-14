import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Missing Codeforces username" });
  }

  console.log(`Fetching Codeforces data for: ${username}`);

  try {
    const response = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).json({ error: "Codeforces API error", details: errorText });
    }

    const json = await response.json();
    console.log("API response:", json);

    if (json.status !== "OK" || !json.result || json.result.length === 0) {
      return res.status(404).json({ error: "User not found on Codeforces" });
    }

    const userInfo = json.result[0];

    return res.status(200).json({ success: true, data: userInfo });

  } catch (err) {
    console.error("Error fetching Codeforces stats:", err.message);
    return res.status(500).json({ error: "Failed to fetch Codeforces stats", details: err.message });
  }
});

export default router;
