import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Missing Codeforces username" });
  }

  // console.log(`Fetching Codeforces data for: ${username}`);

  try {
    //for fetching Codeforces user data
    const response = await fetch(
      `https://codeforces.com/api/user.info?handles=${username}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res
        .status(500)
        .json({ error: "Codeforces API error", details: errorText });
    }

    //for fetching Codeforces solved questions
    const responseSolved = await fetch(
      `https://codeforces.com/api/user.status?handle=${username}`
    );

    if (!responseSolved.ok) {
      const errorText = await responseSolved.text();
      return res
        .status(500)
        .json({ error: "Codeforces API error", details: errorText });
    }

    //for fetching Codeforces contests attended
    const responseContest = await fetch(
      `https://codeforces.com/api/user.rating?handle=${username}`
    );
    if (!responseContest.ok) {
      const errorText = await responseContest.text();
      return res

        .status(500)
        .json({ error: "Codeforces API error", details: errorText });
    }

    const jsonResponse = await response.json();
    const jsonSolved = await responseSolved.json();
    const jsonContest = await responseContest.json();

    if (
      jsonResponse.status !== "OK" ||
      !jsonResponse.result ||
      jsonResponse.result.length === 0
    ) {
      return res.status(404).json({ error: "User not found on Codeforces" });
    }

    const userInfo = jsonResponse.result[0];
    const solvedCount = jsonSolved.result
      .filter((submission) => submission.verdict === "OK")
      //remove duplicates
      .filter(
        (submission, index, self) =>
          index ===
          self.findIndex(
            (s) =>
              s.problem.contestId === submission.problem.contestId &&
              s.problem.index === submission.problem.index
          )
      ).length;

    const contestCount = jsonContest.result.length; //counting the number of contests attended
    //joining the two data
    const userData = {
      ...userInfo,
      solvedCount: solvedCount,
      contestCount: contestCount,
    };

    return res.status(200).json({ success: true, data: userData });
  } catch (err) {
    console.error("Error fetching Codeforces stats:", err.message);
    return res.status(500).json({
      error: "Failed to fetch Codeforces stats",
      details: err.message,
    });
  }
});

router.post("/user-contests", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Missing Codeforces username" });
  }

  try {
    const response = await fetch(
      `https://codeforces.com/api/user.rating?handle=${username}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res
        .status(500)
        .json({ error: "Codeforces API error", details: errorText });
    }

    const jsonResponse = await response.json();

    if (jsonResponse.status !== "OK") {
      return res.status(404).json({ error: "User not found on Codeforces" });
    }

    return res.status(200).json({ success: true, data: jsonResponse.result });
  } catch (err) {
    console.error("Error fetching Codeforces contests:", err.message);
    return res.status(500).json({
      error: "Failed to fetch Codeforces contests",
      details: err.message,
    });
  }
}
);


export default router;
